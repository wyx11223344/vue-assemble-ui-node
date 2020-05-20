/**
 * @author WYX
 * @date 2020/5/15
 * @Description: 工具装饰器类
*/
export class UtilsDec {

    /**
     * 返回实例化当前对象
     * @param {*} Target 传递的参数类
     * @param {String} propertyKey 传递的参数名
     * @returns {void}
     */
    static newSelf(Target: any, propertyKey: string): void {
        Target[propertyKey] = new Target();
    }
}
