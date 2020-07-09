/**
 * @author WYX
 * @date 2020/7/9
 * @Description: codeTypes实体
*/
export default class CodeTypes {
    private _id: number;
    private _typename: string;

    constructor(id: number, typename: string) {
        this._id = id;
        this._typename = typename;
    }
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get typename(): string {
        return this._typename;
    }

    set typename(value: string) {
        this._typename = value;
    }
}
