export default class Components{
    private _id: number;
    private _name: string;
    private _type: number;
    private _usersId: number;
    private _status: number

    constructor(id: number, name: string, type: number, usersId: number, status: number) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._usersId = usersId;
        this._status = status;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get type(): number {
        return this._type;
    }

    set type(value: number) {
        this._type = value;
    }

    get usersId(): number {
        return this._usersId;
    }

    set usersId(value: number) {
        this._usersId = value;
    }

    get status(): number {
        return this._status;
    }

    set status(value: number) {
        this._status = value;
    }
}
