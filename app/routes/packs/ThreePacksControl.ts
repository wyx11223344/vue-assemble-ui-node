/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 代码操作接口
 */
import * as express from 'express';
import {MyType, RouterDec} from '../../decorators/routerDec';
import BaseResponse, {BackType} from '../../models/baseResponse';
import {BaseErrorMsg} from '../../types/baseBackMsg';
import ThreePacksServices from '../../services/threePacksServices/threePacksServices';
import ThreePacks from '../../models/threePacks';

const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/packs/threePacks')
export class ThreePacksControl {
	private static ThreePacksServices: ThreePacksServices = new ThreePacksServices()

	/**
	 * 通过name名称获取第三方包
	 * @route POST /packs/threePacks/getPacks
	 * @group 第三方包管理
	 * @param {string} name.formData 搜索名称
	 * @returns {Promise} 200 - 返回查询结果
	 * @returns {Promise} 500 - 返回错误原因
	 */
	@routerDec.RequestMapping('/getPacks', MyType.post)
	async getPacks(
		@routerDec.RequestParams('String', 'name') name: string,
		@routerDec.Response() res: express.Response
	): Promise<void> {
	    const response = new BaseResponse<ThreePacks[]>();

	    try {
	    	if (name) {
			    response._datas = await ThreePacksControl.ThreePacksServices.getThreePacks(name);
		    }
	        response.changeType(BackType.success);
	    } catch (e) {
	        response._msg = BaseErrorMsg.sqlError;
	    }

	    res.json(response);
	}

	/**
	 * 通过第三方包ids获取第三方包
	 * @route POST /packs/threePacks/getPacksByIds
	 * @group 第三方包管理
	 * @param {string} ids.formData 传入组件id(不传返回标准显示模板)
	 * @returns {Promise} 200 - 返回查询结果
	 * @returns {Promise} 500 - 返回错误原因
	 */
	@routerDec.RequestMapping('/getPacksByIds', MyType.post)
	async getPacksByIds(
		@routerDec.RequestParams('String', 'ids') ids: string,
		@routerDec.Response() res: express.Response
	): Promise<void> {
	    const response = new BaseResponse<ThreePacks[]>();

	    try {
	        response._datas = await ThreePacksControl.ThreePacksServices.getThreePacksByIds(ids);
	        response.changeType(BackType.success);
	    } catch (e) {
	        response._msg = BaseErrorMsg.sqlError;
	    }

	    res.json(response);
	}

	/**
	 * 保存三方包
	 * @route POST /packs/threePacks/savePacks
	 * @group 第三方包管理
	 * @param {number} id.formData 传入组件id(不传返回标准显示模板)
	 * @param {string} name.formData 传入组件id(不传返回标准显示模板)
	 * @param {string} version.formData 传入组件id(不传返回标准显示模板)
	 * @param {string} url.formData 传入组件id(不传返回标准显示模板)
	 * @param {string} code.formData 传入组件id(不传返回标准显示模板)
	 * @returns {Promise} 200 - 返回查询结果
	 * @returns {Promise} 500 - 返回错误原因
	 */
	@routerDec.RequestMapping('/savePacks', MyType.post)
	async savePacks(
		@routerDec.RequestParams('Number', 'id') id: number,
		@routerDec.RequestParams('String', 'name') name: string,
		@routerDec.RequestParams('String', 'version') version: string,
		@routerDec.RequestParams('String', 'url') url: string,
		@routerDec.RequestParams('String', 'code') code: string,
		@routerDec.Response() res: express.Response
	): Promise<void> {
	    const response = new BaseResponse<number>();

	    try {
		    response._datas = await ThreePacksControl.ThreePacksServices.savePacks(new ThreePacks(id, name, url, version, code), id);
	        response.changeType(BackType.success);
	    } catch (e) {
	        response._msg = BaseErrorMsg.sqlError;
	    }

	    res.json(response);
	}

}

export default routerDec;
