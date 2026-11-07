import * as fs from "node:fs/promises";
import path from "path";
import {type thread, makeThread} from "./harness/types/thread.js";
import { randomUUID } from 'node:crypto';
import type skill from "./skill.js";

export class localStore{
    bunny: string;
    threadsPath: string;
    threadCache: Record<string, thread>;
    skillsPath: string;
    skills: skill[];

    constructor(){
        this.bunny = path.resolve(process.env.USERPROFILE!, ".bunny")
        console.log("Loading from " + this.bunny);
        this.threadsPath = path.resolve(this.bunny, "threads");
        this.skillsPath = path.resolve(this.bunny, "skills")
        this.threadCache = {};
        this.skills = [];
    }

    async init(): Promise<void>{
        await fs.mkdir(this.threadsPath, {recursive: true});
        await fs.mkdir(this.skillsPath, {recursive: true});
        console.log("Loading threads from: " + this.threadsPath);
        const threadFiles = await fs.readdir(this.threadsPath);
        for (const threadFile of threadFiles){
            this.threadCache[threadFile] = JSON.parse(await fs.readFile(path.resolve(this.threadsPath, threadFile), 'utf-8')) as thread;
            console.log("Loaded: " + threadFile);
        }
    }
    async save(threadId: string): Promise<void>{
        if (Object.hasOwn(this.threadCache, threadId)){
            await fs.writeFile(path.resolve(this.threadsPath, threadId), JSON.stringify(this.threadCache[threadId], null, 2), {encoding: 'utf-8'});
        }
    }
    getAllThreads(): Record<string, thread>{
        return this.threadCache;
    }
    async create(cwd: string, systemPrompt: string): Promise<thread>{
        const current = randomUUID();
        const newThread = makeThread(String(current), "", cwd, systemPrompt);
        this.threadCache[String(current)] = newThread;
        await this.save(String(current));
        return newThread;
    }
}