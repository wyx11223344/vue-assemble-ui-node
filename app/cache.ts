/**
 * @author WYX
 * @date 2020/5/12
 * @Description: 对常用进行了封装（未封装无序和有序的内容）MyRedis类
 * 注: 对于ts类型检测，调用getFun方法的类型检测有问题(所以使用any),多重调用后类型检测的包含关系混乱
*/
import * as Redis from 'redis';
import $redisConfig from './config/configRedis';
import {Callback} from "redis";

const redisClient = Redis.createClient($redisConfig);

redisClient.auth('123321sxy?', function () {
    console.log('redis登录成功');
});

redisClient.on('error', function (err) {
    console.log(err);
});

class MyRedis {
    static redisClient: Redis.RedisClient = redisClient

    /**
     * set 普通的set/get 字符串型
     * @param {String} key 键值
     * @param {String} value 保存值
     * @returns {void}
     */
    static set(key: string, value: string): void {
        this.redisClient.set(key, value, this.errFun);
    }

    /**
     * get 普通的set/get 字符串型
     * @param {String} key 键值
     * @returns {Promise<String>} 返回值
     */
    static get(key): Promise<string> {
        return this.getFun((fn: Callback<string>) => {
            this.redisClient.get(key, fn);
        })
    }

    /**
     * 设置key失效时间
     * @param {String} key 设置键
     * @param {Number} time 失效时长
     * @returns {void}
     */
    static exp(key: string, time: number): void {
        this.redisClient.expire(key, time, this.errFun);
    }

    /**
     * 删除key
     * @param {String} key 删除键
     * @returns {void}
     */
    static remove(key: string): void {
        this.redisClient.del(key, this.errFun);
    }

    /**
     * 单个key存储  hash
     * @param {String} key 设置键
     * @param {String} value hash的值
     * @param {String} field hash的key
     * @returns {void}
     */
    static hset(key: string, field: string, value: string): void {
        this.redisClient.hset(key, field, value, this.errFun);
    }

    /**
     * 单个key获取  hash
     * @param {String} key hash设置键
     * @param {String} field 获取的可以
     * @returns {void}
     */
    static hget(key: string, field: string): Promise<string> {
        return this.getFun((fn: Callback<string>) => {
            this.redisClient.hget(key, field, fn);
        });
    }

    /**
     * 多个key存储  hash
     * @param {String} key hash设置键
     * @param {Object} argObj 需要传入的对象(暂时只封装对象传输)
     * @returns {void}
     */
    static hmset(key: string, argObj: {[key: string]: string|number}): void {
        this.redisClient.hmset(key, argObj, this.errFun);
    }

    /**
     * 多个key获取  hash
     * @param {String} key hash设置键
     * @param {Array<String>} argList 需要查询的数组
     * @returns {Promise<any>} 返回查询结果
     */
    static hmget(key: string, argList: Array<string>): Promise<string> {
        return this.getFun((fn: Callback<string[]>) => {
            this.redisClient.hmget(key, argList, fn);
        });
    }

    /**
     * 多个key获取  hash
     * @param {String} key hash设置键
     * @param {Array<String>} argList 需要查询的数组
     * @returns {Promise<any>} 返回查询结果
     */
    static hgetall(key: string): Promise<string> {
        return this.getFun((fn: Callback<{ [key: string]: string }>) => {
            this.redisClient.hgetall(key, fn);
        });
    }

    /**
     * 设定无返回操作错误处理
     * @param {null|Error} err
     */
    private static errFun(err: null | Error): void {
        if (err) {
            console.log(err);
        }
    }

    /**
     * 对获取函数进行Promise封装
     * @param fn
     * @returns {Promise<string|string[]>}
     */
    private static getFun(fn: Function): Promise<any>{
        return new Promise<string>((resolve, reject) => {
            fn((err: null | Error, getRslt: any): void => {
                if (err) {
                    reject();
                    throw err;
                }
                resolve(getRslt);
            })
        })
    }
}

export default MyRedis;
