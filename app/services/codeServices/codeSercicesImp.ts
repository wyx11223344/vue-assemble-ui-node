import Codes from '../../models/codes';
import Components from '../../models/components';

export interface CodeSercicesImp {

    /**
     * 获取html代码
     * @param {Number} componentId 组件id
     */
    getCodes(componentId: number): Promise<Codes[]>;

    /**
     * 通过传入ids获取html代码对象
     * @param {Array} componentIds 组件ids
     */
    getCodesByIds(componentIds: number[]): Promise<{[a: string]: Codes[]}>;

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
