/**
 * @author WYX
 * @date 2020/7/9
 * @Description: npm包数据库操作服务
 */
import {ThreePacksServicesImp} from './threePacksServicesImp';
import ThreePacks from '../../models/threePacks';
import ThreePacksMapper from '../../mapper/threePacksMapper';
import RedisDec from '../../decorators/redisDec';

export default class ThreePacksServices implements ThreePacksServicesImp{

	/**
	 * 获取三方包
	 * @param {String} name 获取名称
	 * @returns {Promise<ThreePacks[]>}
	 */
	@RedisDec.Cacheable('threePacks', '#name')
    getThreePacks(name: string): Promise<ThreePacks[]> {
        return ThreePacksMapper.getThreePacks(name);
    }

	/**
	 * 通过id获取三方包数据
	 * @param {Number} Id 三方包的id
	 * @returns {Promise<boolean>}
	 */
	@RedisDec.Cacheable('threePacks', '#Id')
	private static getThreePacksById(Id: number): Promise<ThreePacks[]> {
	    return ThreePacksMapper.getThreePacksById(Id);
	}

	/**
	 * 通过id字符串获取三方包数据
	 * @param {String} Ids ids字符串
	 * @returns {Promise<boolean>}
	 */
	getThreePacksByIds(Ids: string): Promise<ThreePacks[]> {
	    let checkNum = 0;
	    let checkStatus = [];
	    return new Promise((resolve, reject) => {
	        Ids.split(',').forEach((item: string) => {
	            ThreePacksServices.getThreePacksById(Number(item)).then((results: ThreePacks[]) => {
	                if (!results) {reject();}
	                checkNum++;
	                checkStatus.push(...results);
	                if (checkNum >= Ids.split(',').length) {
	                    resolve(checkStatus);
	                }
	            }).catch((e) => {
	                reject(e);
	            });
	        });
	    });
	}

}
