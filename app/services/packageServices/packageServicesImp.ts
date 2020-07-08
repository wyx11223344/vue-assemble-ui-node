import NpmPublish from '../../models/npmPublish';

export interface PackageServicesImp {

    /**
     * 通过id获取npm信息
     * @param {String} npmId npmId号
     */
    getNpmByIds(npmId: string): Promise<NpmPublish[]>;

    /**
     * 通过ids删除npm包
     * @param {String} npmIds 拼接ids
     */
    delectNpmByIds(npmIds: string): Promise<boolean>;

    /**
     * 通过name获取npm信息
     * @param {String} npmName 名字字符串(,拼接查询多个)
     */
    getNpmByName(npmName: string): Promise<NpmPublish[]>;

    /**
     * 更新或新增npm包
     * @param {NpmPublish} npmPublish 新增对象
     */
    setNpm(npmPublish: NpmPublish): Promise<boolean>;

    /**
     * 获取全部npm包
     */
    getAllNpm(): Promise<NpmPublish[]>;
}
