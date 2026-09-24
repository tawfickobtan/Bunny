import type {choice} from './choice.js';
export type chatCompletion = {
    model: string;
    choices: choice[];
    provider: string;
}