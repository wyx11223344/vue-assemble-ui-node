import MySql from '../db';
import NpmPublish from '../models/npmPublish';

export default class NpmPublishMapper {

    /**
     * 获取npm包通过id
     * @returns {void}
     */
    static getNpmById(npmId: string): Promise<any> | [] {
        const npmIds = npmId.split(',');
        if (npmIds.length <= 0) {return [];}
        let whereSelect = '';
        npmIds.forEach((item: string) => {
            whereSelect = whereSelect ? whereSelect + `or id = ${item}` : `id = ${item}`;
        });
        return new Promise((resolve, reject) => {
            MySql.query('select * from npmPublish where ' + whereSelect)
                .then((results) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 获取npm包通过name
     * @returns {void}
     */
    static getNpmByName(npmName: string): Promise<any> | [] {
        const npmNames = npmName.split(',');
        if (npmNames.length <= 0) {return [];}
        let whereSelect = '';
        npmNames.forEach((item: string) => {
            whereSelect = whereSelect ? whereSelect + `or name = \'${item}\'` : `name = \'${item}\'`;
        });
        return new Promise((resolve, reject) => {
            MySql.query('select * from npmPublish where ' + whereSelect)
                .then((results) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
     * 新建npm包
     * @param {Codes} Codes 新增代码
     * @returns {Promise<any>} 返回结果
     */
    static setNpm(npmPublish: NpmPublish): Promise<any> {
        return new Promise((resolve, reject) => {
            MySql.queryArgs('INSERT INTO npmPublish (name, componentsIds, version) VALUES (?, ?, ?)', [
                npmPublish.name,
                npmPublish.componentsIds,
                npmPublish.version
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
     * 更新npm包
     * @param {Components} components 新增对象
     * @returns {Promise<any>} 返回结果
     */
    static updateNpm(npmPublish: NpmPublish): Promise<any> {
        let sets = '';
        Object.keys(npmPublish).filter((item: string) => item !== 'id').forEach((item: string) => {
            const key = item.replace('_', '');
            if (npmPublish[key]) {
                sets += sets ? `, ${key} = '${npmPublish[item]}'` : `set ${key} = '${npmPublish[item]}'`;
            }
        });

        if (!sets) {
            return new Promise((resolve) => {
                resolve({
                    insertId: npmPublish.id
                });
            });
        }

        return new Promise((resolve, reject) => {
            MySql.queryArgs(`UPDATE npmPublish ${sets} WHERE id = ?`, [
                npmPublish.id
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
