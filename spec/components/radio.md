# Radio 组件功能规格

> **组件类型：** 表单控件组件  
> **优先级：** 高 🔥  
> **依赖组件：** 无  
> **被依赖组件：** Form, RadioGroup

## 📋 功能需求概述

Radio是表单中的单选组件，通常多个radio组成一个选择组，同一组内只能选择一个选项。需要提供清晰的视觉反馈和完善的键盘导航支持。

## 🎯 核心功能

### 基础功能
- [ ] **单选机制** - 同name组内互斥选择
- [ ] **选中状态** - checked/unchecked状态管理
- [ ] **标签支持** - 文本标签和点击选中
- [ ] **禁用状态** - disabled状态支持
- [ ] **值绑定** - value属性和表单集成

### 高级功能
- [ ] **组合使用** - RadioGroup包装组件
- [ ] **键盘导航** - 箭头键切换选项
- [ ] **自定义样式** - 主题色和尺寸变体
- [ ] **表单验证** - required验证集成

## 🎨 设计规范

### 尺寸规格
```
small:  12px × 12px (间距 8px)
medium: 14px × 14px (间距 10px) [默认]
large:  18px × 18px (间距 12px)
```

### 视觉设计
- **未选中** - 空心圆圈，边框色
- **选中** - 空心圆圈 + 内部实心圆点
- **hover** - 边框色加深，背景色淡化
- **focus** - 添加focus-ring外圈
- **disabled** - 灰色样式，不可交互

### 颜色规范
- 边框：#d9d9d9 → hover #40a9ff
- 选中：primary色内圆 + 边框
- 禁用：rgba(0,0,0,0.25)

## 🔧 API 设计

### 属性 (Attributes)
```typescript
interface RadioOption {
  checked?: boolean;        // 选中状态
  disabled?: boolean;       // 禁用状态
  value: string;           // 必需：组件值
  name?: string;           // 表单字段名
  required?: boolean;       // 必填验证
  size?: 'small' | 'medium' | 'large';  // 尺寸
}
```

### 使用示例
```html
<!-- 基础使用 -->
<ma-radio name="gender" value="male">男</ma-radio>
<ma-radio name="gender" value="female">女</ma-radio>

<!-- 预选中状态 -->
<ma-radio name="type" value="pro" checked>专业版</ma-radio>
<ma-radio name="type" value="basic">基础版</ma-radio>

<!-- 禁用状态 -->
<ma-radio name="plan" value="premium" disabled>高级版(暂未开放)</ma-radio>

<!-- 尺寸变体 -->
<ma-radio name="size" value="s" size="small">小</ma-radio>
<ma-radio name="size" value="l" size="large">大</ma-radio>
```

### 事件 (Events)
```typescript
// 状态改变事件
radio.addEventListener('change', (e: CustomEvent) => {
  console.log('选中值:', e.detail.value);
  console.log('选中状态:', e.detail.checked);
});

// focus/blur事件
radio.addEventListener('focus', () => {});
radio.addEventListener('blur', () => {});
```

## 🏗️ RadioGroup 扩展

### 组合使用场景
```html
<ma-radio-group name="payment" value="alipay">
  <ma-radio value="alipay">支付宝</ma-radio>
  <ma-radio value="wechat">微信支付</ma-radio>
  <ma-radio value="bank">银行卡</ma-radio>
</ma-radio-group>
```

### 方向布局
```html
<!-- 垂直布局 -->
<ma-radio-group direction="vertical">
  <ma-radio value="option1">选项1</ma-radio>
  <ma-radio value="option2">选项2</ma-radio>
</ma-radio-group>

<!-- 水平布局(默认) -->
<ma-radio-group direction="horizontal">
  <ma-radio value="yes">是</ma-radio>
  <ma-radio value="no">否</ma-radio>
</ma-radio-group>
```

## 🔄 状态管理

### 内部状态
- **checked** - 选中状态
- **focused** - 焦点状态
- **disabled** - 禁用状态
- **name** - 分组标识

### 互斥逻辑
```javascript
// 同name的radio组件互斥选择
// 选中一个自动取消其他选中状态
handleChange(currentRadio) {
  const sameNameRadios = document.querySelectorAll(`ma-radio[name="${currentRadio.name}"]`);
  sameNameRadios.forEach(radio => {
    if (radio !== currentRadio) {
      radio.checked = false;
    }
  });
}
```

## 🎭 主题支持

### CSS 变量
```css
--ma-radio-size: 14px;
--ma-radio-color: var(--ma-color-primary);
--ma-radio-border-color: #d9d9d9;
--ma-radio-dot-size: 8px;
--ma-radio-label-gap: 8px;
```

### 主题变体
- 支持品牌色系：primary, secondary
- 支持尺寸变体：small, medium, large
- 支持自定义边框和填充色

## ♿ 可访问性

### ARIA 支持
- [ ] `role="radio"`
- [ ] `aria-checked="true|false"`
- [ ] `aria-disabled="true|false"`
- [ ] `aria-labelledby` 关联标签

### 键盘导航
- [ ] Tab键: 进入/离开Radio组
- [ ] 方向键: 组内切换选项
- [ ] Space键: 选中当前选项

### 屏幕阅读器
- [ ] 组标题播报 (RadioGroup)
- [ ] 选项数量播报 ("第1个，共3个")
- [ ] 选中状态变化播报

### 焦点管理
```javascript
// Radio组的焦点管理规则：
// 1. Tab键只能聚焦到选中的radio，或第一个radio
// 2. 方向键在组内循环切换
// 3. 切换同时改变选中状态
```

## ⚡ 交互体验

### 点击行为
- Radio圆圈 + 标签文本都可点击
- 点击后立即选中，其他选项取消选中
- 已选中的radio点击无效（不能取消选中）

### 键盘操作
- **方向键导航** - 上下左右键切换选项
- **循环导航** - 到达末尾后回到开头
- **跳过禁用** - 自动跳过disabled选项

### 动画效果
- [ ] 选中状态过渡动画 (200ms ease)
- [ ] 内圆点缩放动画
- [ ] hover状态过渡

## 🧪 测试策略

### 单元测试
- [ ] 基础选中功能
- [ ] 同名组互斥逻辑
- [ ] disabled状态验证
- [ ] 事件触发和数据传递
- [ ] 表单集成测试

### 交互测试
- [ ] 鼠标点击切换
- [ ] 键盘导航测试
- [ ] 焦点管理测试
- [ ] 触摸设备适配

### 可访问性测试
- [ ] 屏幕阅读器测试
- [ ] 高对比度模式
- [ ] 键盘only操作
- [ ] 语义化结构验证

## 📋 实现检查清单

### 基础实现
- [ ] ComponentBase集成
- [ ] HTML模板设计
- [ ] SCSS样式实现
- [ ] TypeScript类型定义

### 核心功能
- [ ] 选中状态管理
- [ ] 互斥选择逻辑
- [ ] 点击交互处理
- [ ] 表单值同步

### 高级功能
- [ ] RadioGroup组合组件
- [ ] 键盘导航支持
- [ ] 主题样式变体
- [ ] 动画过渡效果

### 质量保证
- [ ] 可访问性完整支持
- [ ] 跨浏览器兼容性
- [ ] 单元测试全覆盖
- [ ] 性能优化验证

## 🔗 相关组件

### 依赖组件
- ComponentBase (基类)

### 关联组件
- Checkbox (复选组件，类似交互)
- Select (下拉选择，类似功能)
- Form (表单集成)

### 组合组件
- RadioGroup (单选框组)
- FormItem (表单项包装)

## 💡 技术难点

### 1. 跨组件状态同步
```javascript
// 同name的radio需要跨组件通信
// 实现互斥选择逻辑
class RadioGroupManager {
  static groups = new Map();
  
  static register(radio) {
    const group = this.groups.get(radio.name) || [];
    group.push(radio);
    this.groups.set(radio.name, group);
  }
  
  static updateGroup(radio, checked) {
    const group = this.groups.get(radio.name) || [];
    if (checked) {
      group.forEach(r => {
        if (r !== radio) r.checked = false;
      });
    }
  }
}
```

### 2. 键盘导航实现
```javascript
// 需要实现复杂的焦点管理逻辑
// 包括循环导航、跳过禁用等
handleKeydown(e) {
  const radios = this.getGroupRadios();
  const currentIndex = radios.indexOf(this);
  
  switch(e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      this.focusNext(radios, currentIndex);
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      this.focusPrev(radios, currentIndex);
      break;
  }
}
```

### 3. 表单集成
```javascript
// 需要正确处理FormData
// 确保与原生radio行为一致
connectedCallback() {
  super.connectedCallback();
  
  // 注册到最近的form
  const form = this.closest('form');
  if (form) {
    this.registerToForm(form);
  }
}
```

## 📚 参考实现

- [Material Design Radio](https://material.io/components/radio-buttons)
- [Ant Design Radio](https://ant.design/components/radio/)
- [Element Plus Radio](https://element-plus.org/en-US/component/radio.html)
- [Web标准Radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)