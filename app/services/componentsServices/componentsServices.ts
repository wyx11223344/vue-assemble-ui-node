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
     * @param {Number} componentId 组件id值，用作缓存清除
     * @returns {Promise<number>} 返回id
     */
    @RedisDec.CacheEvict('Codes', 'getCodes', '#componentId')
    @RedisDec.CacheEvict('Components', 'getAllComponents')
    setComponent(components: Components, componentId?: number): Promise<number> {
        if (componentId) {
            return ComponentsMapper.updateComponents(components).then((r) => r.insertId);
        } else {
            return ComponentsMapper.setNewComponents(components).then((r) => r.insertId);
        }
    }

    /**
     * 获取全部组件信息
     * @returns {Promise<Components[]>}
     */
    @RedisDec.Cacheable('Components')
    getAllComponents(): Promise<Components[]> {
        return ComponentsMapper.getAllComponents();
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
