import type { tool_call } from "./tool.js";

export type message = {
    role: 'system'|'user'|'assistant'|'tool';
    content: string;
    reasoning?: string;
    tool_calls?: tool_call[];
    tool_call_id?: string;
}

