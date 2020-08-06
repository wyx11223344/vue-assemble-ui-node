/**
 * @author WYX
 * @date 2020/5/12
 * @Description: 用户请求sql映射类
 */
import MySql from '../db';
import Template from '../models/template';
import {TemplateName} from '../types/templates';

class TemplateMapper {

    /**
	 * 通过id获取三方包
	 * @param {Number} id 获取名称
	 * @returns {Promise<Template[]>}
	 */
    static getTemplateById(id: number): Promise<Template[]> {
        return new Promise((resolve, reject) => {
            MySql.query('select * from template where id = ' + id)
                .then((results: Template[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    /**
	 * 通过id获取三方包
	 * @returns {Promise<TemplateName[]>}
	 */
    static getTemplateName(): Promise<TemplateName[]> {
        return new Promise((resolve, reject) => {
            MySql.query('select id, name from template where id != 1')
                .then((results: TemplateName[]) => {
                    resolve(results);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

export default TemplateMapper;
