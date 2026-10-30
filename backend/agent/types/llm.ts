import type {message, assistantMessage} from './message.js';
import type { toolSchema } from './tool.js';
import type {chatCompletion} from './response.js';
import * as dotenv from 'dotenv';
dotenv.config();

class client {
  model: string;
  provider: string;

  constructor(model: string, provider: string){
    this.model = model;
    this.provider = provider;
  }

  async complete (messages: message[], tools?: toolSchema[]): Promise<assistantMessage>{
    let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": this.model,
        "messages": messages,
        "tools": tools,
        "reasoning": {"enabled": true},
        "provider": {
        "only": [
          this.provider
        ],
        "allow_fallbacks": true
      }
      })
    });
    let completion = await response.json() as chatCompletion;
    let message = completion.choices[0]?.message;
    if (message === undefined) throw new Error("No message");
    return message;
  }
}

export default client;

