export default class Codes {
    id: number;
    name: string;
    html: string;
    componentId: number;

    constructor(id: number, name: string, html: string, componentId: number) {
        this.id = id;
        this.name = name;
        this.html = html;
        this.componentId = componentId;
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

    get _html(): string{
        return this.html;
    }

    set _html(value: string) {
        this.html = value;
    }

    get _componentId(): number{
        return this.componentId;
    }

    set _componentId(value: number) {
        this.componentId = value;
    }
}
