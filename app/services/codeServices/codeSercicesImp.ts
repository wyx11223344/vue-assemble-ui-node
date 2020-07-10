/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 代码操作接口定义
*/
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
     * @param {Number} componentId 用作清空缓存
     */
    setCodes(Codes: Codes[], componentId: number): Promise<boolean>;

    /**
     * 通过ids删除多个代码片段
     * @param {String} Ids ,拼接字符串
     */
    removeCodesByIds(Ids: string): Promise<boolean>;

    /**
     * 通过组件ids删除代码片段
     * @param {String} Ids ,拼接字符串
     */
    removeCodesByComponentsIds(Ids: string): Promise<boolean>;
}
