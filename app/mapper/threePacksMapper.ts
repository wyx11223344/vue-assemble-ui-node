/**
 * @author WYX
 * @date 2020/8/3
 * @Description: 第三方包数据库请求
*/
import MySql from '../db';
import ThreePacks from '../models/threePacks';
import Components from '../models/components';

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

    /**
     * 新增第三方包
     * @param {ThreePacks} threePacks 保存对象
     * @returns {Promise<ThreePacks[]>}
     */
    static setNewThreePack(threePacks: ThreePacks): Promise<any> {
        return new Promise((resolve, reject) => {
            MySql.queryArgs('INSERT INTO threePacks (name, version, url, code) VALUES (?, ?, ?, ?)', [
                threePacks.name,
                threePacks.version,
                threePacks.url,
                threePacks.code
            ])
                .then((results: any) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 更新三方包
     * @param {ThreePacks} threePacks 更新对象对象
     * @returns {Promise<*>} 返回结果
     */
    static updateThreePack(threePacks: ThreePacks): Promise<any> {
        let sets = '';
        Object.keys(threePacks).filter((item: string) => item !== '_id').forEach((item) => {
            const key = item.replace('_', '');
            if (threePacks[key] !== undefined && threePacks[key] !== null) {
                sets += sets ? `, ${key} = '${threePacks[item]}'` : `set ${key} = '${threePacks[item]}'`;
            }
        });

        if (!sets) {
            return new Promise((resolve) => {
                resolve({
                    insertId: threePacks.id
                });
            });
        }

        return new Promise((resolve, reject) => {
            MySql.queryArgs(`UPDATE components ${sets} WHERE id = ?`, [
                threePacks.id
            ])
                .then((results: any) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

export default ThreePacksMapper;
