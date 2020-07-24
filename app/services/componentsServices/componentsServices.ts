/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 组件操作服务接口
*/
import {ComponentsServicesImp} from './componentsServicesImp';
import RedisDec from '../../decorators/redisDec';
import Components from '../../models/components';
import ComponentsMapper from '../../mapper/componentsMapper';
import {BackComponents} from '../../types/codes';
import Codes from '../../models/codes';
import RandomWord from '../../utils/randomWord';
import MyRedis from '../../cache';
import CodeServices from '../codeServices/codeServices';

export default class ComponentsServices implements ComponentsServicesImp {
    private static CodeServices: CodeServices = new CodeServices()

    /**
     * 保存新组件返回id
     * @param {Components} components 组件对象
     * @param {Number} classify 组件i类型
     * @returns {Promise<number>} 返回id
     */
    @RedisDec.CacheEvict('Components', 'getAllComponents')
    @RedisDec.CacheEvict('Components', 'getComponentsById', '#Id')
    setComponent(components: Components, Id?: number): Promise<number> {
        if (components.id) {
            return ComponentsMapper.updateComponents(components).then((r) => r.insertId);
        } else {
            return ComponentsMapper.setNewComponents(components).then((r) => r.insertId);
        }
    }

    // /**
    //  * 通过classify获取组件信息
    //  * @param {Number} classify 类别
    //  */
    // @RedisDec.Cacheable('Components', '#classify#page#pageSize')
    // getComponentsByClassify(classify: number, page: number, pageSize: number): Promise<Components[]> {
    //     return ComponentsMapper.getComponentsByClassify(classify, page, pageSize);
    // }

    /**
     * 获取全部组件信息
     * @param {Number} num 获取条数
     * @returns {Promise<Components[]>}
     */
    @RedisDec.Cacheable('Components', '#component#page#pageSize')
    getAllComponents(component: Components, page: number, pageSize: number): Promise<{ list: Components[]; total: number }> {
        return ComponentsMapper.getAllComponents(component, page, pageSize);
    }

    /**
     * 通过id删除组件信息
     * @param {Number} Id 组件id
     * @returns {Promise<boolean>}
     */
    @RedisDec.CacheEvict('Components', 'getAllComponents')
    @RedisDec.CacheEvict('Components', 'getComponentsById', '#Id')
    private static removeComponentsById(Id: number): Promise<boolean> {
        return ComponentsMapper.removeComponentById(Id);
    }

    /**
     * 通过ids删除多个组件
     * @param {String} Ids ids字符串
     * @returns {Promise<boolean>}
     */
    removeComponentsByIds(Ids: string): Promise<boolean> {
        let checkNum = 0;
        let checkStatus = true;
        return new Promise((resolve, reject) => {
            Ids.split(',').forEach((item: string) => {
                ComponentsServices.removeComponentsById(Number(item)).then((results: boolean) => {
                    if (!results) {checkStatus = false;}
                    checkNum++;
                    if (checkNum >= Ids.split(',').length) {
                        resolve(checkStatus);
                    }
                }).catch((e) => {
                    reject(e);
                });
            });
        });
    }

    /**
     * 通过id获得组件信息
     * @param {Number} Id 组件id
     * @returns {Promise<boolean>}
     */
    @RedisDec.Cacheable('Components', '#Id')
    private static getComponentsById(Id: number): Promise<Components[]> {
        return ComponentsMapper.getComponentById(Id);
    }

    /**
     * 通过ids获取多个组件
     * @param {String} Ids ids字符串
     * @returns {Promise<boolean>}
     */
    getComponentsByIds(Ids: string): Promise<Components[]> {
        let checkNum = 0;
        let checkStatus = [];
        return new Promise((resolve, reject) => {
            Ids.split(',').forEach((item: string) => {
                ComponentsServices.getComponentsById(Number(item)).then((results: Components[]) => {
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

    /**
     * 为组件添加html获取缓存id
     * @param {BackComponents[]} findComponents 需要添加的组件对象
     */
    dealComponentsAddHtml(findComponents: BackComponents[]): Promise<void> {
        return new Promise((resolve, reject) => {
            if (findComponents.length <= 0) {resolve();}
            let checkNum = 0;
            findComponents.forEach((item: BackComponents) => {
                ComponentsServices.CodeServices.getCodes(item.id).then((results: Codes[]) => {
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
    }
}
