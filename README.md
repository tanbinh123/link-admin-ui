
## 简介
Link Admin 是一套企业级后端系统框架，基于该系统可以快速实现企业级二次开发，提供登录认证，权限验证，访问次数限制等安全措施。以及用户管理、角色管理、权限管理、部门管理、岗位管理、数据字典、
业务日志监控等系统管理基础功能。


- Link Admin 前端               [link-admin-ui](https://github.com/252956/link-admin-ui) 
- Link Admin 后端,适用于小型项目 [springboot-link-admin](https://github.com/252956/springboot-link-admin) 
- Link Admin 后端,适用于大型项目 [link-admin](https://github.com/252956/link-admin) 


## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都使用[springboot-link-admin](https://github.com/252956/springboot-link-admin) 服务获取，提前了解和学习这些知识会对使用本项目有很大的帮助。

<p align="center">
  <img width="900" src="https://252956.github.io/static/img/1.png">
</p>

## 开发


```bash
# 克隆项目
git https://github.com/252956/link-admin-ui.git

# 进入项目目录
cd link-admin-ui

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

</p>

