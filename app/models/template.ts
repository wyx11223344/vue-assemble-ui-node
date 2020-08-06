/**
 * @author WYX
 * @date 2020/8/6
 * @Description: 模板对象类
*/
export default class Template {
	private _id: number;
	private _name: string;
	private _html: string;

	constructor(id: number, name: string, html: string) {
	    this._id = id;
	    this._name = name;
	    this._html = html;
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
}
