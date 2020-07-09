/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 基础返回实体
*/
export enum BackType {
    'success' = 'success',
    'dealError' = 'dealError',
    'paramsError' = 'paramsError'
}

export enum CodesType {
    'success' = 200,
    'dealError' = 500,
    'paramsError' = 401
}

export default class BaseResponse<T> {
    private codes: CodesType;
    private datas: T;
    private msg: string;

    constructor(deal?: BackType) {
        const baseRes: BackType = deal ? deal : BackType.dealError;
        this.changeType(baseRes);
    }

    get _codes(): CodesType {
        return this.codes;
    }

    set _codes(value: CodesType) {
        this.codes = value;
    }

    get _datas(): T {
        return this.datas;
    }

    set _datas(value: T) {
        this.datas = value;
    }

    get _msg(): string {
        return this.msg;
    }

    set _msg(value: string) {
        this.msg = value;
    }

    /**
     * 改变返回值状态
     * @param {BackType} baseRes 返回状态值
     * @returns {void}
     */
    changeType(baseRes: BackType): void {
        this.codes = CodesType[baseRes];
    }

}
