import {TemplateServiceImp} from './templateServiceImp';
import RedisDec from '../../decorators/redisDec';
import Template from '../../models/template';
import TemplateMapper from '../../mapper/templateMapper';
import {TemplateName} from '../../types/templates';


export default class TemplateService implements TemplateServiceImp{

	/**
	 * 通过id获取三方包数据
	 * @param {Number} Id 三方包的id
	 * @returns {Promise<boolean>}
	 */
	@RedisDec.Cacheable('template', '#Id')
    private static getTemplateById(Id: number): Promise<Template[]> {
        return TemplateMapper.getTemplateById(Id);
    }

	/**
	 * 通过id字符串获取三方包数据
	 * @param {String} Ids ids字符串
	 * @returns {Promise<boolean>}
	 */
	getTemplateByIds(Ids: string): Promise<Template[]> {
	    let checkNum = 0;
	    let checkStatus = [];
	    return new Promise((resolve, reject) => {
	        Ids.split(',').forEach((item: string) => {
	            TemplateService.getTemplateById(Number(item)).then((results: Template[]) => {
	                if (!results) {reject();}
	                checkNum++;
	                checkStatus.push(...results);
	                if (checkNum >= Ids.split(',').length) {
	                    resolve(checkStatus);
	                }
	            }).catch((e) => {
	                reject(e);
	            });
	        });
	    });
	}

	/**
	 * 获取全部模板名称
	 * @returns {Promise<TemplateName[]>}
	 */
	@RedisDec.Cacheable('template')
	getTemplateName(): Promise<TemplateName[]> {
	    return TemplateMapper.getTemplateName();
	}

}
