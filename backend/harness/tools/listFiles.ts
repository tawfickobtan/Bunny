import * as fs from 'node:fs/promises';
import tool, {type toolSchema} from '../types/tool.js';
import { isInsideCwd } from './common.js';
import path from 'path';
import type { toolOutput } from '../types/tool.js';

async function listFilesTool(cwd: string, {directoryPath} : {directoryPath: string}): Promise<toolOutput>{
    try {
        const resPath = path.resolve(directoryPath);
        if (!isInsideCwd(cwd, resPath)) 
            return {ok: false, content: "Path chosen is outside current working directory: " + cwd};
        const files = await fs.readdir(resPath);
        return {ok: true, content: files};
    }
    catch(e){
        return {ok: false, content: 'Error reading directory: ' + ((e instanceof Error)? e.message: String(e))};
    }
}

const listFilesSchema: toolSchema = {
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

const listFiles = new tool<{directoryPath: string}>(listFilesSchema, listFilesTool);
export default listFiles;