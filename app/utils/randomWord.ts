/**
 * @author WYX
 * @date 2020/5/26
 * @Description: 获取随机不重复字符串
*/
import * as sha1 from 'sha1';

export default class RandomWord {
    private static _getRandomString(len?: number): string {
        len = len || 32;
        const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        const maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    static getSign(): string {
        const timestamp = (new Date()).getTime() / 1000;
        const randstr = this._getRandomString(10);
        const arr = `${timestamp + randstr}LOVESHEN`;
        const sha = sha1(arr);
        return sha.toUpperCase();
    }
}
