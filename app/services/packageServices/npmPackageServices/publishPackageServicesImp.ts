import Codes from '../../../models/codes';

export interface PublishPackageServicesImp {

    // /**
    //  * 判断路径上的文件夹是否存在
    //  * @param {String} path 路径
    //  * @returns {Promise<boolean>} 返回
    //  */
    // checkPathExist(path: string): Promise<boolean>;
    //
    // /**
    //  * 下载git模板至指定路径
    //  * @param {String} git git地址
    //  * @param {String} path 路径地址
    //  * @returns {Promise<boolean>} 返回
    //  */
    // downLoadGitTemplate(git: string, path: string): Promise<boolean>;
    //
    // /**
    //  * 创建新的package
    //  * @param {String} name 新组件的名称
    //  * @param {Codes[]} Codes 代码片段
    //  * @param {String} path 路径
    //  */
    // createNewPackage(path: string, name: string, Codes: Codes[]): Promise<boolean>;
    //
    // /**
    //  * 通过对象整体创建新组建
    //  * @param {String} path 路径
    //  * @param {Object} componentsObj 创建对象
    //  */
    // createPackageByObject(path: string, componentsObj: {[a: string]: Codes[]}): Promise<boolean>;
    //
    // /**
    //  * 更新package.json
    //  * @param {String} path 路径
    //  * @param {Object} obj 遍历对象
    //  */
    // packageJsonUpdate(path: string, obj: any): Promise<boolean>;

    /**
     * 添加一条新建npm包的命令
     * @param {String} name 路径
     * @param {Object} componentsObj 创建对象
     * @param {String} version 版本号
     */
    addNewPackage(name: string, componentsObj: {[a: string]: Codes[]}, version: string): Promise<boolean>;
}
