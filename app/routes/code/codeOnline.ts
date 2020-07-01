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

    @routerDec.RequestMapping('/getTemplate', MyType.post)
    async getHtmlTemplate(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<Codes[]>();
        try {
            const componentId: number = req.body.componentId ? Number(req.body.componentId) : 1;
            response._datas = await CodeOnline.CodeServices.getCodes(componentId);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = e;
        }
        res.json(response);
    }

}

export default routerDec;
