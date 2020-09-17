/**
 * @author WYX
 * @date 2020/5/12
 * @Description: mysql基础信息配置
*/
import * as mysql from 'mysql';
import * as fs from 'fs';

const $dbConfig: mysql.ConnectionConfig = JSON.parse(
    fs.readFileSync('/run/secrets/assemble-mysql')
        .toString()
) as mysql.ConnectionConfig;

export default $dbConfig;
