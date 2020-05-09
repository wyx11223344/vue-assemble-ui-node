/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 首页一级路由
*/
import * as express from 'express';
import TemplateHTML from '../template/defaultIframe';
const router: express.Router = express.Router();
const templateHTML = new TemplateHTML();

router.get(
    '/',
    function(
        req: express.Request,
        res: express.Response
    ): void {
        res.render('index');
    });

router.get('/index.html',
    function(
        req: express.Request,
        res: express.Response
    ): void {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Expires': new Date().toUTCString()
        });
        res.write(templateHTML.startHTML);
        res.write('测试\n');
        res.end(templateHTML.endHTML);
    });

export default router;
