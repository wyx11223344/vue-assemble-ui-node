/**
 * @author WYX
 * @date 2020/8/3
 * @Description: 三方包服务接口定义类
*/
import ThreePacks from '../../models/threePacks';

export interface ThreePacksServicesImp {

	/**
	 * 获取三方包
	 * @param {String} name 获取名称
	 */
	getThreePacks(name: string): Promise<ThreePacks[]>;

	/**
	 * 通过id字符串获取三方包数据
	 * @param {String} ids 通过,拼接的ids
	 */
	getThreePacksByIds(ids: string): Promise<ThreePacks[]>;

	/**
	 * 保存第三方包
	 * @param {ThreePacks} threePacks 第三方包对象
	 * @param {Number} Id 第三方包id用作清除缓存
	 */
	savePacks(threePacks: ThreePacks, Id: number): Promise<number>;
}
