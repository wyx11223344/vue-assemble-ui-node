/**
 * @author WYX
 * @date 2020/7/9
 * @Description: Codes实体
*/
export default class Codes {
    private _id: number;
    private _name: string;
    private _html: string;
    private _type: number;
    private _componentId: number;

    constructor(id: number, name: string, html: string, componentId: number, type?: number) {
        this._id = id;
        this._name = name;
        this._html = html;
        this._type = type;
        this._componentId = componentId;
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

    get html(): string {
        return this._html;
    }

    set html(value: string) {
        this._html = value;
    }

    get type(): number {
        return this._type;
    }

    set type(value: number) {
        this._type = value;
    }

    get componentId(): number {
        return this._componentId;
    }

    set componentId(value: number) {
        this._componentId = value;
    }
}
