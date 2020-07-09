/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 组件操作接口定义
*/
import Components from '../../models/components';

export interface ComponentsServicesImp {

    /**
     * 保存新组件返回新组建id
     * @param {Number} componentId 组件id值，用作缓存清除
     * @param {Components} components 新组件名称
     */
    setComponent(components: Components, componentId?: number): Promise<number>;

    /**
     * 获取全部组件信息
     */
    getAllComponents(): Promise<Components[]>;

    /**
     * 通过ids删除组件信息
     * @param {string} Ids ,拼接ids
     */
    removeComponentsByIds(Ids: string): Promise<boolean>;
}
