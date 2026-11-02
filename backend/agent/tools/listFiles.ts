import * as fs from 'node:fs/promises';
import tool, {type toolSchema} from '../types/tool.js';
import { isInsideCwd } from './common.js';
import path from 'path';

async function listFilesTool(cwd: string, {directoryPath} : {directoryPath: string}): Promise<string>{
    try {
        const resPath = path.resolve(directoryPath);
        if (!isInsideCwd(cwd, resPath)) return JSON.stringify({success: false, message: "Path chosen is outside current working directory: " + cwd});
        const files = await fs.readdir(resPath);
        const res = {success: true, files: files};
        return JSON.stringify(res, null, 2);
    }
    catch(e){
        return JSON.stringify({success: false, message: 'Error reading directory: ' + e});
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