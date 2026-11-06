import type { assistantMessage, toolMessage } from "./harness/types/message.js";

export type event = toolResultEvent | messageEvent | errorEvent | doneEvent;


export type toolResultEvent = {
    type: "tool_result";
    tool_result: toolMessage;
};

export type messageEvent = {
    type: "message";
    message: assistantMessage;
}

export type errorEvent = {
    type: "error";
    error: string;
}

export type doneEvent = {
    type: "done";
}

export function encodeEvent(event: event): string{
    return JSON.stringify(event);
}

export function decodeEvent(eventString: string): event{
    try{
        return JSON.parse(eventString) as event;
    }
    catch(e: any){
        if (e instanceof Error) throw new Error("Error occured: " + e.message);
        throw new Error("Error occured: " + String(e));
    }
}
