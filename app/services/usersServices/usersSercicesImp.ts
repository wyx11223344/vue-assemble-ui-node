export interface UsersSercicesImp {

    /**
     * 获取用户信息接口
     * @param userId
     * @param ceshi
     */
    getUserInfo(userId: string, ceshi: string): string[];

    /**
     * 改变用户信息接口
     * @param ceshi
     */
    changeUserInfo(ceshi: string): boolean;
}
