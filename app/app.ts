/**
 * @author WYX
 * @date 2020/5/12
 * @Description: 项目app配置类
*/
import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as resApi from 'res.api';
import MyRouter from './routes/loader';

interface BackError extends Error {
    status: number;
}

export type App = express.Application

export class Server {
    app: express.Application

    /**
     * 构造函数
     */
    constructor() {
        this.app = express();

        this.config();

        this.routes();

        this.handlers();
    }

    /**
     * 基础配置
     * @returns {void}
     */
    private config(): void {
        this.app.use(resApi);
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'pug');
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    /**
     * 路由配置
     * @returns {void}
     */
    private routes(): void {
        this.app.use('/', (new MyRouter()).getMyRouter());
    }

    /**
     * 意外请求中间件处理配置
     * @returns {void}
     */
    private handlers(): void {

        this.app.use(Server.errorNew);

        this.app.use(Server.errorHandle);
    }

    /**
     * 资源访问错误
     * @param {express.Request} req 请求对象
     * @param {express.Response} res 返回对象
     * @param {express.NextFunction} next 下一步执行方法
     * @returns {void}
     */
    private static errorNew(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    }

    /**
     * 访问错误处理
     * @param {BackError} err 报错内容
     * @param {express.Request} req 请求对象
     * @param {express.Response} res 返回对象
     * @param {express.NextFunction} next 下一步方法
     * @returns {void}
     */
    private static errorHandle(
        err: BackError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void {
        // eslint-disable-next-line no-magic-numbers
        res.status(err.status || 404);
        res.render('error', {
            message: err.message,
            error: err
        });
    }
}
