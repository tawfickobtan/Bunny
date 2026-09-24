import agent from './agent/agent.js';
import client from './agent/types/llm.js';
import session from './agent/types/session.js';
import type { message } from './agent/types/message.js';
import express  from 'express';

const app = express();
const llm = new client("deepseek/deepseek-v4.1-flash","deepinfra/fp8");
const session1:session = new session("1", "Hello", "./", "You're a helpful assistant.");


const test: agent = new agent(llm, session1);


test.addUserMessage("Give me some of the latest updates on Nvidia");
const res: message = await test.run() as message;

console.log(res);
