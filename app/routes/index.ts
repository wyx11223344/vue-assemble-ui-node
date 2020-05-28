/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 首页一级路由类
*/
import * as express from 'express';
import TemplateHTML from '../template/defaultIframe';
import usersMapper from '../mapper/usersMapper';
import {MyType, RouterDec} from '../decorators/routerDec';
import UsersServices from '../services/usersServices/usersServices';
import MyRedis from '../cache';
import * as less from 'less';
const routerDec: RouterDec = new RouterDec();

interface LessRender {
    css: string;
    imports: [];
}

@routerDec.BaseRequest('')
export class Index {
    private static UsersServices: UsersServices = new UsersServices()

    /**
     * 首页渲染
     * @param {express.Request} req 请求
     * @param {express.Response} res 返回
     * @returns {Promise<void>} async异步
     */
    @routerDec.RequestMapping('/', MyType.get)
    async welCome(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const ceshi = await usersMapper.getAllUser();
        await Index.UsersServices.getUserInfo('a2', 'bbbb');
        res.render('index', ceshi);
    }

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
        console.log(typeof req.body.sendHtml);
        MyRedis.set(req.body.findId as string, req.body.sendHtml as string);
        MyRedis.exp(req.body.findId as string, 10);
        res.send(true);
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
        const script: string = Index.getSource(a, 'script').replace(/export default/, '');
        const style: string = Index.getSource(a, 'style');
        const template: string = '<div id="app">' + Index.getSource(a, 'template') + '</div>';
        const backJs: string = Index.createJs(script);
        const cssStyle: LessRender = await less.render(style);

        res.write(TemplateHTML.startHTML);
        res.write(`${template}\n${backJs}\n<style>\n${cssStyle.css}</style>\n`);
        res.end(TemplateHTML.endHTML);
    }

    /**
     * 返回生成需要的js
     * @param {String} script 传入export default内容
     * @return {string} 返回生成js片段
     */
    private static createJs(script: string): string {
        return `<script>\n const myVueOption = ${script} myVueOption.el = '#app';\n var app = new Vue(myVueOption);\n</script>`;
    }

    /**
     * 返回截取页面字符串截取
     * @param {String} source 需要截取的资源
     * @param {String} type 截取标签类型
     * @returns {any} 返回截取结果
     */
    private static getSource(source: string, type: string): string {
        const regex = new RegExp(`<${type}[^>]*>`);
        let openingTag: [] | string = source.match(regex) as [];

        if (!openingTag) {return '';} else {openingTag = (openingTag as string[])[0];}

        return source.slice(source.indexOf(openingTag as string) + openingTag.length, source.lastIndexOf(`</${type}>`));
    }

}

export default routerDec;
