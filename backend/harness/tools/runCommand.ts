import {exec} from 'child_process';
import {promisify} from 'util';
import tool, {type toolSchema} from '../types/tool.js';

const asyncExec = promisify(exec);

async function runCommandTool(cwd: string, {command} : {command: string}): Promise<string>{
    try{
    const { stdout, stderr } = await asyncExec(command);
    if (stderr) return "Error occured:\n" + stderr;
    return stdout;
    }
    catch(e){
        return "Error occured:\n" + e;
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