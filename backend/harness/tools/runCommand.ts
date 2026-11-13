import {exec} from 'child_process';
import {promisify} from 'util';
import tool, {type toolOutput, type toolSchema} from '../types/tool.js';

const asyncExec = promisify(exec);

async function runCommandTool(cwd: string, {command, timeout} : {command: string, timeout: number}): Promise<toolOutput>{
    try{
        const { stdout, stderr } = await asyncExec(command, {cwd});
        return {ok: true, content: stdout}
    } 
    catch (error){
        return {ok: false, content: (error instanceof Error)? error.message: String(error)};
    }
}

const runCommandSchema : toolSchema = {
    type: "function",
    function: {
        name: "runCommand",
        description: "Runs shell commands",
        parameters: {
            type: "object",
            properties: {
                "command": {
                    type: "string",
                    description: "Command to run"
                }
            },
            required: ["command"]
        }
    }
}

const runCommand = new tool(runCommandSchema, runCommandTool);
export default runCommand;