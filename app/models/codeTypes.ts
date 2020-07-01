export default class CodeTypes {
    private id: number;
    private typename: string;

    constructor(id: number, typename: string) {
        this.id = id;
        this.typename = typename;
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _typename(): string {
        return this.typename;
    }

    set _typename(value: string) {
        this.typename = value;
    }
}
