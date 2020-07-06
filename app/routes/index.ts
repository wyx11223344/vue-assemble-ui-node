/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 首页一级路由类
*/
import * as express from 'express';
import {MyType, RouterDec} from '../decorators/routerDec';
const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('')
export class Index {

    /**
     * 首页渲染
     * @route GET /
     * @group 首页
     * @returns {Promise} 200 - 返回渲染页面
     */
    @routerDec.RequestMapping('/', MyType.get)
    async welCome(
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        res.render('index');
    }

}

export default routerDec;
