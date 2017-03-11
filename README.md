vue-ueditor
===========

[【在线演示】](http://tth.lixingdecai.com)

`文档不全，正在努力跟进，有问题直接提issues 给我`

> A Vue.js project

Build Setup
-----------

```bash
# install dependencies 加载引用
npm install
# serve with hot reload at localhost:8080 开发
npm run dev
# build for production with minification 打包
npm run build
# run e2e tests
npm run e2e
# run all tests 测试
npm test
```

UEditor 二次开发
----------------

百度的[UEditor](http://fex.baidu.com/ueditor/)是国内富文本编辑器里功能最强大之一，但是其存在几个问题，界面样式老(hen)旧(chou)，原代码在eslint规则检测时会报错，还有里面弹出框使用组件和iframe代码耦合在一起，操作起来很恶心，不符合现在的mvvm的架构模式。 此工程将UEditor 基于 VUE 进行二次开发，使之满足美工的要求，和可以跟任意组件结合使用。 第

```
-- static
    -- UEditor                                  使用的UEditor 1.4.3版本
        -- dialogs                              原UEditor弹出框
        -- lang                                 语言
        -- themes                               富文本内置样式
        -- third-party                          第三方插件
        -- index.html                           使用例子
        -- ueditor.config.js                    * 配置文件, 你需要好好看看这个配置文件，大部分功能都能在这里面进行配置修改
        -- ueditor.parse.js                     解析文件
```

![](/screenshot/火狐截图_2017-03-11T09-05-12.905Z.png)

### UEditor 功能

因为项目需求，前期只实现了标题、加粗、有序、无序、上传视频、上传图片、撤销、重做这几个功能。但是如果你还想增加其他功能，很简单，只要添加一个图片，给图标添加一个方法，调用相对应的[UEditor 命令](http://ueditor.baidu.com/doc/#COMMAND.LIST)就好了

```
对应按钮的事件：
// 加粗
ueBold: function () {
  console.log('bold');
  this.editor.execCommand('bold');
},
// 斜体
ueItalic: function () {
  this.editor.execCommand('italic');
},
```

使用UEditor的地方

```
-- src
    -- pages
      -- home
        -- Publish.vue      对应页面上的发表页面
```

富文本内样式设置 : /static/UEditor/themes/iframe.css

因为是SPA工程，工程的静态资源都上传七牛，所以分别在 ueditor.all.js 中将内置的iframe.css的七牛地址

```
//维护编辑器一下默认的不在插件中的配置项
UE.Editor.defaultOptions = function(editor){

    var _url = editor.options.UEDITOR_HOME_URL;     // 在ueditor.config.js中配置UEDITOR_HOME_URL路径
    console.log('---------------------', _url);
    return {
        isShow: true,
        initialContent: '',
        initialStyle:'',
        autoClearinitialContent: false,
        iframeCssUrl: _url + 'themes/iframe.css?' + Date.parse(new Date()), //指向七牛地址
        ...
    }
};
```

项目目录说明
------------

```
.
|-- build                            // webpack打包编译目录
|   |-- build.js                     // 项目打包入口文件
|   |-- check-versions.js            // 检查node和npm版本是否符合
|   |-- dev-client.js                // 页面自动刷新
|   |-- dev-server.js                // 启动热加载代理服务器
|   |-- utils.js                     // css和style的loader定义
|   |-- webpack.base.conf.js         // 公共打包文件
|   |-- webpack.dev.conf.js          // 本地开发打包文件
|   |-- webpack.prod.conf.js         // 线上环境打包文件
|-- config                           // 项目开发环境配置目录
|   |-- index.js                     // 定义各种环境变量
|-- src                              // 源码目录
|   |-- assets                       // 公共资源目录
|       |-- fonts                    // 公共字体图标
|       |-- images                   // 公共图片文件
|       |-- stylesheets              // 公共样式文件
|   |-- components                   // 公共组件目录
|       |-- header.vue               // 页面头部公共组件
|       |-- loading.vue              // 加载动画组件
|       |-- totop.vue                // 返回顶部组件
|   |-- filters                      // 自定义过滤器目录
|       |-- index.js                 // 过滤器函数文件
|   |-- pages                        // 页面组件目录
|       |-- home.vue                 // 个人中心
|       |-- index.vue                // 网站首页
|       |-- login.vue                // 登录
|       |-- signout.vue              // 退出
|   |-- router                       // 路由配置目录
|       |-- index.js                 // 加载各个router模块
|   |-- service                      // ajax异步请求接口目录
|       |-- index.js                 // 加载各个ajax异步请求
|   |-- store                        // vuex的状态管理目录
|       |-- index.js                 // 加载各种store模块
|   |-- util                         // 工具目录
|       |-- tools.js                 // 公共工具函数库
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|   |-- App.vue                      // 个人主页页面
|-- static                           // 第三方插件
|-- theme                            // vue的自定义主题样式
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 编辑器配置
|-- .eslintignore                    // eslint忽略配置
|-- .eslintrc.js                     // eslint规则配置
|-- .gitattributes                   // git文件类型配置
|-- .gitignore                       // git忽略配置
|-- gitlab-ci.yml                    // gitlab运行脚本配置
|-- favicon.ico                      // 网站ico
|-- index.html                       // 个人中心模板
|-- package.json                     // 项目配置文件
|-- README.md                        // 项目说明文件
|-- yarn.lock                        // yarn安装依赖包的版本信息锁定文件
.
```

插件选用
--------

**选用原则**

-	尽量 ***No jQuery***
-	兼容性，支持 ***IE9+***
-	Vue生态圈awsome里面的
-	支持 ***Vue2.0***，不是 ***1.0***

**插件列表**

1.	拖拽插件 -- Vue.Draggable

	-	Github: [https://github.com/SortableJS/Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)
	-	Reference: [https://github.com/RubaXa/Sortable](https://github.com/RubaXa/Sortable)
	-	Demo: [https://jsfiddle.net/dede89/m2v0orcn/](https://jsfiddle.net/dede89/m2v0orcn/)

2.	富文本编辑器 [百度UEditor](http://ueditor.baidu.com)

3.	图片上传、视频上传 [阿里云OSS plupload](https://help.aliyun.com/document_detail/31925.html?spm=5176.doc31926.6.623.WybAtr)

4.	图片截取 [Jcrop](http://jcrop.org/) 基于jquery

5.	统计图表 -- 基于百度的 ECharts -- vue-echarts

	-	Github: [https://github.com/Justineo/vue-echarts](https://github.com/Justineo/vue-echarts)
	-	Reference: [http://echarts.baidu.com/](http://echarts.baidu.com/)

参考文档
--------

---

-	Yarn官方网站：[https://yarnpkg.com/](https://yarnpkg.com/)

-	Element UI中文：[http://element.eleme.io/](http://element.eleme.io/)

-	Vue2.0中文文档：[https://cn.vuejs.org/v2/guide/](https://cn.vuejs.org/v2/guide/)

-	Vue-Router中文文档：[https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/)

-	Vuex中文文档：[https://vuex.vuejs.org/zh-cn/](https://vuex.vuejs.org/zh-cn/)

-	Vue-Cli中文文档：[http://vuejs-templates.github.io/webpack/](http://vuejs-templates.github.io/webpack/)

-	Vue2.0修改信息：[https://github.com/vuejs/vue/issues/2873](https://github.com/vuejs/vue/issues/2873)

-	Awesome Vue.js：[https://github.com/vuejs/awesome-vue](https://github.com/vuejs/awesome-vue)
