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
    ParamsObj: any = {}
    expressParams: any = {}
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
            // 保存现有方法
            const setFunction = descriptor.value;

            descriptor.value = (...arg): void => {

                if (!this.ParamsObj[propertyKey] && !this.expressParams[propertyKey]) {
                    setFunction(...arg);
                    return;
                }

                const paramsList = [];

                if (this.ParamsObj[propertyKey]) {
                    Object.keys(this.ParamsObj[propertyKey]).forEach((item) => {
                        if (type === MyType.post) {
                            paramsList[this.ParamsObj[propertyKey][item].index] = this.ParamsObj[propertyKey][item].type(arg[0].body[item]);
                        } else if (type === MyType.get) {
                            paramsList[this.ParamsObj[propertyKey][item].index] = this.ParamsObj[propertyKey][item].type(arg[0].query[item]);
                        }
                    });
                }

                if (this.expressParams[propertyKey]) {
                    this.expressParams[propertyKey].forEach((item, index) => {
                        if (typeof item === 'number') {
                            paramsList[item] = arg[index];
                        }
                    });
                }

                setFunction(...paramsList);
            };

            // 保存路由
            this.routerList.push({
                type: type,
                path: path,
                fn: descriptor.value
            });
        };
    }

    /**
     * 获取Reuqest
     * @constructor
     * @return {Function} 返回方法
     */
    Request(): (target: any, propertyKey: string, parameterIndex: number) => void {
        return (target: any, propertyKey: string, parameterIndex: number): void => {
            if (!this.expressParams[propertyKey]){
                this.expressParams[propertyKey] = [parameterIndex, null, null];
            } else {
                this.expressParams[propertyKey][0] = parameterIndex;
            }
        };
    }

    /**
     * 获取Response
     * @constructor
     * @return {Function} 返回方法
     */
    Response(): (target: any, propertyKey: string, parameterIndex: number) => void {
        return (target: any, propertyKey: string, parameterIndex: number): void => {
            if (!this.expressParams[propertyKey]){
                this.expressParams[propertyKey] = [null, parameterIndex, null];
            } else {
                this.expressParams[propertyKey][1] = parameterIndex;
            }
        };
    }

    /**
     * 获取NextFunction
     * @constructor
     * @return {Function} 返回方法
     */
    NextFunction(): (target: any, propertyKey: string, parameterIndex: number) => void {
        return (target: any, propertyKey: string, parameterIndex: number): void => {
            if (!this.expressParams[propertyKey]){
                this.expressParams[propertyKey] = [null, null, parameterIndex];
            } else {
                this.expressParams[propertyKey][2] = parameterIndex;
            }
        };
    }

    /**
     * 注册参数
     * @param {String} type 以什么类型获取
     * @param {String} name 获取名称
     * @returns {Function} 返回方法
     */
    RequestParams(type: string, name: string): ParameterDecorator {
        return (target: any, propertyKey: string, parameterIndex: number): void => {
            if (this.ParamsObj[propertyKey]) {
                this.ParamsObj[propertyKey][name] = {
                    type: global[type],
                    index: parameterIndex
                };
            } else {
                this.ParamsObj[propertyKey] = {
                    [name]: {
                        type: global[type],
                        index: parameterIndex
                    }
                };
            }
        };
    }
}
