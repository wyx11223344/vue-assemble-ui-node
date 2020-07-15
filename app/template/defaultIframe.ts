/**
 * @author WYX
 * @date 2020/5/12
 * @Description: 基础返回页面类
*/
const startHTML = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '    <head>\n' +
    '        <meta charset="utf-8" />\n' +
    '        <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
    '        <meta name="referrer" content="no-referrer" />\n' +
    '        <meta name="viewport" content="width=device-width,initial-scale=1.0" />\n' +
    '        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>\n' +
    '        <script src="https://unpkg.com/vue-countupjs"></script>\n' +
    '        <title>基础模板</title>\n' +
    '    </head>\n' +
    '    <body>\n' +
    '        <noscript>\n' +
    '            <strong>We\'re sorry but <%= htmlWebpackPlugin.options.title %> doesn\'t work properly without JavaScript enabled. Please enable it to continue.</strong>\n' +
    '        </noscript>\n' +
    '    <script>\n' +
    '        Vue.use(VueCountUp)\n' +
    '        window.addEventListener("keydown", function(e) { if (e.keyCode === 83 && e.ctrlKey) { window.parent._outObj_.buttonClick(); e.preventDefault(); } }) \n' +
    '    </script>\n';

const endHTML = '    </body>\n' +
    '</html>\n' +
    '<style>body{display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; position: absolute; margin: 0; padding: 0}</style>';

export default class TemplateHTML {
    static startHTML: string = startHTML
    static endHTML: string = endHTML
}
