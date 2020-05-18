/**
 * @author WYX
 * @date 2020/5/13
 * @Description: 路由注册装饰器类
*/
import * as express from 'express';

export enum MyType {
    'get' = 'get',
    'post' = 'post'
}

interface RouterSet {
    type: string;
    path: string;
    fn: express.RequestHandler;
}

export class RouterDec {
    router: express.Router
    baseUrl: string
    routerList: RouterSet[] = []

    /**
     * 构造函数
     */
    constructor() {
        this.router = express.Router();
    }

    /**
     * 类的基础路由
     * @param {String} path 基础路由
     * @returns {ClassDecorator} 返回构造函数
     */
    BaseRequest(path: string): ClassDecorator {
        return (): void => {
            this.baseUrl = path;
            this.routerList.forEach((item) => {
                this.router[item.type](this.baseUrl + item.path, item.fn);
            });
        };
    }

    /**
     * 注册路由
     * @param {String} path 路由路径
     * @param {MyType} type 请求方式
     * @returns {MethodDecorator} ts方法装饰器
     */
    RequestMapping(path: string, type: MyType): MethodDecorator {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
            this.routerList.push({
                type: type,
                path: path,
                fn: descriptor.value
            });
        };
    }
}
