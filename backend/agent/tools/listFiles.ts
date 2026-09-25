import * as fs from 'node:fs/promises';
import type {tool} from '../types/tool.js';
import path from 'path';

export async function listFiles(cwd: string, {directoryPath} : {directoryPath: string}): Promise<string>{
    try {
        const resPath = path.resolve(directoryPath);
        const resPathArr = resPath.split(path.sep);
        const resCwd = path.resolve(cwd);
        const resCwdArr = resCwd.split(path.sep);
        if (resPathArr.length < resCwdArr.length)
            return JSON.stringify({success: false, message: "Path chosen is outside current working directory: " + resCwd});
        
        var i = 0;
        while (i < resCwdArr.length){
            if (resCwdArr[i] !== resPathArr[i])
                return JSON.stringify({success: false, message: "Path chosen is outside current working directory: " + resCwd});
            i++;
}
        const files = await fs.readdir(resPath);
        const res = {success: true, files: files};
        return JSON.stringify(res, null, 2);
    }
    catch(e){
        return JSON.stringify({success: false, message: 'Error reading directory: ' + e});
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
