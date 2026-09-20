import type {chatCompletion} from './chatCompletion.js';
import type {message} from './message.js';
import type {choice} from './choice.js';
import type {tool} from './tools.js';
import * as dotenv from 'dotenv';
dotenv.config();

class client {
  model: string;
  provider: string;

  constructor(model: string, provider: string){
    this.model = model;
    this.provider = provider;
  }

  async complete (messages: message[], tools: tool[]): Promise<message | undefined>{
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
    
  // Extract the assistant message with reasoning_details and save it to the response variable
  const result = await response.json() as chatCompletion;
  const choices: choice[] = result.choices;
  const msg: message | undefined = choices[0]?.message;
  return msg;
  }
}

export default client;

