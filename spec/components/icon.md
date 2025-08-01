# Icon 组件功能规格

> **组件类型：** 基础原子组件  
> **优先级：** 最高 🔥  
> **依赖组件：** 无  
> **被依赖组件：** Button, Input, Select, Toast, Modal 等

## 📋 功能需求概述

Icon组件是整个组件库的基础设施，提供统一的图标显示解决方案。支持SVG图标、字体图标和自定义图标，是其他组件的重要依赖。

## 🎯 核心功能

### 基础功能
- [ ] **多种图标类型** - 支持SVG、字体图标、自定义图标
- [ ] **尺寸控制** - 预设尺寸(xs, sm, md, lg, xl)和自定义尺寸
- [ ] **颜色主题** - 继承父级颜色或指定主题颜色
- [ ] **旋转动画** - 支持loading等场景的旋转效果

### 高级功能
- [ ] **图标库集成** - 预置常用图标集
- [ ] **自定义SVG** - 支持直接传入SVG内容
- [ ] **可访问性** - 支持screen reader和语义化
- [ ] **性能优化** - 图标缓存和按需加载

## 🎨 设计规范

### 尺寸规格
```
xs: 12px
sm: 14px  
md: 16px (默认)
lg: 20px
xl: 24px
```

### 颜色规范
- 默认继承父级颜色 `currentColor`
- 支持主题色：primary, secondary, success, warning, danger
- 支持自定义颜色值

## 🔧 API 设计

### 属性 (Attributes)
```typescript
interface IconOption {
  name?: string;           // 图标名称
  type?: 'svg' | 'font';  // 图标类型
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string; // 尺寸
  color?: string;          // 颜色
  spin?: boolean;          // 是否旋转
  rotate?: number;         // 旋转角度
}
```

### 使用示例
```html
<!-- 基础使用 -->
<ma-icon name="home"></ma-icon>

<!-- 指定尺寸和颜色 -->
<ma-icon name="user" size="lg" color="primary"></ma-icon>

<!-- 旋转动画 -->
<ma-icon name="loading" spin></ma-icon>

<!-- 自定义尺寸 -->
<ma-icon name="heart" size="32px"></ma-icon>

<!-- 字体图标 -->
<ma-icon type="font" name="fas fa-star"></ma-icon>
```

### 事件 (Events)
```typescript
// 基础组件通常不需要自定义事件
// 可能的点击事件由父组件处理
```

## 📦 内置图标集

### Phase 1 - 基础图标 (优先实现)
```
通用: home, user, settings, search, close, arrow-left, arrow-right
状态: check, times, info, warning, error, loading
操作: edit, delete, save, upload, download, refresh
```

### Phase 2 - 扩展图标
```
导航: menu, more, back, forward
文件: file, folder, image, document
社交: heart, star, share, like
```

## 🔄 状态管理

### 组件状态
- **静态** - 普通显示状态
- **动画** - 旋转或其他动画状态
- **禁用** - 继承父组件的禁用状态

## 🎭 主题支持

### CSS 变量
```css
--ma-icon-color: currentColor;
--ma-icon-size: 16px;
--ma-icon-font-family: 'IconFont';
```

### 暗色模式
- 自动适配父级颜色
- 支持主题色的暗色变体

## ♿ 可访问性

- [ ] 支持 `aria-label` 属性
- [ ] 支持 `aria-hidden` 隐藏装饰性图标
- [ ] 键盘导航支持（如果可交互）
- [ ] 高对比度模式支持

## 🚀 性能考虑

### 优化策略
- [ ] SVG图标内联避免额外请求
- [ ] 图标精灵图合并小图标
- [ ] 按需加载减少初始包体积
- [ ] 缓存机制避免重复解析

### 目标指标
- 组件渲染时间 < 1ms
- 图标库bundle增量 < 50KB
- 支持tree-shaking

## 🧪 测试策略

### 单元测试
- [ ] 不同type的图标渲染
- [ ] 尺寸和颜色属性应用
- [ ] 旋转动画功能
- [ ] 可访问性属性

### 视觉回归测试
- [ ] 各尺寸图标显示效果
- [ ] 主题色应用效果
- [ ] 动画效果

## 📋 实现检查清单

### 基础实现
- [ ] ComponentBase集成
- [ ] HTML模板设计
- [ ] SCSS样式实现
- [ ] TypeScript类型定义

### 功能实现  
- [ ] 多图标类型支持
- [ ] 尺寸控制系统
- [ ] 颜色主题应用
- [ ] 旋转动画效果

### 质量保证
- [ ] 单元测试覆盖
- [ ] 可访问性验证
- [ ] 浏览器兼容性测试
- [ ] 性能基准测试

## 🔗 相关组件

### 直接依赖
- ComponentBase (基类)

### 被依赖组件
- Button (按钮图标)
- Input (清除图标)
- Select (下拉箭头)
- Toast (状态图标)
- Modal (关闭图标)

## 📚 参考资料

- [Material Design Icons](https://material.io/design/iconography)
- [Heroicons](https://heroicons.com/)
- [Font Awesome](https://fontawesome.com/)
- [SVG图标最佳实践](https://css-tricks.com/svg-symbol-good-choice-icons/)