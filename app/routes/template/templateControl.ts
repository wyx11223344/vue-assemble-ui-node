/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 代码操作接口
 */
import * as express from 'express';
import {MyType, RouterDec} from '../../decorators/routerDec';
import BaseResponse, {BackType} from '../../models/baseResponse';
import {BaseErrorMsg} from '../../types/baseBackMsg';
import TemplateService from '../../services/templateServices/templateService';
import Template from '../../models/template';
import {TemplateName} from '../../types/templates';

const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/template/templateControl')
export class TemplateControl {
	private static TemplateService: TemplateService = new TemplateService()

	/**
	 * 通过id获取模板数据
	 * @route POST /template/templateControl/getTemplateById
	 * @group 第三方包管理
	 * @param {string} ids.formData 搜索名称
	 * @returns {Promise} 200 - 返回查询结果
	 * @returns {Promise} 500 - 返回错误原因
	 */
	@routerDec.RequestMapping('/getTemplateById', MyType.post)
	async getTemplateById(
		@routerDec.RequestParams('String', 'ids') ids: string,
		@routerDec.Response() res: express.Response
	): Promise<void> {
	    const response = new BaseResponse<Template[]>();

	    try {
	        if (ids) {
	            response._datas = await TemplateControl.TemplateService.getTemplateByIds(ids);
	        }
	        response.changeType(BackType.success);
	    } catch (e) {
	        response._msg = BaseErrorMsg.sqlError;
	    }

	    res.json(response);
	}

	/**
	 * 查询模板名称
	 * @route POST /template/templateControl/getTemplateName
	 * @group 第三方包管理
	 * @param {string} ids.formData 搜索名称
	 * @returns {Promise} 200 - 返回查询结果
	 * @returns {Promise} 500 - 返回错误原因
	 */
	@routerDec.RequestMapping('/getTemplateName', MyType.post)
	async getTemplateName(
		@routerDec.Response() res: express.Response
	): Promise<void> {
	    const response = new BaseResponse<TemplateName[]>();

	    try {
	    	response._datas = await TemplateControl.TemplateService.getTemplateName();
	        response.changeType(BackType.success);
	    } catch (e) {
	        response._msg = BaseErrorMsg.sqlError;
	    }

	    res.json(response);
	}

}

export default routerDec;
