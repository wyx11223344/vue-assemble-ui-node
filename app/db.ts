/**
 * @author WYX
 * @date 2020/5/12
 * @Description: mysql连接池配置类
*/
import * as mysql from 'mysql';
import $dbConfig from './config/configMysql';

class MySql{
    private static pool: mysql.Pool = mysql.createPool($dbConfig);

    /**
     * 封装query之sql不带带占位符func
     * @param {String} sql 执行sql
     * @param {Function} MapperReject 执行错误回调方法(推荐传入mapper的reject这样服务层可以捕获catch)
     * @returns {void}
     */
    static query(
        sql: string | mysql.Query,
        MapperReject?: Function
    ): Promise<object> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(
                function(
                    err: mysql.MysqlError,
                    connection: mysql.PoolConnection
                ): void {
                    if (err) {
                        MapperReject && MapperReject(err);
                        reject();
                    }
                    connection.query(
                        sql,
                        function(
                            err: mysql.MysqlError,
                            rows: object
                        ) {
                            if (err) {
                                MapperReject && MapperReject(err);
                                reject(err);
                            }
                            resolve(rows);
                            // 释放链接
                            connection.release();
                        }
                    );
                }
            );
        });
    }

    /**
     * 封装query之sql不带带占位符func
     * @param {String} sql 执行sql
     * @param {*} args 传入占位符
     * @param {Function} MapperReject 执行错误回调方法(推荐传入mapper的reject这样服务层可以捕获catch)
     * @returns {void}
     */
    static queryArgs(
        sql: string,
        args: any,
        MapperReject?: Function
    ): Promise<object> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(
                function(
                    err: mysql.MysqlError,
                    connection: mysql.PoolConnection
                ): void {
                    if (err) {
                        MapperReject && MapperReject(err);
                        reject();
                    }
                    connection.query(
                        sql,
                        args,
                        function(
                            err: mysql.MysqlError,
                            rows: object
                        ) {
                            if (err) {
                                MapperReject && MapperReject(err);
                                reject(err);
                            }
                            resolve(rows);
                            // 释放链接
                            connection.release();
                        }
                    );
                }
            );
        });
    }
}

export default MySql;
