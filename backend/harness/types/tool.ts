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
    fn: (cwd: string, params: T) => Promise<string>;

    constructor(schema: toolSchema, fn: (cwd: string, params: T) => Promise<string>){
        this.schema = schema;
        this.fn = fn;
    }
}