import client from './types/llm.js';
import type {tool, tool_call} from './types/tool.js';
import type session from './types/session.js';
import type {message} from './types/message.js';
import {readFileSchema, readFile} from './tools/readFile.js';
import {listFiles, listFilesSchema} from './tools/listFiles.js';
import {webSearch, webSearchSchema} from './tools/webSearch.js';
import {fetchContent, fetchContentSchema} from './tools/fetchContent.js';
import {writeFile, writeFileSchema} from './tools/writeFile.js';
import * as dotenv from 'dotenv';
dotenv.config();

class agent {
    llm: client;
    session: session;
    tools: tool[] = [readFileSchema, listFilesSchema, webSearchSchema, fetchContentSchema, writeFileSchema];
    registry: Record<string, any> = {
        "readFile": readFile,
        "listFiles": listFiles,
        "webSearch": webSearch,
        "fetchContent": fetchContent,
        "writeFile": writeFile
    }

    constructor(client: client, session: session){
        this.llm = client;
        this.session = session;
    }

    addUserMessage(message: string): void{
        this.session.messages.push({role: 'user', content: message});
    }

    async turn(){
        const msg: message | undefined = await this.llm.complete(this.session.messages,  this.tools);
        if (msg !== undefined) this.session.messages.push(msg);
        return msg;
    }

    async executeToolCall(toolCall: tool_call | undefined): Promise<string | undefined>{
        if (toolCall === undefined) return undefined;
        if (toolCall.function.name in this.registry){
            return this.registry[toolCall.function.name](JSON.parse(toolCall.function.arguments));
        }
    }

    async run(){
        while (true){
            console.log("Agent Turned.\n");
            const output: message | undefined = await this.turn();
            const tools: tool_call[] | undefined = output?.tool_calls;
            if (tools === undefined){
                return output;
            }

            for (const toolCall of tools){
                const toolResponse = await this.executeToolCall(toolCall);
                if (toolResponse === undefined) continue;
                this.session.messages.push({role: "tool", tool_call_id: toolCall.id, content: toolResponse});
                console.log(toolResponse);
            }
        }
    }


}

export default agent;