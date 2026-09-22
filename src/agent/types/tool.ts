export type toolSchema = {
    name: string;
    description: string;
    parameters?:  {
        type: 'object';
        properties: Record<string,any>;
        required?: string[];
    };
}

export type tool = {
    type : "function";
    function: toolSchema;
}

export type tool_call = {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
        
    }
}