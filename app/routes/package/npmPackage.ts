/**
 * @author WYX
 * @date 2020/7/9
 * @Description: npm包管理
*/
import {MyType, RouterDec} from '../../decorators/routerDec';
import * as express from 'express';
import CodeServices from '../../services/codeServices/codeServices';
import PublishPackageServices from '../../services/packageServices/npmPackageServices/publishPackageServices';
import PackageServices from '../../services/packageServices/packageServices';
import BaseResponse, {BackType} from '../../models/baseResponse';
import NpmPublish from '../../models/npmPublish';
import { BaseErrorMsg, BaseSuccessMsg} from '../../types/baseBackMsg';

const routerDec: RouterDec = new RouterDec();

@routerDec.BaseRequest('/package/npmPackage')
export class NpmPackage {
    private static CodeServices: CodeServices = new CodeServices()
    private static PublishPackageServices: PublishPackageServices = new PublishPackageServices()
    private static PackageServices: PackageServices = new PackageServices()

    /**
     * 创建新的npm包
     * @group npm包管理
     * @route POST /package/npmPackage/setNpm
     * @param {number} id.formData npm包的id
     * @param {string} componentsId.formData.required 以,分割的组件ids
     * @param {string} name.formData.required 发布包名称
     * @param {string} version.formData.required 版本号
     * @returns {Promise} 200 - 返回true
     */
    @routerDec.RequestMapping('/setNpm', MyType.post)
    async setNpm(
        @routerDec.RequestParams('Number', 'id') id: number,
        @routerDec.RequestParams('String', 'componentsId') componentsId: string,
        @routerDec.RequestParams('String', 'name') name: string,
        @routerDec.RequestParams('String', 'version') version: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<NpmPublish[]>();

        try {
            if (!id && (await NpmPackage.PackageServices.getNpmByName(name)).length > 0) {
                throw BaseErrorMsg.saveNpmName;
            }

            const npmPublish: NpmPublish = new NpmPublish(id, name, componentsId, version);

            if (!await NpmPackage.PackageServices.setNpm(npmPublish, npmPublish.id)) {
                throw BaseErrorMsg.sqlError;
            }

            // const componentIds: number[] = componentsId.split(',').map((item: string) => Number(item));
            //
            // // 获取代码数组
            // const ComponentsCodes: {[a: string]: Codes[]} = await NpmPackage.CodeServices.getCodesByIds(componentIds);
            //
            // if (!await NpmPackage.PublishPackageServices.addNewPackage(name, ComponentsCodes, version)) {
            //     throw BaseErrorMsg.redisError;
            // }

            response.changeType(BackType.success);
            response._msg = BaseSuccessMsg.saveNpm;
        } catch (e) {
            response._msg = e;
        }

        res.send(response);
    }

    /**
     * 通过id获取npm包信息
     * @group npm包管理
     * @route POST /package/npmPackage/getNpmById
     * @param {string} id.formData.required 以,分割的npm包的id
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/getNpmById', MyType.post)
    async getNpmById(
        @routerDec.RequestParams('String', 'id') id: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<NpmPublish[]>();

        try {
            response._datas = await NpmPackage.PackageServices.getNpmByIds(id);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.send(response);
    }

    /**
     * 通过name获取npm包信息
     * @group npm包管理
     * @route POST /package/npmPackage/getNpmByName
     * @param {string} id.formData.required 以,分割的npm包的name
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/getNpmByName', MyType.post)
    async getNpmByName(
        @routerDec.RequestParams('String', 'NpmName') NpmName: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<NpmPublish[]>();

        try {
            response._datas = await NpmPackage.PackageServices.getNpmByName(NpmName);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.send(response);
    }

    /**
     * 获取全部npm包信息
     * @group npm包管理
     * @route POST /package/npmPackage/getAllNpm
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/getAllNpm', MyType.post)
    async getAllNpm(
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<NpmPublish[]>();

        try {
            response._datas = await NpmPackage.PackageServices.getAllNpm();
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.send(response);
    }

    /**
     * 通过id删除npm包
     * @group npm包管理
     * @route POST /package/npmPackage/delectNpmById
     * @param {string} id.formData.required 以,分割的npm包的id
     * @returns {Promise} 200 - 返回npm包信息数组
     */
    @routerDec.RequestMapping('/delectNpmById', MyType.post)
    async delectNpmById(
        @routerDec.RequestParams('String', 'id') id: string,
        @routerDec.Response() res: express.Response
    ): Promise<void> {
        const response = new BaseResponse<boolean>();

        try {
            response._datas = await NpmPackage.PackageServices.delectNpmByIds(id);
            response.changeType(BackType.success);
        } catch (e) {
            response._msg = BaseErrorMsg.sqlError;
        }

        res.send(response);
    }
}

export default routerDec;
