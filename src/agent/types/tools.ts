type toolSchema = {
    name: string;
    description: string;
    parameters: Record<string, any>;
}

export type tool = {
    type : "function";
    function: toolSchema;
}

export type tool_call = {
    type: 'function';
    function: {
        name: string;
        arguments: Record<string, any>;
    }
}