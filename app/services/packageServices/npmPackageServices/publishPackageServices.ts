/**
 * @author WYX
 * @date 2020/7/9
 * @Description: npm包发布接口
*/
import * as downloadGit from 'download-git-repo';
import Codes from '../../../models/codes';
import * as fs from 'fs';
import {PublishPackageServicesImp} from './publishPackageServicesImp';
import MyRedis from '../../../cache';
import {exec} from 'child_process';
import Components from '../../../models/components';
import ThreePacksServices from '../../threePacksServices/threePacksServices';
import ThreePacks from '../../../models/threePacks';

interface NpmRedisObj {
    componentsObj: { [p: string]: Codes[] };
    path: string;
    version: string;
    name: string;
    threePacks: string;
}

export default class PublishPackageServices implements PublishPackageServicesImp{
    private static runningObj: Array<NpmRedisObj> = [];
    private static ThreePacksServices: ThreePacksServices = new ThreePacksServices()

    /**
     * 通过npm id删除npm网络上的npm包
     * @param {String} npmName npm包名字
     * @return {Promise<boolean>}
     */
    async removePackage(npmName: string): Promise<boolean> {
        return await new Promise((resolve) => {
            exec(`npm unpublish @wyx962717593/${npmName} --force`, (error, stdout, stderr) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * 添加一个新的redis npm包管理缓存
     * @param {String} path 路径
     * @param {Object} componentsObj 构成npm包对象
     * @returns {Promise<boolean>}
     */
    addNewPackage(name: string, componentsObj: { [p: string]: Codes[] }, version: string, components: Components[]): Promise<boolean> {
        return new Promise(async (resolve) => {
            try {
                // 获取基础路径
                const path = `project/${name}`;
                // 添加redis缓存
                await MyRedis.rpush('npmPublishControl', JSON.stringify({
                    componentsObj,
                    path,
                    version,
                    name,
                    threePacks: Array.from(components.reduce((all, item) => {
                        if (item.threePacks) {
                            item.threePacks.split(',').forEach((item) => {
                                all.add(item);
                            });
                        }
                        return all;
                    }, new Set())).join(',')
                }));
                PublishPackageServices.npmRunFn();
                resolve(true);
            } catch (e) {
                console.log(e);
                resolve(false);
            }
        });
    }

    /**
     * 判断文件夹是否存在
     * @param {String} path
     * @returns {Promise<boolean>} 返回判断结果
     */
    private static checkPathExist(path: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (fs.existsSync(path)) {
                exec(`rm -rf ${path}`, () => {
                    resolve(true);
                });
            } else {
                resolve(true);
            }
        });
    }

    /**
     * 下载项目模板
     * @param {String} git git下载地址
     * @param {String} path 下载路径
     * @returns {Promise<boolean>}
     */
    private static downLoadGitTemplate(git: string, path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            downloadGit(git, path, { clone: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * 创建新npm项目
     * @param {String} path 路径
     * @param {String} name 包名称
     * @param {Codes[]} Codes 代码数组
     * @returns {Promise<boolean>}
     */
    private static createNewPackage(path: string, name: string, Codes: Codes[]): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                fs.mkdirSync(path + '/packages/' + name);
                fs.mkdirSync(path + '/packages/' + name + '/src');

                Codes.forEach((eachVue: Codes) => {
                    fs.writeFileSync(path + '/packages/' + name + '/src/' + eachVue.name + '.vue', eachVue.html);
                });

                // 生成index.js代码;
                fs.writeFileSync(path + '/packages/' + name + '/index.js', PublishPackageServices.createPackageIndexJs(name, Codes));
                resolve(true);
            } catch (e) {
                resolve(false);
            }
        });
    }

    /**
     * 创建每个组件的index.js入口文件
     * @param {String} name 组件名称
     * @param {Codes[]} Codes 组件代码
     * @returns {string} 返回生成string
     */
    private static createPackageIndexJs(name: string, Codes: Codes[]): string {
        let backString = '';
        let importString = '';
        let installString = '';
        Codes.filter((item) => item.name !== 'index').forEach((Code: Codes) => {
            importString += `import ${Code.name} from \'./src/${Code.name}\';\n` ;
            installString += `    Vue.component(${Code.name}.name ? ${Code.name}.name : \'${Code.name}\', ${Code.name});\n`;
        });
        backString = importString + `\n${name}.install = function(Vue) {\n${installString}}\n\nexport default ${name};`;
        return backString;
    }

    /**
     * 创建npm包主入口index.js文件
     * @param {Object} componentsObj npm包构成对象
     * @returns {string} 生成index.js string
     */
    private static createMainIndexJs(componentsObj: {[a: string]: Codes[]}, ThreePacks: ThreePacks[]): string{
        let backString = '';
        let importString = '';
        let installStringList = '';
        let threePackIm = '';
        let threePackUse = '';
        ThreePacks.forEach((item: ThreePacks) => {
            threePackIm += `${item.imCode}\n`;
            threePackUse += `${item.useCode}\n`;
        });
        Object.keys(componentsObj).forEach((key) => {
            importString += `import ${key} from \'../packages/${key}/index\';\n` ;
            installStringList += `${key},\n`;
        });
        backString = importString + '\n' + threePackIm +
`\nconst Components = [\n${installStringList}];

const install = function(Vue) {
    ${threePackUse}
    Components.forEach((compone) => {
        Vue.use(compone);
    });
};

export default {
    install,
    ${installStringList}
};`;
        return backString;
    }

    /**
     * 通过对象创建一个npm项目
     * @param {String} path 路径
     * @param {Object} componentsObj 构成npm项目对象
     * @returns {Promise<boolean>}
     */
    private static createPackageByObject(path: string, componentsObj: {[a: string]: Codes[]}, ThreePacks: ThreePacks[]): Promise<boolean> {
        return new Promise((resolve) => {
            let checkCodePromise = 0;
            // 更新index.js
            fs.writeFileSync(path + '/src/index.js', PublishPackageServices.createMainIndexJs(componentsObj, ThreePacks));
            Object.keys(componentsObj).forEach((key: string) => {
                const item: Codes[] = componentsObj[key];
                this.createNewPackage(path, key, item).then((results: boolean) => {
                    if (results) {
                        checkCodePromise++;
                        if (checkCodePromise >= Object.keys(componentsObj).length) {
                            resolve(true);
                        }
                    } else {
                        resolve(false);
                    }
                });
            });
        });
    }

    /**
     * 跟新package.json文件
     * @param {String} path 路径
     * @param {Object} obj 跟新对象
     * @returns {Promise<boolean>}
     */
    private static packageJsonUpdate(path: string, obj: any, ThreePacks: ThreePacks[]): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (fs.existsSync(path)) {
                const data = fs.readFileSync(path + '/package.json').toString();
                let json = JSON.parse(data);
                Object.keys(obj).forEach((key) => {
                    json[key] = obj[key];
                });
                ThreePacks.forEach((item: ThreePacks) => {
                    json.dependencies[item.name] = item.version ? `${item.version}` : 'latest';
                });
                fs.writeFileSync(path + '/package.json', JSON.stringify(json, null, '\t'), 'utf-8');
                resolve();
            }
        });
    }

    /**
     * npm包更新新增运行器
     * @returns {Promise<void>}
     */
    private static async npmRunFn(): Promise<void> {
        if (this.runningObj.length >= 2) {return ;}

        const redisLength: number = await MyRedis.llen('npmPublishControl');

        if (redisLength <= 0) {return ;}

        const dealObject: NpmRedisObj = JSON.parse(await MyRedis.lpop('npmPublishControl'));

        try {

            if (this.runningObj.find((item: NpmRedisObj) => item.path === dealObject.path)) {
                await this.npmRunFn();
                await MyRedis.lpush('npmPublishControl', JSON.stringify(dealObject));
                return ;
            }

            this.runningObj.push(dealObject);

            const ThreePacks: ThreePacks[] = await PublishPackageServices.ThreePacksServices.getThreePacksByIds(dealObject.threePacks);

            // 创建基础项目
            await this.checkPathExist(dealObject.path);
            await this.downLoadGitTemplate('direct:https://gitee.com/beon/vue-assemble-ui-package', dealObject.path);

            // 执行构建项目,更新入口index
            await this.createPackageByObject(dealObject.path, dealObject.componentsObj, ThreePacks);

            // 更新package.json文件(未完成)
            const obj = {
                name: `@wyx962717593/${dealObject.name}`,
                version: dealObject.version
            };
            await this.packageJsonUpdate(dealObject.path, obj, ThreePacks);

            // 开始发布
            await new Promise((resolve) => {
                const login = exec('npm adduser', (err) => {
                    console.log(err);
                    exec('npm publish --access public', { cwd: dealObject.path }, (error, stdout, stderr) => {
                        exec(`rm -rf ${dealObject.path}`, () => {
                            this.runningObj.splice(this.runningObj.findIndex((item) => item.path === dealObject.path), 1);
                            console.log(error, stdout, stderr);
                            this.npmRunFn();
                            resolve();
                        });
                    });
                });

                const username = 'wyx962717593';
                const password = '123321sxy?!';
                const email = '962717593@qq.com';
                const inputArray = [
                    username + '\n',
                    password + '\n',
                    email + '\n',
                ];

                login.stdout.on('data', (data) => {
                    console.log(data);
                    var cmd = inputArray.shift();
                    if (cmd) {
                        login.stdin.write(cmd);
                    } else {
                        login.stdin.end();
                    }
                });
            });
        } catch (e) {
            console.log(e);
            this.runningObj.splice(this.runningObj.findIndex((item) => item.path === dealObject.path), 1);
        }
    }

}
