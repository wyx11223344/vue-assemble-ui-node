import RedisDec from '../../decorators/redisDec';
import {UsersSercicesImp} from './usersSercicesImp';

export default class UsersServices implements UsersSercicesImp{

    /**
     * 获取用户信息服务
     * @param {String} userId 用户id
     * @param {String} ceshi 测试参数
     * @returns {string[]} 返回获取的信息
     */
    @RedisDec.Cacheable('keyList', '#userId#ceshi')
    getUserInfo(userId: string, ceshi?: string): string[] {
        console.log('获取用户信息');
        return ['a', 'b'];
    }

    /**
     * 改变用户信息服务
     * @returns {boolean} 改变结果
     */
    @RedisDec.CacheEvict('keyList')
    changeUserInfo(): boolean {
        console.log('修改用户信息');
        return true;
    }
}
