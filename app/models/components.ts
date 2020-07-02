export default class Components{
    private id: number;
    private name: string;
    private type: number;
    private usersId: number;
    private status: number

    constructor(id?: number, name?: string, type?: number, usersId?: number, status?: number) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.usersId = usersId;
        this.status = status;
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _name(): string {
        return this.name;
    }

    set _name(value: string) {
        this.name = value;
    }

    get _type(): number {
        return this.type;
    }

    set _type(value: number) {
        this.type = value;
    }

    get _usersId(): number {
        return this.usersId;
    }

    set _usersId(value: number) {
        this.usersId = value;
    }

    get _status(): number {
        return this.status;
    }

    set _status(value: number) {
        this.status = value;
    }
}
