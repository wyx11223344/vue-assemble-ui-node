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

interface HtmlObj {
    name: string;
    disclose: boolean;
    html: string;
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
        res.write(TemplateHTML.startHTML);

        if (a) {
            const aList: HtmlObj[] = JSON.parse(a);
            let baseObje = {
                el: ''
            };
            let cssStyle = '';
            let template = '';
            let listObj = [];

            for (let index = 0; index < aList.length; index++) {
                const item = aList[index];
                const script: string = Index.getSource(item.html, 'script').replace(/export default/, 'return');
                if (index === 0) {
                    template = '<div id="app">' + Index.getSource(item.html, 'template') + '</div>';
                    baseObje = new Function(script)();
                    baseObje.el = '#app';
                } else {
                    listObj.push(new Function(script)());
                    listObj[listObj.length - 1].template = Index.getSource(item.html, 'template');
                    listObj[listObj.length - 1].name = listObj[listObj.length - 1].name ? listObj[listObj.length - 1].name : item.name;
                }
                const style: string = Index.getSource(item.html, 'style');
                const lessRender: LessRender = await less.render(style);
                cssStyle += lessRender.css;
            }

            const backJs: string = Index.createJs(baseObje, listObj);

            res.write(`${template}\n${backJs}\n<style>\n${cssStyle}</style>\n`);
        }

        res.end(TemplateHTML.endHTML);
    }

    /**
     * 返回生成需要的js
     * @param {Object} script 传入export default内容
     * @param {Array} listObj 传入组件数组
     * @return {string} 返回生成js片段
     */
    private static createJs(script: object, listObj: any[]): string {
        let listString = '';
        listObj.forEach((item) => {
            listString += `const myComponentOption${item.name} = {};  ${Index.serialize(item, `myComponentOption${item.name}`)} \n Vue.component('${item.name}', myComponentOption${item.name}); \n`;
        });
        return `<script>\n const myVueOption = {}; ${Index.serialize(script, 'myVueOption')} \n ${listString} var app = new Vue(myVueOption);\n </script>`;
    }

    static serialize(obj, name){
        var result = '';
        function serializeInternal(o, path) {
            for (let p in o) {
                var value = o[p];
                if (typeof value !== 'object') {
                    if (typeof value === 'string') {
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + '] = ' + '`' + value.replace(/\"/g, '\\"') + '`' + ';';
                    } else {
                        if (value.toString().indexOf(p) !== -1) {
                            value = value.toString().replace(p, 'function');
                        }
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + '] = ' + value + ';';
                    }
                } else {
                    if (value instanceof Array) {
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']' + '=' + 'new Array();';
                        serializeInternal(value, path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']');
                    } else {
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']' + '=' + 'new Object();';
                        serializeInternal(value, path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']');
                    }
                }
            }
        }
        serializeInternal(obj, name);
        return result;
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
