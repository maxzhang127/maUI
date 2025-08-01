# 🎨 maUI

> 基于原生 Web Components 的现代化轻量级组件库

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Web Components](https://img.shields.io/badge/Web_Components-29ABE2?style=flat-square&logo=webcomponents.org&logoColor=white)](https://webcomponents.org/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=webpack&logoColor=black)](https://webpack.js.org/)

## ✨ 特色

- 🚀 **原生 Web Components** - 无框架依赖，标准化技术栈
- 💡 **TypeScript 支持** - 完整类型定义，开发体验优秀  
- 🎯 **轻量化设计** - 极小体积，按需加载
- 🎨 **SCSS 样式系统** - 主题化定制，响应式布局
- 🔧 **Shadow DOM 封装** - 样式隔离，避免全局污染
- 📦 **统一组件架构** - 基于 ComponentBase 的标准化开发模式

## 🏗️ 组件列表

- **ma-button** - 按钮组件，支持多种颜色主题和尺寸
- **ma-input** - 输入框组件  
- **ma-select** - 选择器组件，支持下拉选项
- **ma-container** - 容器组件，支持网格布局
- **ma-row** / **ma-col** - 行列布局组件
- **ma-block** - 块级容器组件

## 🚀 快速开始

### 安装依赖

```shell
npm install
```

### 开发调试

```shell
npm run dev
```

启动开发服务器，支持热重载，访问本地地址查看组件演示。

### 生产构建

```shell
npm run build
```

构建优化后的生产版本到 `docs/` 目录。

## 📖 使用示例

```html
<!-- 按钮组件 -->
<ma-button color="primary" size="medium">点击我</ma-button>

<!-- 网格布局 -->
<ma-container type="grid">
  <ma-row>
    <ma-col>列1</ma-col>
    <ma-col>列2</ma-col>
    <ma-col>列3</ma-col>
  </ma-row>
</ma-container>

<!-- 表单输入 -->
<ma-input placeholder="请输入内容"></ma-input>
<ma-select>
  <ma-select-item value="1">选项1</ma-select-item>
  <ma-select-item value="2">选项2</ma-select-item>
</ma-select>
```

## 🏛️ 架构设计

maUI 采用统一的组件架构模式：

- **ComponentBase** - 所有组件的基类，提供 Shadow DOM 管理和属性初始化
- **模板系统** - 基于 HTML 模板和 SCSS 样式的组件构建方式  
- **类型安全** - 完整的 TypeScript 类型定义和选项接口
- **事件系统** - 标准化的自定义事件派发机制

## 🛠️ 开发

项目使用 Webpack + TypeScript + SCSS 构建，支持：

- 🔥 热重载开发
- 📦 代码分割和优化
- 🎨 SCSS 编译和 CSS 提取
- 📝 HTML 模板处理
- 🗺️ Source Map 支持

## 📄 许可证

MIT License
