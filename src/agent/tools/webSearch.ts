import {tavily} from "@tavily/core";
import type {tool} from '../types/tool.js';

const client = tavily({ apiKey: process.env.TAVILY_API_KEY as string});

export async function webSearch({query}: {query: string}): Promise<string>{
    const response = await client.search("", {
        searchDepth: "fast",
        maxResults: 5
    });
    return JSON.stringify(response);
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
                }
            },
            required: ["query"]
        }
    }
}