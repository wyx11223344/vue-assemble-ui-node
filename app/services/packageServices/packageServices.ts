import {PackageServicesImp} from './packageServicesImp';
import NpmPublish from '../../models/npmPublish';
import NpmPublishMapper from '../../mapper/npmPublishMapper';

export default class PackageServices implements PackageServicesImp{

    /**
     * 通过id查询npm详细信息(,分割查询多个)
     * @param {String} npmId npm包的id
     * @returns {Promise<any>}
     */
    async getNpmById(npmId: string): Promise<NpmPublish[]> {
        return NpmPublishMapper.getNpmById(npmId);
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
     * @returns {Promise<boolean>}
     */
    async setNpm(npmPublish: NpmPublish): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (npmPublish.id) {
                const npmObj: NpmPublish[] = await this.getNpmById(`${npmPublish.id}`);

                // 判断版本信息问题
                if (npmObj[0] && npmObj[0].version >= npmPublish.version) {
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
}
