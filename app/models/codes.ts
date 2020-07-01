import CodeTypes from './codeTypes';

export default class Codes {
    id: number;
    name: string;
    type: CodeTypes;
    componetId: number;

    constructor(id: number, name: string, type: CodeTypes, componetId: number) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.componetId = componetId;
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        this.id = value;
    }

    get _name(): string{
        return this.name;
    }

    set _name(value: string) {
        this.name = value;
    }

    get _type(): CodeTypes{
        return this.type;
    }

    set _type(value: CodeTypes) {
        this.type = value;
    }

    get _componetId(): number{
        return this.componetId;
    }

    set _componetId(value: number) {
        this.componetId = value;
    }
}
