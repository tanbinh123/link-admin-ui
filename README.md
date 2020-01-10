
## 简介
vue-link-admin 提供一个权限认证解决方案，它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。它使用了最新的前端技术栈，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。相信不管你的需求是什么，本项目都能帮助到你。

本项目后端接口[springboot-link-admin](https://github.com/252956/springboot-link-admin) 


## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都使用[springboot-link-admin](https://github.com/252956/springboot-link-admin) 服务获取，提前了解和学习这些知识会对使用本项目有很大的帮助。

 <p align="center">
  <img width="900" src="https://252956.github.io/static/img/1.png">
</p>
 <p align="center">
  <img width="900" src="https://252956.github.io/static/img/2.png">
</p>
 <p align="center">
  <img width="900" src="https://252956.github.io/static/img/3.png">
</p>
 <p align="center">
  <img width="900" src="https://252956.github.io/static/img/4.png">
</p>
 <p align="center">
  <img width="900" src="https://252956.github.io/static/img/5.png">
</p>
 <p align="center">
  <img width="900" src="https://252956.github.io/static/img/6.png">
</p>


## 开发

备注：如果本地没有启动后端接口服务，可用下面免费公用接口获取数据，修改
.env.development 文件      VUE_APP_BASE_API_URL='http://47.103.154.36:8888'

```bash
# 克隆项目
git https://github.com/252956/vue-link-admin.git

# 进入项目目录
cd vue-link-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm start
```

浏览器访问 http://localhost:9527

## 发布


# 构建生产环境
npm run build

## 加入讨论组

 <p align="left">
  <img width="300" src="https://252956.github.io/static/img/dingding.jpg">
</p>

