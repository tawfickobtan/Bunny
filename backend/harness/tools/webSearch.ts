import {tavily} from "@tavily/core";
import tool, {type toolOutput, type toolSchema} from '../types/tool.js';

const client = tavily({ apiKey: process.env.TAVILY_API_KEY as string});

export async function webSearchTool(cwd: string, {query, k}: {query: string; k?: number}): Promise<toolOutput>{
    try{
    if (k === undefined) k = 5;
    let {results} = await client.search(query, {
        searchDepth: "fast",
        maxResults: k,
        include_content: false
    });
    for (const result of results){
        delete result.rawContent;
        delete result.images;
    }
    return {ok: true, content: results};
    }
    catch (e) {
        return {ok: false, content: 'Error searching web:' + ((e instanceof Error)? e.message: String(e))};
      }
}

export const webSearchSchema: toolSchema= {
    type: "function",
    function: {
        name: "webSearch",
        description: "Returns results to a web search in the form of a list of items and their links along with a part of their content.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Query to be made."
                },
                k: {
                    type: "integer",
                    description: "Max number of result (Default: 5)"
                }
            },
            required: ["query"]
        }
    }
}

const webSearch = new tool<{query: string; k?: number}>(webSearchSchema, webSearchTool);
export default webSearch;
