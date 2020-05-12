/**
 * @author WYX
 * @date 2020/5/12
 * @Description: redis基础信息配置
*/
import * as redis from 'redis';

const $redisConfig: redis.ClientOpts = {

    host: '127.0.0.1',

    port: 6379

};

export default $redisConfig;
