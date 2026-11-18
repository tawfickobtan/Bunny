import client from './types/llm.js';
import tool, {type tool_call, type toolSchema, type toolOutput} from './types/tool.js';
import {type thread} from './types/thread.js';
import type {assistantMessage, message, toolMessage} from './types/message.js';
import readFileLines from './tools/readFileLines.js';
import listFiles from './tools/listFiles.js';
import webSearch from './tools/webSearch.js';
import fetchContent from './tools/fetchContent.js';
import writeFile from './tools/writeFile.js';
import * as dotenv from 'dotenv';
import type { event } from '../event.js';
import runCommand from './tools/runCommand.js';
dotenv.config();

export default class harness {
    llm: client;
    thread: thread;
    tools: tool<any>[] = [readFileLines, listFiles, webSearch, fetchContent, writeFile, runCommand];
    toolSchemas: toolSchema[] = [];
    registry: Record<string, (cwd: string, params: any) => Promise<toolOutput>>;

    constructor(client: client, thread: thread){
        this.llm = client;
        this.thread = thread;
        this.registry = {};
        let i = 0;
        while (i < this.tools.length){
            this.registry[this.tools[i]!.schema.function.name] = this.tools[i]?.fn!;
            this.toolSchemas.push(this.tools[i]!.schema);
            i++;
        }
    }

    addUserMessage(message: string): void{
        this.thread.messages.push({role: 'user', content: message});
    }

    async turn(){
        const msg: message = await this.llm.complete(this.thread.messages,  this.toolSchemas);
        this.thread.messages.push(msg);
        return msg;
    }

    async executeToolCall(toolCall: tool_call): Promise<string>{
        // Reminder to fix this to unify tool response to match tooloutput
        try{
        if (toolCall.function.name in this.registry){
            return JSON.stringify(await this.registry[toolCall.function.name]!(this.thread.cwd, JSON.parse(toolCall.function.arguments)), null, 2);
        }
        else {
            return JSON.stringify({ok: false, content: "Tool not found. Make sure tool name is correct."}, null, 2);
        }
        }
        catch(e: any){
            if (e instanceof Error) return "Error occured: " + e.message;
            return "Error occured: " + String(e);
        }
    }
    async run(onEvent: (e: event) => void){
        try{
        while (true){
            console.log("Agent Turned.\n");
            const output: assistantMessage = await this.turn();
            onEvent({type:"message", message: output});
            const tools: tool_call[] | undefined = output.tool_calls;
            if (tools === undefined) {
                onEvent({type:"done"});
                return;
            };

            for (const toolCall of tools){
                const toolResponse = await this.executeToolCall(toolCall);
                const toolResult: toolMessage = {role: "tool", tool_call_id: toolCall.id, content: JSON.stringify(toolResponse, null, 2)};
                onEvent({type: "tool_result", tool_result: toolResult});
                this.thread.messages.push(toolResult);
            }
        }
    }
    catch(e: any){
        if (e instanceof Error) onEvent({type:"error", error: e.message});
        else onEvent({type: "error", error: String(e)});
    }
    onEvent({type: "done"});
}
}