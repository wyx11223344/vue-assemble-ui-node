/**
 * @author WYX
 * @date 2020/7/9
 * @Description: codes数据库操作映射
*/
import MySql from '../db';
import Codes from '../models/codes';

export default class CodesMapper {

    /**
     * 通过id删除代码片段
     * @param {number} ComponentId 组件id
     * @returns {Promise<boolean>}
     */
    static removeCodeById(CodeId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MySql.query('DELETE FROM codes WHERE id = ' + CodeId)
                .then(() => {
                    resolve(true);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 通过组件id删除全部代码片段
     * @param {Number} componentId 组件id
     * @returns {Promise<boolean>}
     */
    static removeCodeByComponentsId(componentId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MySql.query('DELETE FROM codes WHERE componentId = ' + componentId)
                .then(() => {
                    resolve(true);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

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
            MySql.queryArgs('INSERT INTO codes (name, html, componentId, type) VALUES (?, ?, ?, ?)', [
                Codes.name,
                Codes.html,
                Codes.componentId,
                Codes.type
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
            MySql.queryArgs('UPDATE codes set name = ?, html = ?, componentId = ?, type = ? where id = ?', [
                Codes.name,
                Codes.html,
                Codes.componentId,
                Codes.type,
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
