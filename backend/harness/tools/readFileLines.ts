import * as fs from 'node:fs/promises';
import tool, {type toolOutput, type toolSchema} from '../types/tool.js';
import { isInsideCwd } from './common.js';
import path from 'path';

export async function readFileLinesTool(cwd: string, {filePath, startLine, endLine}: {filePath: string, startLine?: number, endLine?: number}):Promise<toolOutput>{
    try {
        const resPath = path.resolve(filePath);
        if (!isInsideCwd(cwd, resPath)) return {ok: false, content: "Path chosen is outside current working directory: " + cwd};
        if (startLine === undefined) startLine = 1;
        let data = await fs.readFile(resPath, { encoding: 'utf8' });
        data = data.replaceAll("\r\n", "\n");
        const arr = data.split("\n");
        if (endLine === undefined) endLine = arr.length;
        startLine = (startLine < 1)? 1: (startLine > arr.length)? arr.length: startLine;
        endLine = (endLine < 1)? 1: (endLine > arr.length)? arr.length: endLine;
        const newArr = arr.slice(startLine - 1, endLine);
        const out = newArr.join("\n");
        const res = {
            totalLines: arr.length,
            startLine: startLine,
            endLine: endLine,
            content: out
        }
        return {ok: true, content: res};
      } catch (e) {
        return {ok: false, content: 'Error reading file:' + ((e instanceof Error)? e.message: String(e))};
      }

}

export const readFileLinesSchema: toolSchema = {
    type: "function",
    function: {
        name: "readFileLines",   
        description: "Reads lines of a file. Returns object which has total number of lines in file, starting line of content, ending line of content (both are 1-indexed), and content itself. If starting and ending lines are left out, by default will return content of whole file.",
        parameters:{
            type: "object",
            properties: {
                filePath : {
                    type: "string",
                    description: "Path of file to read."
                },
                startLine: {
                    type: "number",
                    description: "First line of content to be read."
                },
                endLine: {
                    type: "number",
                    description: "Last line of content to be read."
                }
            },
            required: ["filePath"]
        }
    }
}

const readFileLines = new tool<{filePath: string, startLine?: number, endLine?: number}>(readFileLinesSchema, readFileLinesTool);
export default readFileLines;