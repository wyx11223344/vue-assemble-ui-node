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
     * @param {express.Request} req 请求
     * @param {express.Response} res 返回
     * @returns {Promise<void>} async异步
     */
    @routerDec.RequestMapping('/setHtml', MyType.post)
    async setHtml(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            MyRedis.set(req.body.findId as string, req.body.sendHtml as string);
            MyRedis.exp(req.body.findId as string, 10);
            res.send(true);
        } catch (e) {
            res.send(e);
        }
    }

    /**
     * 返回标准html页面方法
     * @param {express.Request} req 请求
     * @param {express.Response} res 返回
     * @returns {Promise<void>} async异步
     */
    @routerDec.RequestMapping('/index.html', MyType.get)
    async backHtml(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Expires': new Date().toUTCString()
        });
        try {
            const a: string = await MyRedis.get(req.query.findId as string);
            res.write(TemplateHTML.startHTML);
            res.write(await CodeOnline.CodeOnlineServices.dealVueOnlineCode(a));
            res.end(TemplateHTML.endHTML);
        } catch (e) {
            res.end(e.toString());
        }
    }

    /**
     * 通过componentId获取代码模板
     * @param {Object} req req对象
     * @param {Object} res res返回对象
     * @returns {Promise<void>} 执行
     */
    @routerDec.RequestMapping('/getTemplate', MyType.post)
    async getHtmlTemplate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const componentId: number = req.body.componentId ? Number(req.body.componentId) : 1;

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
     * @param {Object} req req对象
     * @param {Object} res res返回对象
     * @returns {Promise<void>} 执行
     */
    @routerDec.RequestMapping('/saveTemplate', MyType.post)
    async saveHtmlTemplate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const comName: string = req.body.name;
        const getComponentId: number = req.body.id;
        const getHtml: HtmlObj[] = JSON.parse(req.body.sendHtml ? req.body.sendHtml : '[]');

        const response = new BaseResponse<boolean>();

        try {
            const componentId = await CodeOnline.CodeServices.setComponent(new Components(getComponentId, comName), getComponentId);

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
     * @param {Object} req req对象
     * @param {Object} res res返回对象
     * @returns {Promise<void>} 执行
     */
    @routerDec.RequestMapping('/saveCodeTemplate', MyType.post)
    async saveCodeTemplate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const getHtml: HtmlObj[] = JSON.parse(req.body.sendHtml ? req.body.sendHtml : '[]');

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
