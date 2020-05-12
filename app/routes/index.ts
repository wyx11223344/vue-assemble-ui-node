/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 首页一级路由类
*/
import * as express from 'express';
import TemplateHTML from '../template/defaultIframe';
import usersMapper from '../mapper/usersMapper';
import MyRedis from '../cache';

class Index {
    router: express.Router
    templateHTML: TemplateHTML

    /**
     * 构造router对象
     */
    constructor() {
        this.router = express.Router();
        this.templateHTML = new TemplateHTML();

        this.route();
    }

    route() {
        this.router.get(
            '/',
            function(
                req: express.Request,
                res: express.Response
            ): void {
                console.log(MyRedis);
                console.log(MyRedis.prototype);
                usersMapper.getAllUser()
                    .then((ceshi) => {
                        res.render('index', ceshi);
                    });
            });

        this.router.get(
            '/index.html',
            function(
                req: express.Request,
                res: express.Response
            ): void {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Expires': new Date().toUTCString()
                });
                res.write(this.templateHTML.startHTML);
                res.write('测试\n');
                res.end(this.templateHTML.endHTML);
            });
    }

}



export default new Index();
