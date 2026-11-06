import type {tool_call } from "./tool.js";

export type message = userMessage | systemMessage | assistantMessage | toolMessage;

export type userMessage = {
    role: 'user';
    content: string;
}

export type systemMessage = {
    role: 'system';
    content: string;
}
export type assistantMessage = {
    role: 'assistant';
    content: string;
    reasoning?: string;
    tool_calls?: tool_call[];
}

export type toolMessage = {
    role: 'tool';
    content: string;
    tool_call_id: string;
}



