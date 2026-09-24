import {tavily} from "@tavily/core";
import type {tool} from '../types/tool.js';

const client = tavily({ apiKey: process.env.TAVILY_API_KEY as string});

export async function webSearch({query, k}: {query: string; k?: number}): Promise<string>{
    if (k === undefined) k = 5;
    const response = await client.search(query, {
        searchDepth: "fast",
        maxResults: k,
        include_content: false
    });
    return JSON.stringify(response, null, 2);
}

export const webSearchSchema: tool = {
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

