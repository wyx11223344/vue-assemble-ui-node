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
}
