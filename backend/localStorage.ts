import * as fs from "node:fs/promises";
import path from "path";
import {type thread, makeThread} from "./harness/types/thread.js";
import { randomUUID } from 'node:crypto';

export class localStore{
    bunny: string;
    threadsPath: string;
    threads: Record<string, thread>;

    constructor(){
        this.bunny = process.env.USERPROFILE!;
        console.log("Loading from " + this.bunny);
        this.bunny = path.resolve(this.bunny, ".bunny")
        this.threadsPath = path.resolve(this.bunny, "threads.json");
        this.threads = {};
    }

    async load(): Promise<void>{
        await fs.mkdir(this.bunny, {recursive: true});
        try{
            await fs.access(this.threadsPath, fs.constants.F_OK | fs.constants.R_OK);
            console.log("Thread File exists.");
        }
        catch(e){
            console.log("Thread file doesn't exist.")
            await fs.writeFile(this.threadsPath, '{}', 'utf-8');
            console.log("Thread file created.")
        }
        this.threads = JSON.parse(await fs.readFile(this.threadsPath, { encoding: 'utf8' })) as Record<string, thread>;
        console.log("Loaded threads.");
    }
    async save(): Promise<void>{
        await fs.writeFile(this.threadsPath, JSON.stringify(this.threads, null, 2), 'utf-8');
        console.log("Saved threads.");
    }
    getThreads(): Record<string, thread>{
        return this.threads;
    }
    async create(cwd: string, systemPrompt: string): Promise<thread>{
        const current = randomUUID();
        const newThread = makeThread(String(current), "", cwd, systemPrompt);
        this.threads[String(current)] = newThread;
        await this.save();
        return newThread;
    }
}