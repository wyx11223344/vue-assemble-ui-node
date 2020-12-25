# Vue组件组装平台
### vue-assemble-ui

## 这是做什么的

> 这是一个组件的在线分享构建平台，可以像使用iconfont一样去构建自己的ui组件库

## 怎么访问
> 现阶段提供在线平台http://36.111.183.168:9527/ ，当然也同时提供源码可以部署在个人、公司以及任何环境（有需求请联系本人，联系方式在最后）

## 具体操作
> 本人之前写过一篇文章介绍平台的大多数操作流程https://juejin.cn/post/6865842981618843656

## 构建成功后怎么使用
> 我们来拿onlinebutton这个包来示范

#### 添加项目依赖
```
npm install @wyx962717593/onlinebutton --save-dev
```

#### 添加项目依赖
```
// 在main.js中
import onlinebutton from '@wyx962717593/onlinebutton';
Vue.use(onlinebutton);
```

#### 使用
```
<jelly-button>jellyButton</jelly-button>  // 直接这样即可
```

## 项目架构
> 项目整体采用vue3编写，后端使用node（express） + mysql
>
> 如感兴趣具体实现方式和细节项目架构请找本人详细了解

## 集成方式
> 现阶段服务器采用了docker的swarm集群，总带宽为6M，集成了jenkins自动化部署

## 作者
> 本项目由 [Beon](https://juejin.cn/user/1662117312988695) 全程开发

## 贡献
> 可自主提交issue和进行mr请求

## 版本

#### v0.0.1-alpha.0
> 初步跑通整体关键流程，具体如下

已完成功能:
* npm包的发布
* 组件在线编辑、保存、生成、管理
* 整体展示页面和操作流程
* 代码模板的添加以及支持引入第三方库
* 发布至自己的npm库中（因为用户未作所以暂未开放）

未完成功能：
* 发布npm包历史记录
* 组件历史记录
* 用户以及权限管理
* 下载项目进行本地化管理
* 收录element、vant等常用ui组件库
* 代码模板和第三方库完善
* 上传文件添加组件
* 添加图片服务
* 关于npm和组件的使用说明文档逻辑
* 网站内部的组件实现互相注册调用

## 联系方式
> QQ: 962717593
>
> Wechat: Dawn_web
>
> 欢迎各位提供意见共同开发，同时也欢迎个人和公司进行部署
