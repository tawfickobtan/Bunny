export default class skill {
    params: Record<string, any>
    content: string;

    constructor(original: string) {
        this.params = {}
        this.content = original;
    }
}