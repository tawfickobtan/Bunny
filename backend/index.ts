import agent from './agent/agent.js';
import client from './agent/types/llm.js';
import session from './agent/types/session.js';
import express from 'express';
import * as fs from 'node:fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const bunnyPath = path.resolve(process.env.USERPROFILE as string, ".bunny");
await fs.mkdir(bunnyPath, {recursive: true});
const sessionsPath = path.resolve(process.env.USERPROFILE as string, ".bunny/sessions.json");
if (existsSync(sessionsPath)){
  console.log("Sessions file exists!");
}
else{
  console.log("Sessions file doesn't exist!");
  fs.writeFile(sessionsPath,'[]','utf8');
  console.log("Sessions file created!")
}


const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
    console.log("Works");
    res.send('Hello World!');
});

app.get('/health', (req, res) => {
    console.log("Health check 👍");
    res.send('Hello World!');
});

app.post('/response', async (req, res) => {
    const llm = new client("deepseek/deepseek-v4.1-flash","deepinfra/fp8");
    const session1:session = new session("1", "Hello", "./", "You're a helpful assistant.");
    const {msg} = req.body;

    const test: agent = new agent(llm, session1);


    res.setHeader("Content-Type", "text/event-stream");

    test.addUserMessage(msg);
    const out = await test.run((toolcall) => {
      res.write(`data: ${JSON.stringify(toolcall)}\n\n`);
    });
    res.write("\n\n")
    res.write(JSON.stringify(out));
    res.end();
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// curl -N -X POST http://localhost:3000/response -H "Content-Type: application/json" -d "{\"msg\":\"What are the latest updates with Nvidia?\"}"