import client from './types/llm.js';
import tool, {type tool_call, type toolSchema} from './types/tool.js';
import session from './types/session.js';
import type {assistantMessage, message, toolMessage} from './types/message.js';
import readFileLines from './tools/readFileLines.js';
import listFiles from './tools/listFiles.js';
import webSearch from './tools/webSearch.js';
import fetchContent from './tools/fetchContent.js';
import writeFile from './tools/writeFile.js';
import * as dotenv from 'dotenv';
import type { event } from '../event.js';
dotenv.config();

class agent {
    llm: client;
    session: session;
    tools: tool<any>[] = [readFileLines, listFiles, webSearch, fetchContent, writeFile];
    toolSchemas: toolSchema[] = [];
    registry: Record<string, any>;

    constructor(client: client, session: session){
        this.llm = client;
        this.session = session;
        this.registry = {};
        let i = 0;
        while (i < this.tools.length){
            this.registry[this.tools[i]!.schema.function.name] = this.tools[i]?.fn;
            this.toolSchemas.push(this.tools[i]!.schema);
            i++;
        }
    }

    addUserMessage(message: string): void{
        this.session.messages.push({role: 'user', content: message});
    }

    async turn(){
        const msg: message = await this.llm.complete(this.session.messages,  this.toolSchemas);
        this.session.messages.push(msg);
        return msg;
    }

    async executeToolCall(toolCall: tool_call): Promise<string>{
        try{
        if (toolCall.function.name in this.registry){
            return await this.registry[toolCall.function.name](this.session.cwd, JSON.parse(toolCall.function.arguments));
        }
        else {
            return "Tool not found. Make sure tool name is correct.";
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
                const toolResult: toolMessage = {role: "tool", tool_call_id: toolCall.id, content: toolResponse};
                onEvent({type: "tool_result", tool_result: toolResult});
                this.session.messages.push(toolResult);
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
export default agent;