import Codes from '../../models/codes';

export interface CodeSercicesImp {

    /**
     * 获取html代码
     * @param {Number} componentId 组件id
     */
    getCodes(componentId: number): Promise<Codes[]>;
}
