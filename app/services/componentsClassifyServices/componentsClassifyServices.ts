import RedisDec from '../../decorators/redisDec';
import {ComponentsClassifyServicesImp} from './componentsClassifyServicesImp';
import ComponentsClassify from '../../models/componentsClassify';
import ComponentsClassifyMapper from '../../mapper/componentsClassifyMapper';

export default class ComponentsClassifyServices implements ComponentsClassifyServicesImp{

    /**
     * 获取全部类别接口
     * @returns {Promise<any[]>}
     */
    @RedisDec.Cacheable('Classify')
    getAllClassify(): Promise<ComponentsClassify[]> {
        return ComponentsClassifyMapper.getAllClassify();
    }

}
