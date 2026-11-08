import { json } from "node:stream/consumers";
import tool, { type toolSchema } from "../types/tool.js";
import { type toolOutput } from "../types/tool.js";
import {tavily} from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY as string});
async function fetchContentTool(cwd: string, {urls}: {urls:string[]}): Promise<toolOutput>{
    try{
    const {results, failedResults} = await tvly.extract(urls);
    return {ok: true, content: JSON.stringify({results, failedResults}, null, 2)};
    }
    catch(e){
        return {ok: false, content: "Error occured calling tool: " + ((e instanceof Error)? e.message: String(e))};
    }
}

const fetchContentSchema : toolSchema = {
    type: "function",
    function: {
        name: "fetchContent",
        description: "Returns the content of webpage.",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "array",
                    items: {type: "string"},
                    description: "List of urls to be fetched."
                }
            },
            required: ["urls"]
        }
    }
}

const fetchContent = new tool<{urls: string[]}>(fetchContentSchema, fetchContentTool);
export default fetchContent;
