import type {assistantMessage} from './message.js';

export type chatCompletion = {
    model: string;
    provider: string;
    choices: {
        index: number;
        message: assistantMessage;
    }[];
}


