/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 路由加载类
 */
import * as express from 'express';
import * as fs from 'fs';

export default class MyRouter {
    protected router: express.Router

    /**
     * 构造函数
     */
    constructor() {
        this.router = express.Router();

        this.getRouter();
    }

    /**
     * 获取router实例(写个protected感觉比较牛皮)
     * @returns {e.Router} 返回router实例
     */
    getMyRouter(): express.Router {
        return this.router;
    }

    /**
     * 注入传入路径的路由
     * @param {String} routeUrl 传入需要遍历的路径
     * @returns {void}
     */
    private getRouter(routeUrl = ''): void {
        const files = fs.readdirSync((__dirname + routeUrl) as fs.PathLike);

        files
            .filter(
                function(file: string): boolean{
                    return file.split('.')[0] !== 'loader';
                }
            )
            .forEach(
                (file: string) => {
                    if (file.split('.').length === 1) {
                        this.getRouter(routeUrl + '/' + file.split('.')[0]);
                    } else {
                        import(`.${routeUrl}/${file.split('.')[0]}`)
                            .then((route) => {
                                route = route.default.router;
                                this.router.use(`/`, route);
                            })
                            .catch((e) => {
                                console.log(e);
                                throw Error('读取路由文件失败，请检查');
                            });
                    }
                }
            );
    }

}
