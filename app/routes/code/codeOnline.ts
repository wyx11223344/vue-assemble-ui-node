/**
 * @author WYX
 * @date 2020/7/1
 * @Description: 在线编辑器接口
*/
import * as express from 'express';
import TemplateHTML from '../../template/defaultIframe';
import {MyType, RouterDec} from '../../decorators/routerDec';
import MyRedis from '../../cache';
import CodeOnlineServices from '../../services/codeServices/codeOnlineServices/codeOnlineServices';
import BaseResponse, {BackType} from '../../models/baseResponse';
import Codes from '../../models/codes';
import CodeServices from '../../services/codeServices/codeServices';
import {HtmlObj} from '../../types/codes';
import Components from '../../models/components';
const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/code/codeOnline')
export class CodeOnline {
    private static CodeOnlineServices: CodeOnlineServices = new CodeOnlineServices()
    private static CodeServices: CodeServices = new CodeServices()

    /**
     * 返回标准html页面方法
     * @route POST /code/codeOnline/setHtml
     * @group 代码在线编辑
     * @param {string} findId.formData.required 返回
     * @param {string} sendHtml.formData.required 测试
     * @returns {VoidFunction} 200 - 返回true
     * @returns {VoidFunction} 500 - 返回错误
     */
    @routerDec.RequestMapping('/setHtml', MyType.post)
    async setHtml(
        @routerDec.RequestParams('String', 'findId') findId: string,
        @routerDec.RequestParams('String', 'sendHtml') sendHtml: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        try {
            MyRedis.set(findId, sendHtml);
            MyRedis.exp(findId, 10);
            res.send(true);
        } catch (e) {
            res.send(e);
        }
    }

    /**
     * 返回标准html页面方法
     * @route GET /code/codeOnline/index.html
     * @group 代码在线编辑
     * @param {string} findId.query.required - 查询id
     * @returns {Promise} 200 - 返回渲染页面
     * @returns {Error} 500 - 返回错误页面
     */
    @routerDec.RequestMapping('/index.html', MyType.get)
    async backHtml(
        @routerDec.RequestParams('String', 'findId') findId,
        @routerDec.Response() res: express.Response,
        @routerDec.NextFunction() next
    ): Promise<void> {
        try {
            const a: string = await MyRedis.get(findId);
            const backHtml = await CodeOnline.CodeOnlineServices.dealVueOnlineCode(a);

            res.write(TemplateHTML.startHTML);
            res.write(backHtml);
            res.end(TemplateHTML.endHTML);
        } catch (e) {
            next(e);
        }
    }

    /**
     * 通过componentId获取代码模板
     * @route POST /code/codeOnline/getTemplate
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
            response._datas = await CodeOnline.CodeServices.getCodes(componentId);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

    /**
     * 保存组件
     * @route POST /code/codeOnline/saveHtmlTemplate
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
            const componentId = await CodeOnline.CodeServices.setComponent(new Components(getComponentId, comName, null, null, null), getComponentId);

            if (getHtml.length > 0) {
                const codes = getHtml.map((item: HtmlObj) => new Codes(item.id, item.name, item.html, componentId));
                response._datas = await CodeOnline.CodeServices.setCodes(codes);
            }

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

    /**
     * 保存代码
     * @route POST /code/codeOnline/saveCodeTemplate
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
                response._datas = await CodeOnline.CodeServices.setCodes(codes);
            }

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }

        res.json(response);
    }

}

export default routerDec;
