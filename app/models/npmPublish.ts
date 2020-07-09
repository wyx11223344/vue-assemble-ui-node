/**
 * @author WYX
 * @date 2020/7/9
 * @Description: npmPublish实体
*/
export default class NpmPublish{
    private _id: number;
    private _name: string;
    private _componentsIds: string;
    private _version: string;

    constructor(id: number, name: string, componentsIds: string, version: string) {
        this._id = id;
        this._name = name;
        this._componentsIds = componentsIds;
        this._version = version;
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

    get componentsIds(): string {
        return this._componentsIds;
    }

    set componentsIds(value: string) {
        this._componentsIds = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }
}
