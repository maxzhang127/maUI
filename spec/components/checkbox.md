# Checkbox 组件功能规格

> **组件类型：** 表单控件组件  
> **优先级：** 高 🔥  
> **依赖组件：** Icon (可选)  
> **被依赖组件：** Form, CheckboxGroup

## 📋 功能需求概述

Checkbox是表单中最基础的多选组件，支持单独使用或组合使用。需要提供良好的交互体验和可访问性支持，同时支持不确定状态(indeterminate)。

## 🎯 核心功能

### 基础功能
- [ ] **选中状态控制** - checked/unchecked双状态切换
- [ ] **不确定状态** - indeterminate第三态支持  
- [ ] **标签文本** - 支持文本标签和点击选中
- [ ] **禁用状态** - disabled状态支持
- [ ] **值绑定** - value属性和双向数据绑定

### 高级功能
- [ ] **组合使用** - CheckboxGroup支持
- [ ] **全选/反选** - 父子级联控制
- [ ] **自定义样式** - 主题色和尺寸变体
- [ ] **表单验证** - required验证集成

## 🎨 设计规范

### 尺寸规格
```
small:  14px × 14px (间距 8px)
medium: 16px × 16px (间距 10px) [默认]
large:  20px × 20px (间距 12px)
```

### 状态设计
- **未选中** - 空心方框
- **选中** - 实心方框 + 对勾图标
- **不确定** - 实心方框 + 横线图标
- **禁用** - 灰色样式 + 不可交互

### 颜色规范
- 默认：边框 #d9d9d9，选中 primary色
- hover：边框颜色加深
- focus：添加focus-ring
- disabled：透明度50%

## 🔧 API 设计

### 属性 (Attributes)
```typescript
interface CheckboxOption {
  checked?: boolean;        // 选中状态
  indeterminate?: boolean;  // 不确定状态
  disabled?: boolean;       // 禁用状态
  value?: string;          // 组件值
  name?: string;           // 表单字段名
  required?: boolean;       // 必填验证
  size?: 'small' | 'medium' | 'large';  // 尺寸
}
```

### 使用示例
```html
<!-- 基础使用 -->
<ma-checkbox>同意用户协议</ma-checkbox>

<!-- 预选中状态 -->
<ma-checkbox checked>默认选中</ma-checkbox>

<!-- 不确定状态 -->
<ma-checkbox indeterminate>全选</ma-checkbox>

<!-- 禁用状态 -->
<ma-checkbox disabled>不可选择</ma-checkbox>

<!-- 表单集成 -->
<ma-checkbox name="terms" value="agreed" required>
  我已阅读并同意服务条款
</ma-checkbox>

<!-- 尺寸变体 -->
<ma-checkbox size="small">小尺寸</ma-checkbox>
<ma-checkbox size="large">大尺寸</ma-checkbox>
```

### 事件 (Events)
```typescript
// 状态改变事件
checkbox.addEventListener('change', (e: CustomEvent) => {
  console.log('选中状态:', e.detail.checked);
  console.log('组件值:', e.detail.value);
});

// focus/blur事件
checkbox.addEventListener('focus', () => {});
checkbox.addEventListener('blur', () => {});
```

## 🏗️ CheckboxGroup 扩展

### 组合使用场景
```html
<ma-checkbox-group name="hobbies" value="reading,music">
  <ma-checkbox value="reading">阅读</ma-checkbox>
  <ma-checkbox value="music">音乐</ma-checkbox>
  <ma-checkbox value="sports">运动</ma-checkbox>
</ma-checkbox-group>
```

### 全选功能
```html
<ma-checkbox id="selectAll" indeterminate>全选</ma-checkbox>
<ma-checkbox-group>
  <ma-checkbox value="item1">选项1</ma-checkbox>
  <ma-checkbox value="item2">选项2</ma-checkbox>
  <ma-checkbox value="item3">选项3</ma-checkbox>
</ma-checkbox-group>
```

## 🔄 状态管理

### 内部状态
- **checked** - 选中状态
- **indeterminate** - 不确定状态  
- **focused** - 焦点状态
- **disabled** - 禁用状态

### 状态优先级
1. disabled > indeterminate > checked
2. indeterminate状态会覆盖checked显示
3. disabled状态不响应用户交互

## 🎭 主题支持

### CSS 变量
```css
--ma-checkbox-size: 16px;
--ma-checkbox-color: var(--ma-color-primary);
--ma-checkbox-border-color: #d9d9d9;
--ma-checkbox-border-radius: 2px;
--ma-checkbox-label-gap: 8px;
```

### 主题变体
- 支持品牌色系：primary, secondary
- 支持尺寸变体：small, medium, large
- 支持圆角和方角样式

## ♿ 可访问性

### ARIA 支持
- [ ] `role="checkbox"`
- [ ] `aria-checked="true|false|mixed"`
- [ ] `aria-disabled="true|false"`
- [ ] `aria-labelledby` 关联标签

### 键盘导航
- [ ] Tab键焦点切换
- [ ] Space键切换选中状态
- [ ] 回车键提交表单（如在表单中）

### 屏幕阅读器
- [ ] 状态变化播报
- [ ] 标签文本正确关联
- [ ] 必填字段提示

## ⚡ 交互体验

### 点击区域
- checkbox本体 + 标签文本都可点击
- 点击反馈：视觉状态变化 + 音效（可选）

### 动画效果
- [ ] 选中状态过渡动画 (200ms ease)
- [ ] 对勾图标显示动画
- [ ] hover状态过渡

### 手势支持
- 移动端触摸友好的点击区域
- 支持长按等手势（可扩展）

## 🧪 测试策略

### 单元测试
- [ ] 基础选中/取消选中功能
- [ ] indeterminate状态切换
- [ ] disabled状态验证
- [ ] 事件触发和数据传递
- [ ] 表单集成测试

### 可访问性测试
- [ ] 键盘导航测试
- [ ] 屏幕阅读器测试
- [ ] 高对比度模式测试
- [ ] 焦点管理测试

### 跨浏览器测试
- [ ] Chrome/Safari/Firefox/Edge
- [ ] 移动端浏览器适配
- [ ] 不同分辨率下的显示效果

## 📋 实现检查清单

### 基础实现
- [ ] ComponentBase集成
- [ ] HTML模板和Shadow DOM
- [ ] SCSS样式实现
- [ ] TypeScript类型定义

### 核心功能
- [ ] 状态管理逻辑
- [ ] 点击交互处理
- [ ] indeterminate状态支持
- [ ] 表单值同步

### 高级功能
- [ ] CheckboxGroup组合组件
- [ ] 全选/反选逻辑
- [ ] 主题样式变体
- [ ] 动画过渡效果

### 质量保证
- [ ] 可访问性完整支持
- [ ] 单元测试全覆盖
- [ ] 跨浏览器兼容性
- [ ] 性能优化

## 🔗 相关组件

### 依赖组件
- Icon (对勾图标)
- ComponentBase (基类)

### 关联组件
- Radio (单选组件，类似交互)
- Switch (开关组件，类似功能)
- Form (表单集成)

### 组合组件
- CheckboxGroup (复选框组)
- Table (表格行选择)

## 💡 技术难点

### 1. 不确定状态处理
```javascript
// indeterminate状态不能通过HTML属性设置
// 需要通过JavaScript API控制
element.indeterminate = true;
```

### 2. 表单数据同步
```javascript
// 需要正确处理FormData收集
// 支持原生表单提交和验证
```

### 3. CheckboxGroup值管理
```javascript
// 多个checkbox的值需要统一管理  
// 支持数组值的序列化和反序列化
```

## 📚 参考实现

- [Material Design Checkbox](https://material.io/components/checkboxes)
- [Ant Design Checkbox](https://ant.design/components/checkbox/)
- [Element Plus Checkbox](https://element-plus.org/en-US/component/checkbox.html)
- [Web标准Checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)