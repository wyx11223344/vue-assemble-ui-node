/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 组件操作服务接口
*/
import {ComponentsServicesImp} from './componentsServicesImp';
import RedisDec from '../../decorators/redisDec';
import Components from '../../models/components';
import ComponentsMapper from '../../mapper/componentsMapper';

export default class ComponentsServices implements ComponentsServicesImp {

    /**
     * 保存新组件返回id
     * @param {Components} components 组件对象
     * @param {Number} classify 组件i类型
     * @returns {Promise<number>} 返回id
     */
    @RedisDec.CacheEvict('Components', 'getAllComponents')
    @RedisDec.CacheEvict('Components', 'getComponentsByClassify', '#classify')
    setComponent(components: Components, classify?: number): Promise<number> {
        if (components.id) {
            return ComponentsMapper.updateComponents(components).then((r) => r.insertId);
        } else {
            return ComponentsMapper.setNewComponents(components).then((r) => r.insertId);
        }
    }

    /**
     * 通过classify获取组件信息
     * @param {Number} classify 类别
     */
    @RedisDec.Cacheable('Components', '#classify')
    getComponentsByClassify(classify: number): Promise<Components[]> {
        return ComponentsMapper.getComponentsByClassify(classify);
    }

    /**
     * 获取全部组件信息
     * @param {Number} num 获取条数
     * @returns {Promise<Components[]>}
     */
    @RedisDec.Cacheable('Components', '#num')
    getAllComponents(num?: number): Promise<Components[]> {
        return ComponentsMapper.getAllComponents(num);
    }

    /**
     * 通过id删除组件信息
     * @param {Number} Id 组件id
     * @returns {Promise<boolean>}
     */
    @RedisDec.CacheEvict('Components', 'getAllComponents')
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
}
