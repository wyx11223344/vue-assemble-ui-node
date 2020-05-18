/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 首页一级路由类
*/
import * as express from 'express';
import TemplateHTML from '../template/defaultIframe';
import usersMapper from '../mapper/usersMapper';
import {RouterDec, MyType} from '../decorators/routerDec';
import UsersServices from '../services/usersServices/usersServices';

const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('')
export class Index {
    private UsersServices: UsersServices = new UsersServices()

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
        await this.UsersServices.getUserInfo('a2', 'bbbb');
        res.render('index', ceshi);
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
        this.UsersServices.changeUserInfo();
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Expires': new Date().toUTCString()
        });
        res.write(TemplateHTML.startHTML);
        res.write('测试\n');
        res.end(TemplateHTML.endHTML);
    }

}

export default routerDec;
