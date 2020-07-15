import componentsClassify from '../../models/componentsClassify';

export interface ComponentsClassifyServicesImp {

    /**
     * 获取全部类型
     */
    getAllClassify(): Promise<componentsClassify[]> ;
}
