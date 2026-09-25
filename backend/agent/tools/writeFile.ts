import type { tool } from "../types/tool.js";
import * as fs from "node:fs/promises";
import path from 'path';

export async function writeFile(cwd: string, {filePath, content}: {filePath: string, content: string}): Promise<string>{
    try {
        const resPath = path.resolve(filePath);
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
        await fs.writeFile(filePath, content, 'utf8');
        return JSON.stringify({success: true});
      } catch (e) {
        return JSON.stringify({success: false, message: 'Error writing file: ' + e});
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
          },
          required: ["filePath", "content"]
      }
  }
}
