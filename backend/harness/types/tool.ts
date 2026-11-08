export type toolSchema = {
    type : "function";
    function: {
    name: string;
    description: string;
    parameters?:  {
        type: 'object';
        properties: Record<string,any>;
        required?: string[];
    }
}
}

export type toolOutput = {
    ok: boolean;
    content: any
};

export type tool_call = {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
        
    }
}

export default class tool<T>{
    schema: toolSchema;
    fn: (cwd: string, params: T) => Promise<toolOutput>;

    constructor(schema: toolSchema, fn: (cwd: string, params: T) => Promise<toolOutput>){
        this.schema = schema;
        this.fn = fn;
    }
}