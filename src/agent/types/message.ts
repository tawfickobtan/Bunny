import type { tool_call } from "./tools.js";

export type message = {
    role: 'system'|'user'|'assistant';
    content: string;
    reasoning?: string;
    tool_calls?: tool_call[];
}

