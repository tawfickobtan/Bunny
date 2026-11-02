import { webSearchSchema } from "./agent/tools/webSearch.js";
import client from "./agent/types/llm.js";
import type { assistantMessage, message } from "./agent/types/message.js";

const temp = new client("particle-ai/particle-1", "particle-ai")

const messages: message[] = [{"role": "system", "content": "Find me where EGX30 currently stands"}];


const msg = await(temp.complete(messages, [webSearchSchema]))

console.log(msg);
