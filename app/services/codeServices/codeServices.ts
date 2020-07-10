/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 代码操作服务接口
*/
import {CodeSercicesImp} from './codeSercicesImp';
import Codes from '../../models/codes';
import CodesMapper from '../../mapper/codesMapper';
import RedisDec from '../../decorators/redisDec';
import {BaseErrorMsg} from '../../types/baseBackMsg';

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
        return await new Promise((resolve, reject) => {
            try {
                let checkCodePromise = 0;
                let ComponentCodes: {[a: string]: Codes[]} = {};
                componentIds.forEach((componentId: number) => {
                    // 执行查询组件代码服务
                    (async (): Promise<void> => {
                        const getCodes: Codes[] = await this.getCodes(componentId);
                        // TODO 需要添加说明接口注释
                        if (getCodes.find((item: Codes) => item.type === 1)) {
                            ComponentCodes[getCodes.find((item: Codes) => item.type === 1).name] = getCodes;
                        }
                        checkCodePromise++;
                        if (checkCodePromise >= componentIds.length) {
                            resolve(ComponentCodes);
                        }
                    })();
                });
            } catch (e) {
                reject(BaseErrorMsg.sqlError);
            }
        });
    }

    /**
     * 保存代码
     * @param {Codes[]} Codes 传递Codes对象数组
     * @param {Number} componentId 用作清空缓存
     * @returns {Promise<boolean>} 返回结果
     */
    @RedisDec.CacheEvict('Codes', 'getCodes', '#componentId')
    setCodes(Codes: Codes[], componentId: number): Promise<boolean> {
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

    /**
     * 通过id删除代码片段
     * @param {Number} Id 组件id
     * @returns {Promise<boolean>}
     */
    private static removeCodesById(Id: number): Promise<boolean> {
        return CodesMapper.removeCodeById(Id);
    }

    /**
     * 通过ids删除代码片段
     * @param {String} Ids ids字符串
     * @param {Number} componentId 组件id用作缓存判断
     * @returns {Promise<boolean>}
     */
    @RedisDec.CacheEvict('Codes', 'getCodes', '#componentId')
    removeCodesByIds(Ids: string, componentId?: number): Promise<boolean> {
        let checkNum = 0;
        let checkStatus = true;
        return new Promise((resolve, reject) => {
            Ids.split(',').forEach((item: string) => {
                CodeServices.removeCodesById(Number(item))
                    .then((results: boolean) => {
                        if (!results) {checkStatus = false;}
                        checkNum++;
                        if (checkNum >= Ids.split(',').length) {
                            resolve(checkStatus);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
            });
        });
    }

    /**
     * 通过组件id删除全部代码片段
     * @param {Number} Id 组件id
     * @returns {Promise<boolean>}
     */
    @RedisDec.CacheEvict('Codes', 'getCodes', '#componentId')
    private static removeCodesByComponentsId(Id: number): Promise<boolean> {
        return CodesMapper.removeCodeByComponentsId(Id);
    }

    /**
     * 通过组件ids删除全部代码片段
     * @param {String} Ids 组件ids
     * @returns {Promise<boolean>}
     */
    removeCodesByComponentsIds(Ids: string): Promise<boolean> {
        let checkNum = 0;
        let checkStatus = true;
        return new Promise((resolve, reject) => {
            Ids.split(',').forEach((item: string) => {
                CodeServices.removeCodesByComponentsId(Number(item)).then((results: boolean) => {
                    if (!results) {checkStatus = false;}
                    checkNum++;
                    if (checkNum >= Ids.split(',').length) {
                        resolve(checkStatus);
                    }
                }).catch((e) => {
                    reject(e);
                });
            });
        });
    }
}
