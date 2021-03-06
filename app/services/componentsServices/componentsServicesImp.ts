/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 组件操作接口定义
*/
import Components from '../../models/components';
import {BackComponents} from '../../types/codes';

export interface ComponentsServicesImp {

    /**
     * 保存新组件返回新组建id
     * @param {Number} classify 组件类型
     * @param {Components} components 新组件名称
     */
    setComponent(components: Components, Id?: number): Promise<number>;

    /**
     * 通过classify获取组件信息
     * @param {Number} classify 类别
     */
    // getComponentsByClassify(classify: number, page: number, pageSize: number): Promise<Components[]>;

    /**
     * 获取全部组件信息
     */
    getAllComponents(component: Components, page: number, pageSize: number): Promise<{ list: Components[]; total: number }>;

    /**
     * 通过ids删除组件信息
     * @param {string} Ids ,拼接ids
     */
    removeComponentsByIds(Ids: string): Promise<boolean>;

    /**
     * 为组件添加html获取缓存id
     * @param {BackComponents[]} findComponents 需要添加的组件对象
     */
    dealComponentsAddHtml(findComponents: BackComponents[]): Promise<void>;

    /**
     * 通过ids获取组件信息
     * @param Ids
     */
    getComponentsByIds(Ids: string): Promise<Components[]>;
}
