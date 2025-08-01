# Card 组件功能规格

> **组件类型：** 布局容器组件  
> **优先级：** 高 🔥  
> **依赖组件：** 无  
> **被依赖组件：** CardGroup, List, Grid等布局组件

## 📋 功能需求概述

Card是现代UI中使用频率极高的容器组件，用于组织和展示相关信息。需要支持灵活的内容布局、丰富的视觉样式，以及良好的交互体验。

## 🎯 核心功能

### 基础功能
- [ ] **内容区域** - header、body、footer区域划分
- [ ] **阴影效果** - 多层级阴影样式
- [ ] **边框圆角** - 可配置的圆角大小
- [ ] **间距控制** - 内边距和外边距管理

### 高级功能
- [ ] **交互状态** - hover、active、focus状态
- [ ] **可点击** - 整体点击区域支持
- [ ] **图片支持** - 封面图片和图片适配
- [ ] **加载状态** - skeleton loading效果

### 样式变体
- [ ] **尺寸变体** - small、medium、large
- [ ] **阴影层级** - none、light、medium、heavy
- [ ] **边框样式** - solid、dashed、none
- [ ] **主题变体** - 默认、primary、success等

## 🎨 设计规范

### 尺寸规格
```
small:  padding 12px, border-radius 4px
medium: padding 16px, border-radius 6px [默认]
large:  padding 20px, border-radius 8px
```

### 阴影层级
```
none:   box-shadow: none
light:  box-shadow: 0 1px 3px rgba(0,0,0,0.1)
medium: box-shadow: 0 4px 12px rgba(0,0,0,0.15) [默认]
heavy:  box-shadow: 0 8px 24px rgba(0,0,0,0.2)
```

### 视觉层次
- **背景色** - 纯白/卡片背景色
- **边框** - 可选1px边框
- **分割线** - header/body/footer间分割
- **内容间距** - 统一的内容间距系统

## 🔧 API 设计

### 属性 (Attributes)
```typescript
interface CardOption {
  size?: 'small' | 'medium' | 'large';           // 尺寸
  shadow?: 'none' | 'light' | 'medium' | 'heavy'; // 阴影
  bordered?: boolean;                             // 边框
  hoverable?: boolean;                           // 可hover
  clickable?: boolean;                           // 可点击
  loading?: boolean;                             // 加载状态
  bodyStyle?: string;                            // body样式
}
```

### 使用示例
```html
<!-- 基础卡片 -->
<ma-card>
  <div slot="header">卡片标题</div>
  <div>卡片内容</div>
</ma-card>

<!-- 完整结构 -->
<ma-card size="large" shadow="heavy" hoverable>
  <div slot="header">
    <h3>用户信息</h3>
    <ma-button size="small">编辑</ma-button>
  </div>
  
  <div slot="cover">
    <img src="avatar.jpg" alt="用户头像">
  </div>
  
  <div>
    <p>这里是卡片的主要内容区域</p>
    <p>可以包含任何HTML内容</p>
  </div>
  
  <div slot="footer">
    <ma-button type="primary">确认</ma-button>
    <ma-button>取消</ma-button>
  </div>
</ma-card>

<!-- 可点击卡片 -->
<ma-card clickable onclick="handleCardClick()">
  <h4>点击整张卡片</h4>
  <p>鼠标悬停时会有视觉反馈</p>
</ma-card>

<!-- 加载状态 -->
<ma-card loading>
  <div>加载中的内容会被skeleton替代</div>
</ma-card>
```

### 事件 (Events)
```typescript
// 点击事件
card.addEventListener('click', (e: Event) => {
  console.log('卡片被点击');
});

// hover事件
card.addEventListener('mouseenter', () => {});
card.addEventListener('mouseleave', () => {});
```

## 🏗️ 内容插槽设计

### Slot规划
```html
<template id="ma-card">
  <!-- 封面图片区域 -->
  <div class="ma-card-cover" part="cover">
    <slot name="cover"></slot>
  </div>
  
  <!-- 头部区域 -->
  <div class="ma-card-header" part="header">
    <slot name="header"></slot>
  </div>
  
  <!-- 主内容区域 -->
  <div class="ma-card-body" part="body">
    <slot></slot>
  </div>
  
  <!-- 底部区域 -->
  <div class="ma-card-footer" part="footer">
    <slot name="footer"></slot>
  </div>
  
  <!-- 加载状态 -->
  <div class="ma-card-loading" part="loading">
    <ma-skeleton></ma-skeleton>
  </div>
</template>
```

### 区域说明
- **cover** - 封面图片，无padding，全宽显示
- **header** - 标题区域，通常包含标题和操作按钮
- **body** - 主内容区域，默认slot
- **footer** - 底部操作区域，通常包含按钮组

## 🔄 状态管理

### 视觉状态
- **默认** - 基础卡片样式
- **hover** - 鼠标悬停效果（如果hoverable）
- **active** - 点击激活状态（如果clickable）
- **loading** - 加载状态，显示skeleton

### 交互逻辑
```javascript
class MaCard extends ComponentBase {
  handleMouseEnter() {
    if (this.option.hoverable) {
      this.classList.add('ma-card--hover');
    }
  }
  
  handleClick(e) {
    if (this.option.clickable) {
      this._dispatchEvent('click', { target: this });
    }
  }
}
```

## 🎭 主题支持

### CSS 变量
```css
--ma-card-bg: #ffffff;
--ma-card-border-color: #f0f0f0;
--ma-card-border-radius: 6px;
--ma-card-padding: 16px;
--ma-card-header-border-color: #f0f0f0;
--ma-card-shadow: 0 4px 12px rgba(0,0,0,0.15);
```

### 主题变体
```css
/* 主题色卡片 */
.ma-card--primary {
  border-left: 4px solid var(--ma-color-primary);
}

/* 暗色主题 */
.ma-card--dark {
  background: #1f1f1f;
  color: #ffffff;
  border-color: #434343;
}
```

## ♿ 可访问性

### 语义化结构
- [ ] 使用`article`或`section`语义
- [ ] 标题层级正确嵌套
- [ ] 可点击卡片添加`role="button"`

### 键盘支持
- [ ] 可点击卡片支持Tab焦点
- [ ] Enter/Space键触发点击
- [ ] 焦点指示器清晰可见

### 屏幕阅读器
- [ ] 卡片内容结构化播报
- [ ] 可点击状态正确提示
- [ ] 加载状态播报

## ⚡ 性能优化

### 渲染优化
- [ ] 使用CSS transform进行hover动画
- [ ] 避免不必要的重绘和重排
- [ ] 图片懒加载支持

### 内存管理
- [ ] 事件监听器正确清理
- [ ] 大量卡片场景的虚拟化
- [ ] 图片资源释放

## 🧪 测试策略

### 单元测试
- [ ] 各种尺寸和样式属性
- [ ] 插槽内容正确渲染
- [ ] 交互状态切换
- [ ] 事件触发验证

### 视觉回归测试
- [ ] 不同尺寸卡片显示
- [ ] 阴影效果渲染
- [ ] hover状态变化
- [ ] 加载状态显示

### 性能测试
- [ ] 大量卡片渲染性能
- [ ] 交互响应时间
- [ ] 内存使用情况

## 📋 实现检查清单

### 基础实现
- [ ] ComponentBase集成
- [ ] HTML模板和插槽设计
- [ ] SCSS样式系统
- [ ] TypeScript类型定义

### 核心功能
- [ ] 多区域布局支持
- [ ] 尺寸和阴影变体
- [ ] 交互状态管理
- [ ] 事件处理机制

### 高级功能
- [ ] 加载状态和skeleton
- [ ] 主题样式支持
- [ ] 动画过渡效果
- [ ] 性能优化

### 质量保证
- [ ] 可访问性完整支持
- [ ] 跨浏览器兼容
- [ ] 单元测试覆盖
- [ ] 性能基准验证

## 🔗 相关组件

### 依赖组件
- ComponentBase (基类)
- Skeleton (加载状态，可选)

### 组合使用
- Button (卡片内操作)
- Image (封面图片)
- Typography (文本内容)

### 扩展组件
- CardGroup (卡片组)
- CardList (卡片列表)
- ProductCard (商品卡片)

## 💡 设计模式

### 1. 复合组件模式
```html
<!-- 预设模式的复合卡片 -->
<ma-user-card avatar="..." name="张三" role="开发者">
  <ma-card>
    <div slot="cover">
      <ma-avatar src="..."></ma-avatar>
    </div>
    <div>
      <h4>张三</h4>
      <p>前端开发者</p>
    </div>
  </ma-card>
</ma-user-card>
```

### 2. 配置化模式
```javascript
// 通过配置快速生成不同类型的卡片
const cardConfigs = {
  product: { cover: true, footer: true, hoverable: true },
  profile: { shadow: 'light', size: 'small' },
  dashboard: { bordered: true, clickable: true }
};
```

## 📚 参考实现

- [Material Design Cards](https://material.io/components/cards)
- [Ant Design Card](https://ant.design/components/card/)
- [Element Plus Card](https://element-plus.org/en-US/component/card.html)
- [Bootstrap Cards](https://getbootstrap.com/docs/5.0/components/card/)