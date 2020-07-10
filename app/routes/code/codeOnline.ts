/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 代码操作接口
*/
import * as express from 'express';
import TemplateHTML from '../../template/defaultIframe';
import {MyType, RouterDec} from '../../decorators/routerDec';
import MyRedis from '../../cache';
import CodeOnlineServices from '../../services/codeServices/codeOnlineServices/codeOnlineServices';
import BaseResponse, {BackType} from '../../models/baseResponse';
import {BaseErrorMsg} from '../../types/baseBackMsg';

const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/code/codeOnline')
export class CodeOnline {
    private static CodeOnlineServices: CodeOnlineServices = new CodeOnlineServices()

    /**
     * 返回标准html页面方法
     * @route POST /code/codeOnline/setHtml
     * @group 代码在线编辑
     * @param {string} findId.formData.required 返回
     * @param {string} sendHtml.formData.required 测试
     * @returns {VoidFunction} 200 - 返回true
     * @returns {VoidFunction} 500 - 返回错误
     */
    @routerDec.RequestMapping('/setHtml', MyType.post)
    async setHtml(
        @routerDec.RequestParams('String', 'findId') findId: string,
        @routerDec.RequestParams('String', 'sendHtml') sendHtml: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<boolean>();

        try {
            MyRedis.set(findId, sendHtml);
            MyRedis.exp(findId, 10);

            response._datas = true;
            response.changeType(BackType.success);
        } catch (e) {
            response._datas = false;
            response._msg = BaseErrorMsg.redisError;
        }

        res.json(response);
    }

    /**
     * 返回标准html页面方法
     * @route GET /code/codeOnline/index.html
     * @group 代码在线编辑
     * @param {string} findId.query.required - 查询id
     * @returns {Promise} 200 - 返回渲染页面
     * @returns {Error} 500 - 返回错误页面
     */
    @routerDec.RequestMapping('/index.html', MyType.get)
    async backHtml(
        @routerDec.RequestParams('String', 'findId') findId,
        @routerDec.Response() res: express.Response,
        @routerDec.NextFunction() next
    ): Promise<void> {
        try {
            const a: string = await MyRedis.get(findId);
            const backHtml = await CodeOnline.CodeOnlineServices.dealVueOnlineCode(a);

            res.write(TemplateHTML.startHTML);
            res.write(backHtml);
            res.end(TemplateHTML.endHTML);
        } catch (e) {
            next(e);
        }
    }

}

export default routerDec;
