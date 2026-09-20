import agent from './agent/agent.js';
import client from './agent/llm.js';
import type { tool, tool_call} from './agent/types/tools.js';
import session from './agent/types/session.js';
import type { message } from './agent/types/message.js';
import { constants } from 'node:buffer';

const llm = new client("deepseek/deepseek-v4.1-flash","deepinfra/fp8");
const tools: tool[] = [
    {
       type: "function",
       function: {
        name: "web_search",
        description: "Use to look up a piece of information online",
        parameters: {
            "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "You search stuff"
            }
          },
          "required": ["query"]
        }
       } 
    }
]
const session1:session = new session("1", "Hello", "./", "You're a helpful assistant.");

const test: agent = new agent(llm, tools, session1);
test.addUserMessage("Hello! Whats the capital of france? please search the web.")
const res: message = await test.turn() as message;
const tool_calls: tool_call[]| undefined = res.tool_calls;

console.log(res);
console.log("----------")
console.log(tool_calls);
