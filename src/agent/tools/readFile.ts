import * as fs from 'node:fs/promises';
import type {tool} from '../types/tools.js';

export async function readFileTool(filePath: string):Promise<string>{
    try {
        // Specify 'utf8' encoding to get the content as a string instead of a Buffer
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        return data;
      } catch (error) {
        return 'Error reading file:' + error;
      }

}

export const readFileSchema: tool = {
    type: "function",
    function: {
        name: "readFileTool",
        description: "Reads content of files",
        parameters:{
            type: "object",
            properties: {
                filepath : {
                    type: "string",
                    description: "Path of file to read"
                }
            }
        }
    }
}

