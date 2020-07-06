/**
 * @author WYX
 * @date 2020/5/12
 * @Description: 用户请求sql映射类
*/
import MySql from '../db';

class UsersMapper {

    /**
     * 获取全部用户
     * @returns {void}
     */
    static getAllUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            MySql.query('select * from users')
                .then((results) => {
                    console.log(results);
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

export default UsersMapper;
