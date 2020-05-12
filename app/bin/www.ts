/**
 * @author WYX
 * @date 2020/5/12
 * @Description: 服务启动类
*/
import {App, Server} from '../app';
import * as debug from 'debug';
import * as http from 'http';

class WwwFunction {
    port: number | string | boolean
    server: http.Server
    app: App

    /**
     * 构建函数
     */
    constructor() {
        this.app = (new Server()).app;
        const port: number | string | boolean = this.normalizePort(process.env.PORT || '9988');

        this.app.set('port', port);
        const server: http.Server = http.createServer(this.app);

        this.server = server;
        server.listen(port);
        server.on('error', this.onError.bind(this));
        server.on('listening', this.onListening.bind(this));

        console.log('服务开启成功:http://localhost:' + port);
    }

    /**
     * 处理端口号
     * @param {String} val 传入端口号
     * @returns {string | boolean | number} 返回端口信息
     */
    normalizePort(val: string): boolean | number | string {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            this.port = val;
            return val;
        }

        if (port >= 0) {
            // port number
            this.port = port;
            return port;
        }
        this.port = false;
        return false;
    }

    /**
     * 错误情况处理
     * @param {Object} error 错误信息
     * @returns {void}
     */
    onError(error): void {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * 服务监听
     * @returns {void}
     */
    onListening(): void {
        const addr = this.server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}

export default new WwwFunction();
