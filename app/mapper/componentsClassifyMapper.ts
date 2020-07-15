import MySql from '../db';
import componentsClassify from '../models/componentsClassify';

class ComponentsClassifyMapper {

    /**
     * 获取全部组件类型
     * @returns {void}
     */
    static getAllClassify(): Promise<componentsClassify[]> {
        return new Promise((resolve, reject) => {
            MySql.query('select * from componentsClassify')
                .then((results: componentsClassify[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

export default ComponentsClassifyMapper;
