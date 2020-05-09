// mysql连接池配置文件
import * as mysql from 'mysql';

const $dbConfig: mysql.ConnectionConfig = {

    host: '36.111.183.168', // 这是数据库的地址

    user: 'vueAssemble', // 需要用户的名字

    password: '123321sxy?', // 用户密码 ，如果你没有密码，直接双引号就是

    database: 'vueAssemble' // 数据库名字

};

// 使用连接池，避免开太多的线程，提升性能
const pool: mysql.Pool = mysql.createPool($dbConfig);

/**
 * 封装query之sql不带带占位符func
 * @param {String} sql 执行sql
 * @param {Function} callback 执行回调方法
 * @returns {void}
 */
function query(
    sql: string | mysql.Query,
    callback: mysql.queryCallback
): void {
    pool.getConnection(
        function(
            err: mysql.MysqlError,
            connection: mysql.PoolConnection
        ): void {
            connection.query(
                sql,
                function(
                    err: mysql.MysqlError,
                    rows: any
                ) {
                    callback(err, rows);
                    // 释放链接
                    connection.release();
                }
            );
        }
    );
}

/**
 * 封装query之sql不带带占位符func
 * @param {String} sql 执行sql
 * @param {*} args 传入占位符
 * @param {Function} callback 执行回调方法
 * @returns {void}
 */
function queryArgs(
    sql: string,
    args: any,
    callback: mysql.queryCallback
): void {
    pool.getConnection(
        function(
            err: mysql.MysqlError,
            connection: mysql.PoolConnection
        ): void {
            connection.query(
                sql,
                args,
                function(
                    err: mysql.MysqlError,
                    rows: any
                ) {
                    callback(err, rows);
                    // 释放链接
                    connection.release();
                }
            );
        }
    );
}

// exports
module.exports = {
    query: query,
    queryArgs: queryArgs
};
