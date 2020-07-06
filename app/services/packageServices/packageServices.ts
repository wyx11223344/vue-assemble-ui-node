import {PackageServicesImp} from './packageServicesImp';
import NpmPublish from '../../models/npmPublish';
import NpmPublishMapper from '../../mapper/npmPublishMapper';

export default class PackageServices implements PackageServicesImp{
    async getNpmById(npmId: string): Promise<NpmPublish[]> {
        return NpmPublishMapper.getNpmById(npmId);
    }

    async getNpmByName(npmName: string): Promise<NpmPublish[]> {
        return NpmPublishMapper.getNpmByName(npmName);
    }

    async setNpm(npmPublish: NpmPublish): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (npmPublish.id) {
                const npmObj: NpmPublish[] = await this.getNpmById(`${npmPublish.id}`);

                // 判断版本信息问题
                if (npmObj[0] && npmObj[0].version >= npmPublish.version) {
                    resolve(false);
                } else {
                    console.log(123);
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
