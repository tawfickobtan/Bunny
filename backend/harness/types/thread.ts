import type {message} from './message.js';

export type thread = {
    id: string;
    title: string;
    cwd: string;
    messages: message[];
}

export function makeThread(id: string, title: string, cwd: string, systemPrompt: string, userMessage: string): thread{
    return {id,
            title,
            cwd,
            messages:[{role: 'system',content:systemPrompt}, {role: 'user', content: userMessage}]}
}