import MySql from '../db';
import Components from '../models/components';

export default class ComponentsMapper {

    /**
     * 保存新组件
     * @param {Components} components 新增对象
     * @returns {Promise<any>} 返回结果
     */
    static setNewComponents(components: Components): Promise<any> {
        return new Promise((resolve) => {
            MySql.queryArgs('INSERT INTO components (name) VALUES (?)', [
                components._name
            ])
                .then((results: any) => {
                    resolve(results);
                });
        });
    }

    /**
     * 更新组件
     * @param {Components} components 新增对象
     * @returns {Promise<any>} 返回结果
     */
    static updateComponents(components: Components): Promise<any> {
        let sets = '';
        Object.keys(components).filter((item: string) => item !== 'id').forEach((item) => {
            if (components['_' + item]) {
                sets += sets ? `, ${item} = '${components['_' + item]}'` : `set ${item} = '${components['_' + item]}'`;
            }
        });

        if (!sets) {
            return new Promise((resolve) => {
                resolve({
                    insertId: components._id
                });
            });
        }

        return new Promise((resolve) => {
            MySql.queryArgs(`UPDATE components ${sets} WHERE id = ?`, [
                components._id
            ])
                .then((results: any) => {
                    resolve(results);
                });
        });
    }
}
