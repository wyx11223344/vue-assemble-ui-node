import {CodeSercicesImp} from './codeSercicesImp';
import Codes from '../../models/codes';
import CodesMapper from '../../mapper/codesMapper';
import RedisDec from '../../decorators/redisDec';
import Components from '../../models/components';
import ComponentsMapper from '../../mapper/componentsMapper';

export default class CodeServices implements CodeSercicesImp{

    /**
     * 获取html代码
     * @param {Number} componentId 组件id
     * @returns {undefined} 返回Codes对象
     */
    @RedisDec.Cacheable('Codes', '#componentId')
    async getCodes(componentId: number): Promise<Codes[]> {
        return await CodesMapper.getCodesByComId(componentId);
    }

    /**
     * 保存代码
     * @param {Codes[]} Codes 传递Codes对象数组
     * @returns {Promise<boolean>} 返回结果
     */
    @RedisDec.CacheEvict('Codes', 'getCodes')
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
                if (item._id) {
                    CodesMapper.updateCodesById(item).then(backDeal);
                } else {
                    CodesMapper.setCodesByComId(item).then(backDeal);
                }
            });
        });
    }

    /**
     * 保存新组件返回id
     * @param {Components} components 组件对象
     * @param {Number} componentId 组件id值，用作缓存清除
     * @returns {Promise<number>} 返回id
     */
    @RedisDec.CacheEvict('Codes', 'getCodes', '#componentId')
    setComponent(components: Components, componentId?: number): Promise<number> {
        if (componentId) {
            return ComponentsMapper.updateComponents(components).then((r) => r.insertId);
        } else {
            return ComponentsMapper.setNewComponents(components).then((r) => r.insertId);
        }
    }
}
