/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 首页一级路由类
*/
import * as express from 'express';
import usersMapper from '../mapper/usersMapper';
import {MyType, RouterDec} from '../decorators/routerDec';
import UsersServices from '../services/usersServices/usersServices';
const routerDec: RouterDec = new RouterDec();

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

}

export default routerDec;
