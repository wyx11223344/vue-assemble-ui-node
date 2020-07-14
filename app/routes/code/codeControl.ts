/**
 * @author WYX
 * @date 2020/7/1
 * @Description: 在线编辑器接口
 */
import * as express from 'express';
import {MyType, RouterDec} from '../../decorators/routerDec';
import ComponentsServices from '../../services/componentsServices/componentsServices';
import BaseResponse, {BackType} from '../../models/baseResponse';
import Codes from '../../models/codes';
import CodeServices from '../../services/codeServices/codeServices';
import {BackComponents, HtmlObj} from '../../types/codes';
import Components from '../../models/components';
import {BaseErrorMsg} from '../../types/baseBackMsg';
import MyRedis from '../../cache';
import RandomWord from '../../utils/randomWord';
const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/code/CodeControl')
export class CodeControl {
    private static CodeServices: CodeServices = new CodeServices()
    private static ComponentsServices: ComponentsServices = new ComponentsServices()

    /**
     * 通过componentId获取代码模板
     * @route POST /code/CodeControl/getTemplate
     * @group 代码控制
     * @param {number} componentId.formData 传入组件id(不传返回标准显示模板)
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/getTemplate', MyType.post)
    async getHtmlTemplate(
        @routerDec.RequestParams('Number', 'componentId') componentId: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        componentId = componentId ? componentId : 1;
        const response = new BaseResponse<Codes[]>();

        try {
            response._datas = await CodeControl.CodeServices.getCodes(componentId);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.json(response);
    }

    /**
     * 保存组件
     * @route POST /code/CodeControl/saveHtmlTemplate
     * @group 代码控制
     * @param {string} name.formData 组件名称
     * @param {number} id.formData 组件id
     * @param {string} sendHtml.formData 组件code数组
     * @param {number} classify.formData 组件类型
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/saveHtmlTemplate', MyType.post)
    async saveHtmlTemplate(
        @routerDec.RequestParams('String', 'name') name: string,
        @routerDec.RequestParams('Number', 'id') id: number,
        @routerDec.RequestParams('String', 'sendHtml') sendHtml: string,
        @routerDec.RequestParams('String', 'classify') classify: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const getHtml: HtmlObj[] = JSON.parse(sendHtml ? sendHtml : '[]');
        const response = new BaseResponse<number>();

        if (!id && !name) {
            response._msg = BaseErrorMsg.paramsError;
        } else {
            try {
                const componentId: number = await CodeControl.ComponentsServices.setComponent(new Components(id, name, null, null, null, classify), classify);

                if (getHtml.length > 0) {
                    const codes = getHtml.map((item: HtmlObj) => new Codes(item.id, item.name, item.html, componentId, item.type));
                    if (!await CodeControl.CodeServices.setCodes(codes, componentId)) {
                        throw new Error();
                    }
                }

                response._datas = componentId;
                response.changeType(BackType.success);
            } catch (e) {
                response._msg = BaseErrorMsg.sqlError;
            }
        }

        res.json(response);
    }

    // /**
    //  * 保存代码
    //  * @route POST /code/CodeControl/saveCodeTemplate
    //  * @group 代码控制
    //  * @param {string} sendHtml.formData.required 组件code数组
    //  * @returns {Promise} 200 - 返回查询结果
    //  * @returns {Promise} 500 - 返回错误原因
    //  */
    // @routerDec.RequestMapping('/saveCodeTemplate', MyType.post)
    // async saveCodeTemplate(
    //     @routerDec.RequestParams('String', 'sendHtml') sendHtml: string,
    //     @routerDec.Response() res: express.Response
    // ): Promise<void> {
    //     const getHtml: HtmlObj[] = JSON.parse(sendHtml ? sendHtml : '[]');
    //     const response = new BaseResponse<boolean>();
    //
    //     try {
    //         if (getHtml.length > 0) {
    //             const codes = getHtml.map((item: HtmlObj) => new Codes(item.id, item.name, item.html, item.componentId, item.type));
    //             response._datas = await CodeControl.CodeServices.setCodes(codes);
    //         }
    //
    //         response.changeType(BackType.success);
    //     } catch (e) {
    //         response._msg = BaseErrorMsg.sqlError;
    //     }
    //
    //     res.json(response);
    // }

    /**
     * 通过类别获取组件
     * @route POST /code/CodeControl/getComponentsByClassify
     * @group 代码控制
     * @param {number} classify.formData.required 组件类别
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/getComponentsByClassify', MyType.post)
    async getComponentsByClassify(
        @routerDec.RequestParams('String', 'classify') classify: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<Components[]>();

        try {
            response._datas = await CodeControl.ComponentsServices.getComponentsByClassify(classify);

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.json(response);
    }

    /**
     * 获取全部组件
     * @route POST /code/CodeControl/getAllComponentsWithHtml
     * @group 代码控制
     * @param {number} num.formData 获取条数
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/getAllComponentsWithHtml', MyType.post)
    async getAllComponentsWithHtml(
        @routerDec.RequestParams('Number', 'num') num: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<BackComponents[]>();

        try {
            const findComponents: BackComponents[] = await CodeControl.ComponentsServices.getAllComponents(num);

            await new Promise((resolve, reject) => {
                let checkNum = 0;
                findComponents.forEach((item: BackComponents) => {
                    CodeControl.CodeServices.getCodes(item.id).then((results: Codes[]) => {
                        const getSign: string = RandomWord.getSign();
                        item.htmlId = getSign;

                        MyRedis.set(getSign, JSON.stringify(results));
                        MyRedis.exp(getSign, 10);

                        checkNum++;
                        if (checkNum === findComponents.length) {
                            resolve();
                        }
                    }).catch(() => {
                        reject();
                    });
                });
            });

            response._datas = findComponents;
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.json(response);
    }

    /**
     * 获取全部组件
     * @route POST /code/CodeControl/getAllComponents
     * @group 代码控制
     * @param {number} num.formData 获取条数
     * @returns {Promise} 200 - 返回查询结果
     * @returns {Promise} 500 - 返回错误原因
     */
    @routerDec.RequestMapping('/getAllComponents', MyType.post)
    async getAllComponents(
        @routerDec.RequestParams('Number', 'num') num: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<Components[]>();

        try {
            response._datas = await CodeControl.ComponentsServices.getAllComponents(num);

            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.json(response);
    }

    /**
     * 通过id删除组件
     * @group 代码控制
     * @route POST /code/CodeControl/delectComponentById
     * @param {string} id.formData.required 以,分割的组件ids
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/delectComponentById', MyType.post)
    async delectComponentById(
        @routerDec.RequestParams('String', 'id') id: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<boolean>();

        try {
            await CodeControl.ComponentsServices.removeComponentsByIds(id);
            await CodeControl.CodeServices.removeCodesByComponentsIds(id);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.send(response);
    }

    /**
     * 通过id删除代码
     * @group 代码控制
     * @route POST /code/CodeControl/delectCodeById
     * @param {string} id.formData.required 以,分割的组件ids
     * @param {number} componentId.formData.required 当前操作组件（为了定点清除缓存）
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/delectCodeById', MyType.post)
    async delectCodeById(
        @routerDec.RequestParams('String', 'id') id: string,
        @routerDec.RequestParams('Number', 'componentId') componentId: number,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<boolean>();

        try {
            await CodeControl.CodeServices.removeCodesByIds(id, componentId);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.send(response);
    }

}

export default routerDec;
