import Codes from '../../models/codes';
import Components from '../../models/components';

export interface CodeSercicesImp {

    /**
     * 获取html代码
     * @param {Number} componentId 组件id
     */
    getCodes(componentId: number): Promise<Codes[]>;

    /**
     * 保存html代码
     * @param {Codes[]} Codes 保存对象
     */
    setCodes(Codes: Codes[]): Promise<boolean>;

    /**
     * 保存新组件返回新组建id
     * @param {Number} componentId 组件id值，用作缓存清除
     * @param {Components} components 新组件名称
     */
    setComponent(components: Components, componentId?: number): Promise<number>;
}
