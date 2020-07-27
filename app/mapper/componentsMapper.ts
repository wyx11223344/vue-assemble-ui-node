/**
 * @author WYX
 * @date 2020/7/9
 * @Description: components数据库映射操作
*/
import MySql from '../db';
import Components from '../models/components';

export default class ComponentsMapper {

    /**
     * 获取全部npm包信息
     * @param {Number} pageSize 获取条数
     * @returns {Promise<NpmPublish[]>}
     */
    static async getAllComponents(component: Components, page = 1, pageSize = 10): Promise<{ list: Components[]; total: number }> {
        const limit = ` limit ${(page - 1) * pageSize},${pageSize}`;
        let where = '';
        Object.keys(component).filter((item: string) => item !== '_id').forEach((item) => {
            const key = item.replace('_', '');
            if (component[key]) {
                if (key === 'name'){
                    where += ` and a.${key} like '%${component[item]}%'`;
                } else {
                    where += ` and a.${key} = '${component[item]}'`;
                }
            }
        });

        const list: Components[] = await new Promise((resolve, reject) => {
            MySql.query('select a.id, a.name, a.classify, a.type, a.status, b.name as showname from components a LEFT JOIN users b ON a.usersId = b.id where a.id != 1 ' + where + 'order by a.id desc' + limit)
                .then((results: Components[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
        const total: {total: number} = await new Promise((resolve, reject) => {
            MySql.query('select count(*) as total from components a where a.id != 1 ' + where)
                .then((results: [{ total: number }]) => {
                    resolve(results[0]);
                })
                .catch((e) => {
                    reject(e);
                });
        });

        return {list: list, total: total.total};
    }

    /**
     * 通过组件类型获取组件信息
     * @param {Number} classify 组件类型
     * @returns {Promise<Components[]>}
     */
    // static getComponentsByClassify(classify: number, page = 1, pageSize = 10): Promise<Components[]> {
    //     return new Promise((resolve, reject) => {
    //         const limit = `limit ${(page - 1) * pageSize},${page * pageSize}`;
    //         console.log(limit);
    //         MySql.query('select * from components where classify = ' + classify + limit)
    //             .then((results: Components[]) => {
    //                 resolve(results);
    //             })
    //             .catch((e) => {
    //                 reject(e);
    //             });
    //     });
    // }

    /**
     * 通过id获取组件信息
     * @param {Number} Id 组件类型
     * @returns {Promise<Components[]>}
     */
    static getComponentById(Id: number): Promise<Components[]> {
        return new Promise((resolve, reject) => {
            MySql.query('select * from components where id = ' + Id)
                .then((results: Components[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 通过id删除组件
     * @param {number} ComponentId 组件id
     * @returns {Promise<boolean>}
     */
    static removeComponentById(ComponentId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MySql.query('DELETE FROM components WHERE id = ' + ComponentId)
                .then(() => {
                    resolve(true);
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
        Object.keys(components).filter((item: string) => item !== '_id').forEach((item) => {
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
