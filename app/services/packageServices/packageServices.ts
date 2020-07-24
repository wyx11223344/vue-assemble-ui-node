/**
 * @author WYX
 * @date 2020/7/9
 * @Description: npm包数据库操作服务
*/
import {PackageServicesImp} from './packageServicesImp';
import NpmPublish from '../../models/npmPublish';
import NpmPublishMapper from '../../mapper/npmPublishMapper';
import RedisDec from '../../decorators/redisDec';
import PublishPackageServices from './npmPackageServices/publishPackageServices';

export default class PackageServices implements PackageServicesImp{
    private static PublishPackageServices: PublishPackageServices = new PublishPackageServices()

    /**
     * 通过id查询npm详细信息
     * @param {String} npmId npm包的id
     * @returns {Promise<any>}
     */
    @RedisDec.Cacheable('NpmPublish', '#npmId')
    private static async getNpmById(npmId: number): Promise<NpmPublish[]> {
        return NpmPublishMapper.getNpmById(npmId);
    }

    /**
     * 通过id删除npm包
     * @param {String} npmId npm包的id
     * @returns {Promise<any>}
     */
    @RedisDec.CacheEvict('NpmPublish', 'getNpmById', '#npmId')
    private static async delectNpmById(npmId: number): Promise<boolean> {
        const getNpm: NpmPublish[] = await PackageServices.getNpmById(npmId);
        if (!await PackageServices.PublishPackageServices.removePackage(getNpm[0].name)) {
            return new Promise((resolve) => {resolve(false);});
        }
        return NpmPublishMapper.delectNpmById(npmId);
    }

    /**
     * 通过ids删除npm包
     * @param {String} npmId npm包的id
     * @returns {Promise<any>}
     */
    @RedisDec.CacheEvict('NpmPublish', 'getAllNpm')
    async delectNpmByIds(npmIds: string): Promise<boolean> {
        let checkNum = 0;
        let checkStatus = true;
        return new Promise((resolve, reject) => {
            npmIds.split(',').forEach((item: string) => {
                PackageServices.delectNpmById(Number(item)).then((results: boolean) => {
                    checkNum++;
                    if (!results) {checkStatus = false;}
                    if (checkNum >= npmIds.split(',').length) {
                        resolve(checkStatus);
                    }
                }).catch(() => {
                    reject();
                });
            });
        });
    }

    /**
     * 通过id字符串组查询包信息
     * @param npmIds
     * @returns {Promise<void>}
     */
    async getNpmByIds(npmIds: string): Promise<NpmPublish[]> {
        const backList: NpmPublish[] = [];
        let checkNum = 0;
        return new Promise((resolve, reject) => {
            npmIds.split(',').forEach((item: string) => {
                PackageServices.getNpmById(Number(item))
                    .then((result: NpmPublish[]) => {
                        backList.push(...result);
                        checkNum++;
                        if (checkNum >= npmIds.split(',').length) {
                            resolve(backList);
                        }
                    })
                    .catch(() => {
                        reject();
                    });
            });
        });
    }

    /**
     * 通过name查询npm详细信息(,分割查询多个)
     * @param {String} npmName npm包的名称
     * @returns {Promise<any>}
     */
    async getNpmByName(npmName: string): Promise<NpmPublish[]> {
        return NpmPublishMapper.getNpmByName(npmName);
    }

    /**
     * 更新或新增npm包
     * @param {NpmPublish} npmPublish 新增包对象
     * @param {Number} npmId 更新id
     * @returns {Promise<boolean>}
     */
    @RedisDec.CacheEvict('NpmPublish', 'getAllNpm')
    @RedisDec.CacheEvict('NpmPublish', 'getNpmById', '#npmId')
    async setNpm(npmPublish: NpmPublish, npmId?: number): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (npmId) {
                const npmObj: NpmPublish = (await PackageServices.getNpmById(npmId))[0];

                // 判断版本信息问题
                if (npmObj && npmObj.version >= npmPublish.version) {
                    resolve(false);
                } else {
                    await NpmPublishMapper.updateNpm(npmPublish);
                    resolve(true);
                }
            } else {
                await NpmPublishMapper.setNpm(npmPublish);
                resolve(true);
            }
        });
    }

    /**
     * 获取全部npm包信息
     * @returns {Promise<NpmPublish[]>}
     */
    @RedisDec.Cacheable('NpmPublish')
    getAllNpm(): Promise<NpmPublish[]> {
        return NpmPublishMapper.getAllNpm();
    }
}
