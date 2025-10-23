import axios from 'axios';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface TradingDecision {
  action: 'BUY' | 'SELL' | 'HOLD';
  symbol: string;
  confidence: number;
  reasoning: string;
  suggestedQuantity?: number;
  suggestedPrice?: number;
}

export class OpenRouterClient {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';
  private appName: string;
  private appURL: string;

  constructor(apiKey: string, appName: string = 'QuantMind', appURL: string = 'https://quantmind.vercel.app') {
    this.apiKey = apiKey;
    this.appName = appName;
    this.appURL = appURL;
  }

  async chat(messages: OpenRouterMessage[], model: string = 'anthropic/claude-3.5-sonnet'): Promise<OpenRouterResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': this.appURL,
            'X-Title': this.appName,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      throw new Error(`OpenRouter API failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async getTradingDecision(
    marketData: any,
    portfolioState: any,
    model: string = 'anthropic/claude-3.5-sonnet'
  ): Promise<TradingDecision> {
    const systemPrompt = `You are an expert cryptocurrency trading AI. Analyze market data and portfolio state to make informed trading decisions.

Your response MUST be a valid JSON object with this exact structure:
{
  "action": "BUY" | "SELL" | "HOLD",
  "symbol": "string",
  "confidence": number (0-100),
  "reasoning": "string explaining your decision",
  "suggestedQuantity": number (optional),
  "suggestedPrice": number (optional)
}

Consider:
- Current market trends and price movements
- Portfolio diversification and risk management
- Technical indicators and volume
- Risk/reward ratios
- Position sizing (max 10% of portfolio per position)

Be conservative and prioritize capital preservation.`;

    const userPrompt = `Current Market Data:
${JSON.stringify(marketData, null, 2)}

Portfolio State:
${JSON.stringify(portfolioState, null, 2)}

Based on this data, what trading action should I take? Respond ONLY with the JSON object, no additional text.`;

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this.chat(messages, model);
    const content = response.choices[0].message.content;

    try {
      // Extract JSON from response (in case AI adds extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const decision: TradingDecision = JSON.parse(jsonMatch[0]);

      // Validate decision structure
      if (!decision.action || !decision.symbol || decision.confidence === undefined) {
        throw new Error('Invalid decision structure');
      }

      return decision;
    } catch (error: any) {
      console.error('Failed to parse AI decision:', content);
      // Return safe default
      return {
        action: 'HOLD',
        symbol: marketData.symbol || 'BTC',
        confidence: 0,
        reasoning: `Failed to parse AI response: ${error.message}. Raw response: ${content}`,
      };
    }
  }

  async getMultiModelDecisions(
    marketData: any,
    portfolioState: any,
    models: string[]
  ): Promise<Array<TradingDecision & { model: string }>> {
    const decisions = await Promise.all(
      models.map(async (model) => {
        try {
          const decision = await this.getTradingDecision(marketData, portfolioState, model);
          return { ...decision, model };
        } catch (error: any) {
          console.error(`Model ${model} failed:`, error.message);
          return {
            action: 'HOLD' as const,
            symbol: marketData.symbol || 'BTC',
            confidence: 0,
            reasoning: `Model ${model} failed: ${error.message}`,
            model,
          };
        }
      })
    );

    return decisions;
  }

  calculateConsensus(decisions: Array<TradingDecision & { model: string }>): TradingDecision {
    // Count votes for each action
    const votes = decisions.reduce((acc, d) => {
      acc[d.action] = (acc[d.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find action with most votes
    const consensusAction = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0] as 'BUY' | 'SELL' | 'HOLD';

    // Calculate average confidence for consensus action
    const consensusDecisions = decisions.filter(d => d.action === consensusAction);
    const avgConfidence = consensusDecisions.reduce((sum, d) => sum + d.confidence, 0) / consensusDecisions.length;

    // Combine reasoning
    const reasoning = `Consensus: ${votes[consensusAction]}/${decisions.length} models voted ${consensusAction}. ` +
      consensusDecisions.map(d => `${d.model}: ${d.reasoning}`).join(' | ');

    return {
      action: consensusAction,
      symbol: decisions[0].symbol,
      confidence: avgConfidence,
      reasoning,
    };
  }
}

export default OpenRouterClient;

