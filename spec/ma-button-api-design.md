# MA-BUTTON 组件 API 设计文档

## 概述

`ma-button` 是遵循 Web Components 标准实现的按钮组件，聚焦一致的交互反馈、主题适配与状态管理。组件内置多种尺寸与变体，可在表单提交、操作面板、确认流程等场景中复用，同时通过 Shadow DOM 保持样式隔离并提供 CSS 变量用于深度定制。

## 基础用法

```html
<!-- 默认（primary、medium、type="button"） -->
<ma-button>提交</ma-button>

<!-- 提交按钮 -->
<form>
  <ma-button type="submit">保存</ma-button>
</form>

<!-- 禁用与加载态 -->
<ma-button disabled>不可点击</ma-button>
<ma-button loading>处理中...</ma-button>
```

## 插槽 (Slots)

- 默认插槽：用于放置按钮文案或自定义内容（如图标+文本）。内容会被包裹在 `.content` 容器中以保持对齐。

## API 参考

### 属性 (Attributes)

#### 基础属性
- `type`: 'button' | 'submit' | 'reset' — 对应原生 button 元素的 type，默认为 `button`。
- `class`: string — 透传到内部按钮的额外类名，可与宿主的类名共存，便于精细调整。

#### 样式属性
- `size`: 'small' | 'medium' | 'large' — 控制高度、字号与内边距，默认 `medium`。
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' — 预置主题风格，默认 `primary`。

#### 状态属性
- `disabled`: boolean — 置于禁用态，同时阻断点击事件与 hover/active 效果。
- `loading`: boolean — 展示内置加载动画并阻断交互，内部会自动禁用按钮以避免重复触发。

> 属性更新会触发组件内部的重新渲染逻辑，保持宿主属性与 Shadow DOM 按钮的状态一致。

### 事件 (Events)

所有事件均为可冒泡且 `composed: true`，因而可在宿主元素之外监听。

- `ma-click`
  ```javascript
  detail: { originalEvent: MouseEvent }
  ```
  在按钮未禁用/未加载时点击触发，等价于原生 click。

- `ma-focus`
  ```javascript
  detail: { originalEvent: FocusEvent }
  ```
  内部 button 获得焦点时触发，可与表单校验、可访问性提示联动。

- `ma-blur`
  ```javascript
  detail: { originalEvent: FocusEvent }
  ```
  内部 button 失去焦点时触发。

### 方法 (Methods)

- `focus(): void` — 主动聚焦内部按钮。
- `blur(): void` — 移除焦点。
- `click(): void` — 调用原生 `HTMLButtonElement.click()`，会根据 `disabled/loading` 状态决定是否触发 `ma-click`。

## 状态与交互细节

- 禁用或加载时会阻止默认点击行为并停止事件冒泡，保障外层逻辑安全。
- `loading` 属性会插入一个内置的 SVG 旋转图标到按钮开头，并降低内容不透明度以提示等待状态。
- 组件构造时自动生成 `id`（`ma-button-xxxx`），方便调试；亦可手动覆盖。

## 样式与定制

通过 CSS 变量可全局定制配色与尺寸：

```css
ma-button {
  --ma-primary: #4f46e5;
  --ma-primary-hover: #4338ca;
  --ma-button-border-radius: 8px;
}
```

| 变量名 | 说明 |
| --- | --- |
| `--ma-button-border-radius` | 按钮圆角 |
| `--ma-button-font-weight` | 字重 |
| `--ma-button-transition` | 交互动画 |
| `--ma-button-small-height/padding/font-size` 等 | 三种尺寸的高度、内边距、字号 |
| `--ma-primary` / `--ma-secondary` / `--ma-danger` | 主题底色与边框色 |
| `--ma-primary-hover` / `--ma-secondary-hover` 等 | Hover 状态颜色 |
| `--ma-primary-active` / `--ma-secondary-active` 等 | Active 状态颜色 |
| `--ma-gray-100` / `--ma-gray-300` / `--ma-gray-500` | 禁用态配色 |

组件使用 `:host` 作用域变量，因此可在单个实例或全局范围内重写，亦可配合 `class` 属性实现更精细的主题扩展。

## 使用示例

### 图标按钮

```html
<ma-button class="with-icon">
  <svg class="icon" viewBox="0 0 16 16" aria-hidden="true">...</svg>
  新建
</ma-button>
```

```css
ma-button.with-icon .icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
```

### 操作组

```html
<div role="group" aria-label="操作">
  <ma-button size="small" variant="secondary">重置</ma-button>
  <ma-button size="small" variant="primary">提交</ma-button>
</div>
```

### 加载态联动

```javascript
const actionButton = document.querySelector('ma-button#export');

actionButton.addEventListener('ma-click', async () => {
  actionButton.loading = true;
  try {
    await exportData();
  } finally {
    actionButton.loading = false;
  }
});
```

## 设计原则

- **一致性**：封装常见的尺寸、主题和过渡效果，保持项目视觉统一。
- **可访问性**：保留原生 `button` 焦点环与键盘交互，同时通过自定义事件暴露焦点信息。
- **可扩展性**：支持透传类名、CSS 变量与外部自定义内容，便于与设计系统及图标库集成。

## 兼容性

- 现代浏览器（Chrome 60+, Firefox 63+, Safari 11+, Edge 79+）
- Shadow DOM 原生支持场景下表现最佳；不支持的环境可配合 polyfill 使用
