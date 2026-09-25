import type { tool } from "../types/tool.js";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY as string});
export async function fetchContent(cwd: string, {url}: {url:string}): Promise<string>{
    try{
    const response = await tvly.extract([url]);
    return JSON.stringify(response, null, 2);
    }
    catch(e){
        return "Error occured calling tool: " + e;
    }
}

export const fetchContentSchema: tool = {
    type: "function",
    function: {
        name: "fetchContent",
        description: "Returns the content of webpage.",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "URL whose content is to be returned."
                }
            },
            required: ["url"]
        }
    }
}
