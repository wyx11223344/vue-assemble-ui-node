/**
 * @author WYX
 * @date 2020/5/9
 * @Description: 路由获取主文件
 */
import * as express from 'express';
import * as fs from 'fs';

const router: express.Router = express.Router();
const files = fs.readdirSync(__dirname);

files
    .filter(
        function(file: string): boolean{
            return file.split('.')[0] !== 'loader';
        }
    )
    .forEach(
        function(file: string){
            import(`./${file.split('.')[0]}`)
                .then((route) => {
                    route = route.default;
                    if (file.split('.')[0] === 'index'){
                        router.use('/', route);
                    } else {
                        router.use(`/${file.split('.')[0]}`, route);
                    }
                })
                .catch((e) => {
                    console.log(e);
                    throw Error('读取路由文件失败，请检查');
                });

        }
    );

export default router;
