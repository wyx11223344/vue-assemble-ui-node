/**
 * @author WYX
 * @date 2020/8/3
 * @Description: 第三方包数据库请求
*/
import MySql from '../db';
import ThreePacks from '../models/threePacks';

class ThreePacksMapper {

    /**
     * 获取三方包
     * @param {String} name 获取名称
     * @returns {Promise<ThreePacks[]>}
     */
    static getThreePacks(name: string): Promise<ThreePacks[]> {
        console.log(`select * from threePacks where name like %${name}%`);
        return new Promise((resolve, reject) => {
            MySql.query(`select * from threePacks where name like '%${name}%'`)
                .then((results: ThreePacks[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 通过id获取三方包
     * @param {Number} id 获取名称
     * @returns {Promise<ThreePacks[]>}
     */
    static getThreePacksById(id: number): Promise<ThreePacks[]> {
        return new Promise((resolve, reject) => {
            MySql.query('select * from threePacks where id = ' + id)
                .then((results: ThreePacks[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

export default ThreePacksMapper;
