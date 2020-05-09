import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as resApi from 'res.api';
import loaderJs from './routes/loader';

interface BackError extends Error{
    status: number;
}

/**
 * 资源访问错误
 * @param {Object} req 请求对象
 * @param {Object} res 返回对象
 * @param {Function} next 下一步执行方法
 * @returns {void}
 */
function errorNew(
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
 * @param {Object} err 报错内容
 * @param {Object} req 请求对象
 * @param {Object} res 返回对象
 * @returns {void}
 */
function errorHandle(
    err: BackError,
    req: express.Request,
    res: express.Response
): void {
    // eslint-disable-next-line no-magic-numbers
    res.status(err.status || 404);
    res.render('error', {
        message: err.message,
        error: err
    });
}

export default class Server {
    app: express.Application;

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
    config(): void {
        this.app.use(resApi);
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'pug');
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    /**
     * 路由配置
     * @returns {void}
     */
    routes(): void {
        this.app.use('/', loaderJs);
    }

    /**
     * 意外请求中间件处理配置
     * @returns {void}
     */
    handlers(): void {

        this.app.use(errorNew);

        this.app.use(errorHandle);
    }
}
