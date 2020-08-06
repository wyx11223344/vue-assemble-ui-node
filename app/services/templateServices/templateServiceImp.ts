import Template from '../../models/template';
import {TemplateName} from '../../types/templates';


export interface TemplateServiceImp {

	/**
	 * 通过id字符串获取模板数据
	 * @param {String} ids 通过,拼接的ids
	 */
	getTemplateByIds(ids: string): Promise<Template[]>;

	/**
	 * 获取所有模板名称
	 */
	getTemplateName(): Promise<TemplateName[]>;
}
