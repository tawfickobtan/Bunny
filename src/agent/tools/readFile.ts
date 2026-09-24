import * as fs from 'node:fs/promises';
import type {tool} from '../types/tool.js';

export async function readFile({filePath}: {filePath: string}):Promise<string>{
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        return data;
      } catch (error) {
        return 'Error reading file:' + error;
      }

}

export const readFileSchema: tool = {
    type: "function",
    function: {
        name: "readFile",
        description: "Reads content of files.",
        parameters:{
            type: "object",
            properties: {
                filePath : {
                    type: "string",
                    description: "Path of file to read."
                }
            },
            required: ["filePath"]
        }
    }
}

