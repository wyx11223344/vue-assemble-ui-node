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
                            reqParams += item + '-' + args[index] + '&';
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
                const dueBack: JSON = await setFunction(...args);
                MyRedis.set(`${key}:${propertyKey}:${reqParams}`, JSON.stringify(dueBack));
                RedisDec.changeCacheTime(key, propertyKey, outTime, reqParams);
                return dueBack;
            };
        };
    }

    /**
     * 删除redis缓存
     * @param {String} key 需要删除namespace
     * @returns {MethodDecorator} 返回构造方法
     */
    static CacheEvict(key: string): MethodDecorator{
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
            // 保存现有方法
            const setFunction = descriptor.value;
            // 重写方法
            descriptor.value = (): any => {
                RedisDec.removeAllCache(key);
                return setFunction();
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
     * 删除传入namespace所有key
     * @param {String} key 需要删除key
     * @returns {void}
     */
    private static removeAllCache(key: string): void {
        if (this.CacheNamespace[key]) {
            Object.keys(this.CacheNamespace[key]).forEach((propertyKey) => {
                Object.keys(this.CacheNamespace[key][propertyKey]).forEach((params) => {
                    if (this.CacheNamespace[key][propertyKey][params].time > Math.round((new Date()).getTime() / 1000)) {
                        MyRedis.remove(`${key}:${propertyKey}:${params}`);
                    }
                });
            });
            delete this.CacheNamespace[key];
        }
    }

    /**
     * 返回
     * @param {Function} fn 传入需要进行获取参数的函数
     * @returns {Array} 返回获取参数数组
     */
    private static getFunParams(fn: Function): string[] {
        const regex1 = /\((.+?)\)/g; // () 小括号
        const getList = fn.toString().match(regex1);
        const dealString = getList[0].substring(1, getList[0].length - 1).replace(' ', '');
        return dealString.split(',');
    }
}
