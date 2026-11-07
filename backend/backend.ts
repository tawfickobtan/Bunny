import express from "express";
import { localStore } from "./localStorage.js";
import agent from "./harness/harness.js";
import client from "./harness/types/llm.js";
import { encodeEvent, type event } from "./event.js";

const store = new localStore();
await store.init();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})

app.get("/health", (req, res) =>{
    res.json({ok: true});
})

app.get("/threads", (req, res) => {
    res.json(store.getAllThreads());
})

app.get("/threads/:id", (req, res) => {
    const t = store.getAllThreads()[req.params.id];
    if (t === undefined) res.status(404).json({error: "Thread not found."})
    else res.json(t);
});

app.post("/threads", async (req, res) => {
    if (req.body.cwd === undefined) {
            res.status(404).json({error: "No cwd in request body."})
    }
    const t = await store.create(req.body.cwd, "You're a helpful assistant with web search!")
    res.json(t);
})

app.post("/threads/:id/messages", async (req, res) => {
    if (store.getAllThreads()[req.params.id] === undefined ||
    req.body.text === undefined || 
    req.body.messageCount === undefined || store.getAllThreads()[req.params.id]?.messages.length != req.body.messageCount) {
        res.status(404).json({error: ""});
        return;
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();               // send headers right now
    const t = store.getAllThreads()[req.params.id]!;
    const c = new client("deepseek/deepseek-v4.1-flash-1017", "relace/fp4")
    const a = new agent(c, t);
    a.addUserMessage(req.body.text);
    await a.run((e: event) => res.write("data: " + encodeEvent(e) + "\n\n"))
    await store.save(req.params.id);
    res.end();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});