/**
 * @author WYX
 * @date 2020/7/1
 * @Description: 在线编辑器接口
 */
import * as express from 'express';
import {MyType, RouterDec} from '../../decorators/routerDec';
import ComponentsServices from '../../services/componentsServices/componentsServices';
import BaseResponse, {BackType} from '../../models/baseResponse';
import Codes from '../../models/codes';
import CodeServices from '../../services/codeServices/codeServices';
import {HtmlObj} from '../../types/codes';
import Components from '../../models/components';
const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/code/CodeControl')
export class CodeControl {
    private static CodeServices: CodeServices = new CodeServices()
    private static ComponentsServices: ComponentsServices = new ComponentsServices()

    /**
     * 通过componentId获取代码模板
     * @route POST /code/CodeControl/getTemplate
     * @group 代码在线编辑
     * @param {number} componentId.formData 传入组件id
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/getTemplate', MyType.post)
    async getHtmlTemplate(
        @routerDec.RequestParams('Number', 'componentId') componentId: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        componentId = componentId ? componentId : 1;
        const response = new BaseResponse<Codes[]>();

        try {
            response._datas = await CodeControl.CodeServices.getCodes(componentId);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

    /**
     * 保存组件
     * @route POST /code/CodeControl/saveHtmlTemplate
     * @group 代码在线编辑
     * @param {string} comName.formData 组件名称
     * @param {number} getComponentId.formData 组件id
     * @param {string} sendHtml.formData 组件code数组
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/saveTemplate', MyType.post)
    async saveHtmlTemplate(
        @routerDec.RequestParams('String', 'name') comName: string,
        @routerDec.RequestParams('Number', 'id') getComponentId: number,
        @routerDec.RequestParams('String', 'sendHtml') sendHtml: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const getHtml: HtmlObj[] = JSON.parse(sendHtml ? sendHtml : '[]');
        const response = new BaseResponse<boolean>();

        try {
            const componentId = await CodeControl.ComponentsServices.setComponent(new Components(getComponentId, comName, null, null, null), getComponentId);

            if (getHtml.length > 0) {
                const codes = getHtml.map((item: HtmlObj) => new Codes(item.id, item.name, item.html, componentId));
                response._datas = await CodeControl.CodeServices.setCodes(codes);
            }

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

    /**
     * 保存代码
     * @route POST /code/CodeControl/saveCodeTemplate
     * @group 代码在线编辑
     * @param {string} sendHtml.formData.required 组件code数组
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/saveCodeTemplate', MyType.post)
    async saveCodeTemplate(
        @routerDec.RequestParams('String', 'sendHtml') sendHtml: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const getHtml: HtmlObj[] = JSON.parse(sendHtml ? sendHtml : '[]');
        const response = new BaseResponse<boolean>();

        try {
            if (getHtml.length > 0) {
                const codes = getHtml.map((item: HtmlObj) => new Codes(item.id, item.name, item.html, item.componentId));
                response._datas = await CodeControl.CodeServices.setCodes(codes);
            }

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

    /**
     * 获取全部npm包
     * @route POST /code/CodeControl/getAllComponents
     * @group 代码在线编辑
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/getAllComponents', MyType.post)
    async getAllComponents(
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<Components[]>();

        try {
            response._datas = await CodeControl.ComponentsServices.getAllComponents();

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

    /**
     * 通过id删除组件
     * @group 代码在线编辑
     * @route POST /code/CodeControl/delectComponentById
     * @param {string} id.formData.required 以,分割的组件ids
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/delectComponentById', MyType.post)
    async delectComponentById(
        @routerDec.RequestParams('String', 'id') id: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<boolean>();

        try {
            await CodeControl.ComponentsServices.removeComponentsByIds(id);
            await CodeControl.CodeServices.removeCodesByComponentsIds(id);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.send(response);
    }

}

export default routerDec;
