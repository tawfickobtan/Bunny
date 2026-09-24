import type {message} from './message.js';

export default class session  {
    id: string;
    title: string;
    cwd: string;
    messages: message[];

    constructor(id: string, title: string, cwd: string, systemPrompt: string){
        this.id = id;
        this.title = title;
        this.cwd = cwd;
        this.messages = [{role: 'system',content:systemPrompt}];
    }
}