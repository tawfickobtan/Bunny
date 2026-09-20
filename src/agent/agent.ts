import client from './types/llm.js';
import type {tool} from './types/tools.js';
import type session from './types/session.js';

class agent {
    llm: client;
    session: session;
    tools: tool[]

    constructor(client: client, tools: tool[], session: session){
        this.llm = client;
        this.tools = tools;
        this.session = session;
    }

    addUserMessage(message: string){
        this.session.messages.push({role: 'user', content: message});
    }

    async turn(){
        const choices = await this.llm.complete(this.session.messages,  this.tools);
        return choices
    }
}

export default agent;