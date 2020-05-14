import RedisDec from '../decorators/redisDec';

export default class UsersServices {

    /**
     * 获取用户信息服务
     * @param {String} userId 用户id
     * @param {String} ceshi 测试参数
     * @returns {string[]} 返回获取的信息
     */
    @RedisDec.Cacheable('keyList', '#userId#ceshi')
    static getUserInfo(userId: string, ceshi?: string): string[] {
        console.log('获取用户信息');
        return ['a', 'b'];
    }

    /**
     * 改变用户信息服务
     * @returns {boolean} 改变结果
     */
    @RedisDec.CacheEvict('keyList')
    static changeUserInfo(): boolean {
        console.log('修改用户信息');
        return true;
    }
}
