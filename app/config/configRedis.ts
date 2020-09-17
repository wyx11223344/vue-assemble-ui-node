/**
 * @author WYX
 * @date 2020/5/12
 * @Description: redis基础信息配置
*/
import * as redis from 'redis';
import * as fs from 'fs';

const $redisConfig: redis.ClientOpts = JSON.parse(
    fs.readFileSync('/run/secrets/assemble-redis')
        .toString()
) as redis.ClientOpts;

export const $redisOutTime = {

    outTime: 60 * 30

};

export default $redisConfig;

