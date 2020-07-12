/**
 * @author WYX
 * @date 2020/7/9
 * @Description: components实体
*/
export default class Components{
    private _id: number;
    private _name: string;
    private _type: number;
    private _usersId: number;
    private _status: number;
    private _classify: number;

    constructor(id: number, name: string, type: number, usersId: number, status: number, classify?: number) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._usersId = usersId;
        this._status = status;
        this._classify = classify;
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

    get classify(): number {
        return this._classify;
    }

    set classify(value: number) {
        this._classify = value;
    }
}
