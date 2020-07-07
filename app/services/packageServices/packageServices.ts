import {PackageServicesImp} from './packageServicesImp';
import NpmPublish from '../../models/npmPublish';
import NpmPublishMapper from '../../mapper/npmPublishMapper';
import RedisDec from '../../decorators/redisDec';

export default class PackageServices implements PackageServicesImp{

    /**
     * 通过id查询npm详细信息
     * @param {String} npmId npm包的id
     * @returns {Promise<any>}
     */
    @RedisDec.Cacheable('NpmPublish', '#npmId')
    async getNpmById(npmId: number): Promise<NpmPublish> {
        return NpmPublishMapper.getNpmById(npmId);
    }

    /**
     *
     * @param npmIds
     * @returns {Promise<void>}
     */
    async getNpmByIds(npmIds: string): Promise<NpmPublish[]> {
        const backList: NpmPublish[] = [];
        let checkNum = 0;
        return new Promise((resolve) => {
            npmIds.split(',').forEach((item: string) => {
                this.getNpmById(Number(item)).then((result: NpmPublish) => {
                    backList.push(result);
                    checkNum++;
                    if (checkNum >= npmIds.split(',').length) {
                        resolve(backList);
                    }
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
                const npmObj: NpmPublish = await this.getNpmById(npmId);

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
