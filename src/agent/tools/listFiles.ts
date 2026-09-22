import * as fs from 'node:fs/promises';
import type {tool} from '../types/tool.js';

export async function listFiles(directoryPath: string): Promise<string>{
    try {
        const files = await fs.readdir(directoryPath);
        return files.join('\n');
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
            }
        }
    }
}