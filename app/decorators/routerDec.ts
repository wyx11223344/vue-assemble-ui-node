import * as express from "express";

export enum MyType {
    'get' = 'get',
    'post' = 'post'
}

interface routerSet {
    type: string,
    path: string,
    fn: express.RequestHandler
}

export class RouterDec {
    router: express.Router
    baseUrl: string
    routerList: routerSet[] = []

    constructor() {
        this.router = express.Router();
    }

    BaseRequest(path: string) {
        return (constructor: Function) => {
            this.baseUrl = path;
            this.routerList.forEach((item) => {
                this.router[item.type](this.baseUrl + item.path, item.fn)
            })
        }
    }

    RequestMapping(path: string, type: MyType) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            this.routerList.push({
                type: type,
                path: path,
                fn: descriptor.value
            })
        }
    }
}
