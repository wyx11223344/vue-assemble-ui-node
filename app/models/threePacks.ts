/**
 * @author WYX
 * @date 2020/8/3
 * @Description: 第三方包类
*/
export default class ThreePacks{

	private _id: number;
	private _name: string;
	private _url: string;
	private _version: string;
	private _code: string;
	private _useCode: string;

	constructor(id: number, name: string, url: string, version: string, code: string, useCode: string) {
	    this._id = id;
	    this._name = name;
	    this._url = url;
	    this._version = version;
	    this._code = code;
	    this._useCode = useCode;
	}

	get useCode(): string {
	    return this._useCode;
	}

	set useCode(value: string) {
	    this._useCode = value;
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

	get url(): string {
	    return this._url;
	}

	set url(value: string) {
	    this._url = value;
	}

	get version(): string {
	    return this._version;
	}

	set version(value: string) {
	    this._version = value;
	}

	get code(): string {
	    return this._code;
	}

	set code(value: string) {
	    this._code = value;
	}
}
