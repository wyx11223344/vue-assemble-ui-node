import MySql from '../db';
import Codes from '../models/codes';

export default class CodesMapper {

    /**
     * 获取代码数组
     * @param {Number} componentId 组件id
     * @returns {Promise<any>} 返回结果
     */
    static getCodesByComId(componentId: number): Promise<Codes[]> {
        return new Promise((resolve, reject) => {
            MySql.query(`select * from codes where componentId = ${componentId}`)
                .then((results: Codes[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 保存代码数组
     * @param {Codes} Codes 新增代码
     * @returns {Promise<any>} 返回结果
     */
    static setCodesByComId(Codes: Codes): Promise<any> {
        return new Promise((resolve, reject) => {
            MySql.queryArgs('INSERT INTO codes (name, html, componentId) VALUES (?, ?, ?)', [
                Codes.name,
                Codes.html,
                Codes.componentId
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
     * 更新代码
     * @param {Codes} Codes 新增代码
     * @returns {Promise<any>} 返回结果
     */
    static updateCodesById(Codes: Codes): Promise<any> {
        return new Promise((resolve, reject) => {
            MySql.queryArgs('UPDATE codes set name = ?, html = ?, componentId = ? where id = ?', [
                Codes.name,
                Codes.html,
                Codes.componentId,
                Codes.id
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
