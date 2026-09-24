import agent from './agent/agent.js';
import client from './agent/types/llm.js';
import session from './agent/types/session.js';
import type { message } from './agent/types/message.js';
import express from 'express';

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


    test.addUserMessage(msg);
    const out: message = await test.run() as message;

    res.json({response: out})
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


