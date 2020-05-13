import RedisDec from "../decorators/redisDec";

export default class UsersServices {

    @RedisDec.CacheEvict('keyList', 'ceshi')
    static getUserInfo(): string {
        console.log('获取用户信息');
        return 'wyx'
    }
}
