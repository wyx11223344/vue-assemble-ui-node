/**
 * @author WYX
 * @date 2020/5/13
 * @Description: redis注解类
*/
import MyRedis from '../cache';
import {$redisOutTime} from '../config/configRedis';

interface CacheType {
    time: number;
}

export default class RedisDec {
    private static CacheNamespace: {string: { string: {string: CacheType} }} | {} = {}

    /**
     * 进行key设置
     * @param {String} key 传入key的namespace
     * @param {String} params 传入参数
     * @param {Number} outTime 过期时间
     * @returns {MethodDecorator} 返回方法
     */
    static Cacheable(key: string, params = 'redis', outTime = $redisOutTime.outTime): MethodDecorator {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
            // 保存现有方法
            const setFunction = descriptor.value;

            // 获取方法需要的传参
            const getParams = RedisDec.getFunParams(setFunction);

            // 重写方法
            descriptor.value = async (...args): Promise<JSON> => {
                let reqParams = '';
                if (params !== 'redis') {
                    params.split('#').forEach((item) => {
                        const index = getParams.indexOf(item);
                        if (args[index]) {
                            reqParams += item + '-' + (typeof args[index] === 'object' ? JSON.stringify(args[index]) : args[index]) + '&';
                        }
                    });
                } else {
                    reqParams = 'redis';
                }
                const getValue: string = await MyRedis.get(`${key}:${propertyKey}:${reqParams}`);
                if (getValue) {
                    RedisDec.changeCacheTime(key, propertyKey, outTime, reqParams);
                    return JSON.parse(getValue);
                }

                const dueBack: JSON = await setFunction.bind(target)(...args);
                MyRedis.set(`${key}:${propertyKey}:${reqParams}`, JSON.stringify(dueBack));
                RedisDec.changeCacheTime(key, propertyKey, outTime, reqParams);
                return dueBack;
            };
        };
    }

    /**
     * 删除redis缓存
     * @param {String} key 需要删除namespace
     * @param {String} MypropertyKey 需要删除的方法名
     * @param {String} params 绑定参数
     * @returns {Function} 返回构造方法
     */
    static CacheEvict(key: string, MypropertyKey?: string, params?: string): MethodDecorator{
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
            // 保存现有方法
            const setFunction = descriptor.value;

            // 获取方法需要的传参
            const getParams = RedisDec.getFunParams(setFunction);

            // 重写方法
            descriptor.value = (...args): any => {
                let reqParams = [];
                if (params) {
                    params.split('#').forEach((item) => {
                        const index = getParams.indexOf(item);
                        if (args[index]) {
                            reqParams.push(item + '-' + args[index]);
                        }
                    });
                }
                RedisDec.removeFnCache(key, MypropertyKey, reqParams);
                return setFunction(...args);
            };
        };
    }

    /**
     * 改变过期时间
     * @param {String} key 传入namespace空间
     * @param {String} propertyKey 传入方法名
     * @param {Number} outTime 传入过期时间
     * @param {String} params 传入请求参数
     * @returns {void}
     */
    private static changeCacheTime(key: string, propertyKey: string, outTime: number, params: string): void {
        const setOutTime = Math.round((new Date()).getTime() / 1000) + outTime;
        if (this.CacheNamespace[key]) {
            if (this.CacheNamespace[key][propertyKey]) {
                if (this.CacheNamespace[key][propertyKey][params]) {
                    this.CacheNamespace[key][propertyKey][params].time = setOutTime;
                } else {
                    this.CacheNamespace[key][propertyKey][params] = { time: setOutTime } as CacheType;
                }
            } else {
                this.CacheNamespace[key][propertyKey] = {[params]: {time: setOutTime}} as {string: CacheType};
            }
        } else {
            this.CacheNamespace[key] = {[propertyKey]: {[params]: {time: setOutTime}}} as{ string: {string: CacheType} };
        }
        MyRedis.exp(`${key}:${propertyKey}:${params}`, outTime);
    }

    /**
     * 通过方法判断移出
     * @param {String} key 传入namespace空间
     * @param {String} propertyKey 传入方法名
     * @param {String} params 绑定参数
     * @returns {void}
     */
    static removeFnCache(key: string, propertyKey?: string, params?: string[]): void {
        if (this.CacheNamespace[key]) {
            Object.keys(this.CacheNamespace[key]).filter((item: string) => {
                if (!propertyKey) {
                    return true;
                }
                if (propertyKey === item) {
                    return true;
                }
            }).forEach((propertyKeyO: string) => {
                Object.keys(this.CacheNamespace[key][propertyKeyO]).filter((item: string) => {
                    if (params.length === 0){
                        return true;
                    } else {
                        let check = true;
                        params.forEach((eachItem: string) => {
                            if (item.indexOf(eachItem) === -1) {check = false;}
                        });
                        return check;
                    }
                }).forEach((paramsO: string) => {
                    if (this.CacheNamespace[key][propertyKeyO][paramsO].time > Math.round((new Date()).getTime() / 1000)) {
                        MyRedis.remove(`${key}:${propertyKeyO}:${paramsO}`);
                    }
                });
            });
            if (!propertyKey && params) {
                delete this.CacheNamespace[key];
            }
        }

    }

    /**
     * 返回
     * @param {Function} fn 传入需要进行获取参数的函数
     * @returns {Array} 返回获取参数数组
     */
    private static getFunParams(fn: Function): string[] {
        const regex1 = /\((.*?)\)/; // () 小括号
        const getList = fn.toString().match(regex1);
        const dealString = getList[1].replace(/ /g, '');
        return dealString.split(',');
    }
}
