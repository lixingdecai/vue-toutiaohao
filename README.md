# vue-ueditor

[在线演示](http://tth.lixingdecai.com)
`文档不全，正在努力跟进，有问题直接提issues 给我`

> A Vue.js project

## Build Setup

``` bash
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

## UEditor 二次开发

百度的[UEditor](http://fex.baidu.com/ueditor/)是国内富文本编辑器里功能最强大之一，但是其存在几个问题，界面样式老(hen)旧(chou)，原代码在eslint规则检测时会报错，还有里面弹出框使用组件和iframe代码耦合在一起，操作起来很恶心，不符合现在的mvvm的架构模式。
此工程将UEditor 基于 VUE 进行二次开发，使之满足美工的要求，和可以跟任意组件结合使用。
第
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

使用UEditor的地方
```
-- src
    -- page
        -- Publish.vue      对应页面上的发表页面
```