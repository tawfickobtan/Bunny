import {exec} from 'child_process';
import {promisify} from 'util';
import tool, {type toolOutput, type toolSchema} from '../types/tool.js';

const asyncExec = promisify(exec);

async function runCommandTool(cwd: string, {command} : {command: string}): Promise<toolOutput>{
    return {ok: false, content: "Tool doesn't work yet :). Make sure to remind user to fix it."}
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