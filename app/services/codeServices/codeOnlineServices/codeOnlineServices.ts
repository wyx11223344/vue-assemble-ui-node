/**
 * @author WYX
 * @date 2020/7/1
 * @Description: 在线编辑服务
*/
import {CodeOnlineServicesImp} from './codeOnlineServicesImp';
import * as less from 'less';
import {HtmlObj, OnCodeObj} from '../../../types/codes';
import {BaseErrorMsg} from '../../../types/baseBackMsg';
import ThreePacksServices from '../../threePacksServices/threePacksServices';
import ThreePacks from '../../../models/threePacks';
import TemplateHTML from '../../../template/defaultIframe';

interface LessRender {
    css: string;
    imports: [];
}

export default class CodeOnlineServices implements CodeOnlineServicesImp{
    private static ThreePacksServices: ThreePacksServices = new ThreePacksServices()

    /**
     * 处理vue代码在线显示
     * @param {String} a 代码片段
     * @returns {string} 返回处理完成的html片段或显示错误提示
     */
    async dealVueOnlineCode(a: string): Promise<string> {
        let backString = '';
        let aList: HtmlObj[] | undefined;
        let CodeObj: OnCodeObj | undefined;

        if (a) {
            try {
                CodeObj = JSON.parse(a);
                aList = CodeObj.codes;
            } catch (e) {
                return BaseErrorMsg.jsonError;
            }

            let baseObje = {
                el: ''
            };
            let cssStyle = '';
            let template = '';
            let listObj = [];

            for (let index = 0; index < aList.length; index++) {
                const item = aList[index];
                try {
                    let script: string = CodeOnlineServices.getSource(item.html, 'script').replace(/export default/, 'return');
                    script = script ? script : '{}';
                    if (index === 0) {
                        template = '<div id="app">' + CodeOnlineServices.getSource(item.html, 'template') + '</div>';
                        baseObje = new Function(script)();
                        baseObje.el = '#app';
                    } else {
                        listObj.push(new Function(script)());
                        listObj[listObj.length - 1].template = CodeOnlineServices.getSource(item.html, 'template');
                        listObj[listObj.length - 1].name = listObj[listObj.length - 1].name ? listObj[listObj.length - 1].name : item.name;
                    }

                } catch (e) {
                    return BaseErrorMsg.scriptError;
                }
                try {
                    const style: string = CodeOnlineServices.getSource(item.html, 'style');
                    const lessRender: LessRender = await less.render(style);
                    cssStyle += lessRender.css;
                } catch (e) {
                    return BaseErrorMsg.lessError;
                }
            }

            const backJs: string = CodeOnlineServices.createJs(baseObje, listObj);
            backString = `${template}\n${backJs}\n<style>\n${cssStyle}</style>\n`;

            backString = TemplateHTML.startHTML + backString + TemplateHTML.endHTML;

            if (CodeObj.threePacks && backString) {
                const threePacks: ThreePacks[] = await CodeOnlineServices.ThreePacksServices.getThreePacksByIds(CodeObj.threePacks);
                const threePackScript = threePacks.reduce((all: string, item: ThreePacks) => all + `<script src="${item.url}"></script>\n`, '');
                const threePackUse = threePacks.reduce((all: string, item: ThreePacks) => all + `${item.code}\n`, '');

                backString = backString.replace(/<!--threePacksScriptSet-->\n/, threePackScript).replace('//threePacksUseSet', threePackUse);
            }
        }

        return backString;
    }

    /**
     * 返回生成需要的js
     * @param {Object} script 传入export default内容
     * @param {Array} listObj 传入组件数组
     * @return {string} 返回生成js片段
     */
    private static createJs(script: object, listObj: any[]): string {
        let listString = '';
        listObj.forEach((item) => {
            listString += `const myComponentOption${item.name} = {};  ${CodeOnlineServices.serialize(item, `myComponentOption${item.name}`)} \n Vue.component('${item.name}', myComponentOption${item.name}); \n`;
        });
        return `<script>\n const myVueOption = {}; ${CodeOnlineServices.serialize(script, 'myVueOption')} \n ${listString} var app = new Vue(myVueOption);\n </script>`;
    }

    /**
     * 处理对象为一条条语句
     * @param {Object} obj 传入需要处理对象
     * @param {String} name 处理后生成对象名称
     * @returns {string} 返回处理后代码片段
     */
    private static serialize(obj: object, name: string): string{
        var result = '';
        function serializeInternal(o: object, path: string): void {
            for (let p in o) {
                var value = o[p];
                if (typeof value !== 'object') {
                    if (typeof value === 'string') {
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + '] = ' + '`' + value.replace(/\"/g, '\\"') + '`' + ';';
                    } else {
                        if ((path.indexOf('["props"]') !== -1)) {
                            if ((path.indexOf('["props"]') + 9) < path.length && p === 'type'){
                                value = value.name;
                            } else if ((path.indexOf('["props"]') + 9) === path.length) {
                                value = value.name;
                            } else {
                                if (value.toString().indexOf(p) !== -1) {
                                    value = value.toString().replace(p, 'function');
                                }
                            }
                        } else {
                            if (value.toString().indexOf(p) !== -1) {
                                value = value.toString().replace(p, 'function');
                            }
                        }
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + '] = ' + value + ';';
                    }
                } else {
                    if (value instanceof Array) {
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']' + '=' + 'new Array();';
                        serializeInternal(value, path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']');
                    } else {
                        result += '\n' + path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']' + '=' + 'new Object();';
                        serializeInternal(value, path + '[' + (isNaN(p as any) ? '"' + p + '"' : p) + ']');
                    }
                }
            }
        }
        serializeInternal(obj, name);
        return result;
    }

    /**
     * 返回截取页面字符串截取
     * @param {String} source 需要截取的资源
     * @param {String} type 截取标签类型
     * @returns {any} 返回截取结果
     */
    private static getSource(source: string, type: string): string {
        const regex = new RegExp(`<${type}[^>]*>`);
        let openingTag: [] | string = source.match(regex) as [];

        if (!openingTag) {return '';} else {openingTag = (openingTag as string[])[0];}

        return source.slice(source.indexOf(openingTag as string) + openingTag.length, source.lastIndexOf(`</${type}>`));
    }

}
