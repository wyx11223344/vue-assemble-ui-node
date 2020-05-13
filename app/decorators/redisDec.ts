import MyRedis from "../cache";

export default class RedisDec {
    /**
     * 进行key设置
     * @param key
     * @param params
     * @param outTime
     * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => void}
     * @constructor
     */
    static CacheEvict(key: string, params?: string, outTime: number = 60): MethodDecorator {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            // 保存现有方法
            const setFunction = descriptor.value;
            // 重写方法
            descriptor.value = async () => {
                const getValue = await MyRedis.get(`${key}:${propertyKey}:${params}`);
                if (getValue) {
                    MyRedis.exp(`${key}:${propertyKey}:${params}`, outTime);
                    return getValue
                };
                const dueBack = await setFunction();
                MyRedis.set(`${key}:${propertyKey}:${params}`, dueBack);
                MyRedis.exp(`${key}:${propertyKey}:${params}`, outTime);
                return dueBack;
            }
        }
    }
}
