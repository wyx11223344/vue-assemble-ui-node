import Codes from '../../models/codes';

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
}
