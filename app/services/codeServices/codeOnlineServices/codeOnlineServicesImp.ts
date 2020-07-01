/**
 * @author WYX
 * @date 2020/7/1
 * @Description: 在线编辑接口定义
*/
export interface CodeOnlineServicesImp {

    /**
     * 处理vue代码在线显示
     * @param {String} a 传入string的代码片段
     */
    dealVueOnlineCode(a: string): Promise<string>;
}
