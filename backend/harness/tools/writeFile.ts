import tool, {type toolOutput, type toolSchema} from "../types/tool.js";
import * as fs from "node:fs/promises";
import path from 'path';
import { isInsideCwd } from "./common.js";

export async function writeFileTool(cwd: string, {filePath, content}: {filePath: string, content: string}): Promise<toolOutput>{
    try {
        const resPath = path.resolve(filePath);
        if (!isInsideCwd(cwd, resPath)) return {ok: false, content: "Path chosen is outside current working directory: " + cwd};
        await fs.writeFile(resPath, content, 'utf8');
        return {ok: true, content: "Write successful"};
      } catch (e) {
        return {ok: false, content: 'Error writing file:' + ((e instanceof Error)? e.message: String(e))};
      }
    
}

export const writeFileSchema: toolSchema = {
  type: "function",
  function: {
      name: "writeFile",
      description: "Writes content of files.",
      parameters:{
          type: "object",
          properties: {
              filePath : {
                  type: "string",
                  description: "Path of file to write into."
              },
              content:{
                type: "string",
                description: "Content to be written into file."
              }
          },
          required: ["filePath", "content"]
      }
  }
}

const writeFile = new tool<{filePath: string, content: string}>(writeFileSchema, writeFileTool);
export default writeFile;