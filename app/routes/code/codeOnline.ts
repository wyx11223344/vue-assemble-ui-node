/**
 * @author WYX
 * @date 2020/7/1
 * @Description: 在线编辑器接口
*/
import * as express from 'express';
import TemplateHTML from '../../template/defaultIframe';
import {MyType, RouterDec} from '../../decorators/routerDec';
import MyRedis from '../../cache';
import CodeOnlineServices from '../../services/codeOnlineServices/codeOnlineServices';
const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/code/codeOnline')
export class CodeOnline {
    private static CodeOnlineServices: CodeOnlineServices = new CodeOnlineServices()

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
        const a: string = await MyRedis.get(req.query.findId as string);
        res.write(TemplateHTML.startHTML);
        res.write(await CodeOnline.CodeOnlineServices.dealVueOnlineCode(a));
        res.end(TemplateHTML.endHTML);
    }

}

export default routerDec;
