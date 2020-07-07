import MySql from '../db';
import Components from '../models/components';

export default class ComponentsMapper {

    /**
     * 获取全部npm包信息
     * @returns {Promise<NpmPublish[]>}
     */
    static getAllComponents(): Promise<Components[]> {
        return new Promise((resolve, reject) => {
            MySql.query('select * from components')
                .then((results: Components[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 保存新组件
     * @param {Components} components 新增对象
     * @returns {Promise<any>} 返回结果
     */
    static setNewComponents(components: Components): Promise<any> {
        return new Promise((resolve, reject) => {
            MySql.queryArgs('INSERT INTO components (name) VALUES (?)', [
                components.name
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
     * 更新组件
     * @param {Components} components 新增对象
     * @returns {Promise<any>} 返回结果
     */
    static updateComponents(components: Components): Promise<any> {
        let sets = '';
        Object.keys(components).filter((item: string) => item !== 'id').forEach((item) => {
            const key = item.replace('_', '');
            if (components[key]) {
                sets += sets ? `, ${key} = '${components[item]}'` : `set ${key} = '${components[item]}'`;
            }
        });

        if (!sets) {
            return new Promise((resolve) => {
                resolve({
                    insertId: components.id
                });
            });
        }

        return new Promise((resolve, reject) => {
            MySql.queryArgs(`UPDATE components ${sets} WHERE id = ?`, [
                components.id
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
