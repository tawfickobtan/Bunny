import * as fs from 'node:fs/promises';
import type {tool} from '../types/tool.js';

export async function listFiles({directoryPath} : {directoryPath: string}): Promise<string>{
    try {
        const files = await fs.readdir(directoryPath);
        const res = {files: files};
        return JSON.stringify(res, null, 2);
    }
    catch(e){
        return 'Error reading directory: ' + e;
    }
}

export const listFilesSchema: tool = {
    type: 'function',
    function: {
        name: 'listFiles',
        description: 'List files for a given directory.',
        parameters: {
            type: 'object',
            properties: {
                directoryPath: {
                    type: 'string',
                    description: 'Path to list existing files in.'
                }
            },
            required: ["directoryPath"]
        }
    }
}