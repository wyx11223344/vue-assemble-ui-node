import {CodeSercicesImp} from './codeSercicesImp';
import Codes from '../../models/codes';
import CodesMapper from '../../mapper/codesMapper';
import RedisDec from '../../decorators/redisDec';

export default class CodeServices implements CodeSercicesImp{

    /**
     * 获取html代码
     * @param {Number} componentId 组件id
     * @returns {Promise<Codes[]>} 返回Codes对象
     */
    @RedisDec.Cacheable('Codes', '#componentId')
    async getCodes(componentId: number): Promise<Codes[]> {
        return await CodesMapper.getCodesByComId(componentId);
    }

    /**
     * 获取html对象通过传入ids
     * @param {number[]} componentIds 传入ids数组
     * @returns {Promise<{[p: string]: Codes[]}>}
     */
    async getCodesByIds(componentIds: number[]): Promise<{[a: string]: Codes[]}> {
        return await new Promise((resolve) => {
            let checkCodePromise = 0;
            let ComponentCodes: {[a: string]: Codes[]} = {};
            componentIds.forEach((componentId: number) => {
                // 执行查询组件代码服务
                (async (): Promise<void> => {
                    const getCodes: Codes[] = await this.getCodes(componentId);
                    ComponentCodes[getCodes.find((item: Codes) => item.type === 1).name] = getCodes;
                    checkCodePromise++;
                    if (checkCodePromise >= componentIds.length) {
                        resolve(ComponentCodes);
                    }
                })();
            });
        });
    }

    /**
     * 保存代码
     * @param {Codes[]} Codes 传递Codes对象数组
     * @returns {Promise<boolean>} 返回结果
     */
    setCodes(Codes: Codes[]): Promise<boolean> {
        return new Promise((resolve) => {
            let checkNum = 0;
            let checkStatus = true;
            const setIds = [];

            const backDeal = function (r): void {
                checkNum++;
                setIds.push(r.insertId);
                if (r.fieldCount > 0) {
                    checkStatus = false;
                }
                if (Codes.length >= checkNum) {
                    resolve(checkStatus);
                }
            };

            Codes.forEach((item: Codes) => {
                if (item.id) {
                    CodesMapper.updateCodesById(item).then(backDeal);
                } else {
                    CodesMapper.setCodesByComId(item).then(backDeal);
                }
            });
        });
    }
}
