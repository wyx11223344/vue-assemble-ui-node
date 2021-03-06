/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 前端传递codes对象定义
*/
import Components from '../models/components';

export interface HtmlObj {
    id?: number;
    name: string;
    html: string;
    componentId?: number;
    type?: number;
}

export interface OnCodeObj{
    codes: HtmlObj[];
    threePacks: string;
}

export interface BackComponents extends Components{
    htmlId?: string;
}
