# 星空主题重构说明

## 项目结构

```
docs/.vitepress/theme/
├── Layout.vue                 # 主布局文件（支持主题切换）
├── index.ts                   # 主题入口文件
├── custom.css                 # 全局样式文件
├── README.md                  # 本文档
├── components/                # 组件目录
│   ├── StarryBackground.vue   # 星空背景组件（暗色主题）
│   └── CloudBackground.vue    # 蓝天白云背景组件（亮色主题）
├── utils/                     # 工具目录
│   ├── starField.js          # 星空动画逻辑
│   └── cloudField.js         # 蓝天白云动画逻辑
└── styles/                    # 样式目录
    ├── theme.css             # 暗色主题样式文件
    └── light-theme.css       # 亮色主题样式文件
```

## 主题特性

### 🌙 暗色主题（星空主题）
- **背景**: 深蓝色渐变星空背景
- **动画**: 闪烁星星 + 流星效果
- **颜色**: 蓝色系主题色
- **触发**: 点击月亮图标切换

### ☀️ 亮色主题（蓝天白云主题）
- **背景**: 蓝天渐变背景
- **动画**: 飘动云朵 + 流云效果
- **颜色**: 深蓝色系主题色
- **触发**: 点击太阳图标切换

## 文件说明

### Layout.vue
- **作用**: 主布局文件，负责整体页面结构和主题切换
- **特点**: 根据 `isDark` 状态动态显示不同背景
- **依赖**: `StarryBackground.vue`、`CloudBackground.vue` 组件

### components/StarryBackground.vue
- **作用**: 星空背景组件，负责渲染星空动画
- **特点**: 独立的 Vue 组件，包含 Canvas 动画逻辑
- **依赖**: `utils/starField.js` 模块

### components/CloudBackground.vue
- **作用**: 蓝天白云背景组件，负责渲染云朵动画
- **特点**: 独立的 Vue 组件，包含 Canvas 动画逻辑
- **依赖**: `utils/cloudField.js` 模块

### utils/starField.js
- **作用**: 星空动画的核心逻辑
- **包含**: 
  - `Star` 类：星星对象
  - `Meteor` 类：流星对象
  - `StarField` 类：星空管理器
- **特点**: 纯 JavaScript 模块，可复用

### utils/cloudField.js
- **作用**: 蓝天白云动画的核心逻辑
- **包含**: 
  - `Cloud` 类：云朵对象
  - `FlowingCloud` 类：流云对象
  - `CloudField` 类：云朵管理器
- **特点**: 纯 JavaScript 模块，可复用

### styles/theme.css
- **作用**: 暗色主题样式文件
- **特点**: 包含所有 VitePress 组件的暗色样式覆盖
- **颜色**: 蓝色系主题色

### styles/light-theme.css
- **作用**: 亮色主题样式文件
- **特点**: 包含所有 VitePress 组件的亮色样式覆盖
- **颜色**: 深蓝色系主题色

## 主题切换机制

1. **自动检测**: 使用 VitePress 的 `isDark` 响应式变量
2. **动态渲染**: 根据主题状态条件渲染对应背景组件
3. **样式切换**: 动态应用对应的 CSS 类名
4. **无缝切换**: 保持所有功能和布局不变

## 自定义配置

### 修改星空效果
编辑 `utils/starField.js` 中的参数：
- 星星数量：修改 `init()` 方法中的循环次数
- 星星颜色：修改 `getRandomColor()` 方法中的颜色数组
- 流星频率：修改 `meteorInterval` 参数

### 修改云朵效果
编辑 `utils/cloudField.js` 中的参数：
- 云朵数量：修改 `init()` 方法中的循环次数
- 云朵颜色：修改 `getRandomColor()` 方法中的颜色数组
- 流云频率：修改 `flowingCloudInterval` 参数

### 修改主题样式
- **暗色主题**: 编辑 `styles/theme.css`
- **亮色主题**: 编辑 `styles/light-theme.css`

## 性能优化

1. **条件渲染**: 只渲染当前主题需要的背景组件
2. **Canvas 优化**: 使用 `requestAnimationFrame` 进行动画
3. **内存管理**: 组件卸载时清理动画帧
4. **响应式设计**: 监听窗口大小变化自动调整

## 浏览器兼容性

- **Canvas API**: 现代浏览器支持
- **CSS 特性**: 支持 backdrop-filter、CSS 变量等
- **JavaScript**: ES6+ 语法，需要现代浏览器支持

## 维护说明

- **新增主题**: 创建新的背景组件和样式文件
- **修改动画**: 编辑对应的 JavaScript 模块
- **样式调整**: 修改对应的 CSS 文件
- **功能扩展**: 在 Layout.vue 中添加新的条件渲染 