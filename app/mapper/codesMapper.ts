import MySql from '../db';
import Codes from '../models/codes';

export default class CodesMapper {

    /**
     * 获取代码数组
     * @param {Number} componentId 组件id
     * @returns {Promise<any>} 返回结果
     */
    static getCodesByComId(componentId: number): Promise<Codes[]> {
        return new Promise((resolve) => {
            MySql.query(`select * from codes where componentId = ${componentId}`)
                .then((results: Codes[]) => {
                    resolve(results);
                });
        });
    }
}
