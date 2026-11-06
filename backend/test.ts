import type {thread} from "./agent/types/thread.js";
import client from "./agent/types/llm.js";
import agent from "./agent/harness.js";
import { localStore } from "./localStorage.js";
import {type event} from "./event.js";

const tempStorage = new localStore();
await tempStorage.load();
const tempThread = await tempStorage.create("You are a helpful assistant, to help me with searching the web. Only ever use English.", "Check where does the Nvidia stock currently stand by using web search, tell me if you aren't able to.");

const tempClient = new client("deepseek/deepseek-v4.1-flash-1017", "relace/fp4");
const tempAgent = new agent(tempClient, tempThread);

await tempAgent.run((e: event) => {
    switch(e.type){
        case "tool_result":
            console.log("Tool Response:\n" + e.tool_result.content);
            break;
        case "done":
            console.log("Done!");
            break;
        case "error":
            console.log("Error occured:\n" + e.error);
            break;
        case "message":
            console.log("Agent Responded:\n");
            console.log(e.message);
    }
    console.log("----------");
});
await tempStorage.save();