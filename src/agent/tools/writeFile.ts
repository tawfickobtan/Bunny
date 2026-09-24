import type { tool } from "../types/tool.js";
import * as fs from "node:fs/promises";

export async function writeFile({filePath, content}: {filePath: string, content: string}): Promise<string>{
    try {
        await fs.writeFile(filePath, content, 'utf8');
        return 'File written successfully!';
      } catch (e) {
        return 'Error writing file: ' + e;
      }
    
}

export const writeFileSchema: tool = {
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
          }
      }
  }
}
