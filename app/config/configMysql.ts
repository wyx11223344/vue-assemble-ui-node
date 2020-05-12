/**
 * @author WYX
 * @date 2020/5/12
 * @Description: mysql基础信息配置
*/
import * as mysql from 'mysql';

const $dbConfig: mysql.ConnectionConfig = {

    host: '36.111.183.168', // 这是数据库的地址

    user: 'vueAssemble', // 需要用户的名字

    password: '123321sxy?', // 用户密码 ，如果你没有密码，直接双引号就是

    database: 'vueAssemble' // 数据库名字

};

export default $dbConfig;
