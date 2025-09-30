# ma-button API 设计

## 背景与对标

`ma-button` 是遵循 Web Components 规范封装的按钮组件，用于承载应用中的主要与次要操作，目标是在可扩展的基础上提供一致的交互体验、清晰的语义层级以及易于主题化的视觉语言。

## 设计目标

- **一致性**：预设的尺寸与变体对应明确的交互反馈，保证跨页面视觉与行为统一。
- **语义清晰**：属性命名与值域与主流库保持一致，可直观表达操作优先级、视觉层级与状态。
- **主题友好**：依赖 CSS 自定义属性提供设计令牌（Design Tokens），支持品牌化拓展与暗色模式切换。
- **渐进增强**：默认提供可用逻辑（加载阻断、禁用保护、焦点可视化），允许在需要时覆盖到更复杂的设计系统。

## 组件架构与解剖

- 基于 `ComponentsBase` 封装，Shadow DOM（`open`）保证样式隔离。
- 内部结构：`<button>` + `.content` 容器（承载默认插槽内容）。
- 加载态时会在内容前插入内置的 SVG loading spinner，保证文本与图标对齐。
- 所有交互事件向外透出自定义事件，以便在宿主上下文中监听。

## 快速上手

```html
<!-- Primary / medium / button -->
<ma-button id="submit">提交</ma-button>

<!-- 表单提交按钮 -->
<form>
  <ma-button type="submit" variant="primary">保存</ma-button>
</form>

<!-- 次要操作 + 加载状态联动 -->
<ma-button id="export" variant="secondary" loading>导出中...</ma-button>
```

```javascript
const exportButton = document.querySelector('#export');

exportButton.addEventListener('ma-click', async () => {
  exportButton.loading = true;
  try {
    await exportData();
  } finally {
    exportButton.loading = false;
  }
});
```

## 插槽 (Slots)

- **默认插槽**：承载按钮文案或自定义内容，内部通过 `.content` 容器实现垂直居中。

## 图标支持

`ma-button` 集成了 `ma-icon` 组件，提供声明式图标配置能力，无需手动管理图标布局与尺寸：

```html
<!-- 左侧图标 (默认) -->
<ma-button icon="download" icon-set="system">下载</ma-button>

<!-- 右侧图标 -->
<ma-button icon="arrow-right" icon-position="right">下一步</ma-button>

<!-- 自定义图标集 -->
<ma-button icon="heart" icon-set="filled" variant="danger">收藏</ma-button>
```

### 图标相关属性

- **`icon`**：图标名称，映射到 `ma-icon` 的 `name` 属性。设置后会在按钮中自动渲染对应图标。
- **`icon-set`**：图标集名称（默认 `system`），可选 `system`、`outlined`、`filled` 或自定义图标集。
- **`icon-position`**：图标位置，可选 `left`（默认）或 `right`。控制图标相对于文本的位置。

### 图标尺寸自动适配

按钮会根据自身 `size` 自动调整内部图标尺寸：

| 按钮尺寸 | 图标尺寸 |
| -------- | -------- |
| `small`  | 16px     |
| `medium` | 18px     |
| `large`  | 20px     |

### 自定义图标（插槽方式）

对于更复杂的场景，仍可通过默认插槽手动放置图标：

```html
<ma-button variant="primary" class="with-icon">
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

> **注意**：使用 `icon` 属性时，图标会自动布局到 `icon-container` 中，无需额外样式。插槽方式需手动管理间距与对齐。

## HTML 属性

| 属性            | 取值                                            | 默认值    | 用途                                                                                       | 对标参考                |
| --------------- | ----------------------------------------------- | --------- | ------------------------------------------------------------------------------------------ | ----------------------- |
| `type`          | `button` \| `submit` \| `reset`                 | `button`  | 对齐原生 `HTMLButtonElement` 行为，支持表单提交、重置场景。                                | Material UI、Ant Design |
| `size`          | `small` \| `medium` \| `large`                  | `medium`  | 控制高度、内边距与字号。数值映射参考 MUI/Chakra 的尺寸体系。                               | Material UI、Chakra UI  |
| `variant`       | `primary` \| `secondary` \| `danger` \| `ghost` | `primary` | 表达视觉层级与语义色彩。`ghost` 用于弱化强调、与 Chakra 的 `ghost` 与 AntD `text` 相对应。 | Ant Design、Chakra UI   |
| `disabled`      | boolean attribute                               | -         | 禁用按钮并屏蔽事件。                                                                       | 所有主流库              |
| `loading`       | boolean attribute                               | -         | 展示加载 spinner 并阻断交互，防止重复提交。                                                | Ant Design、Chakra UI   |
| `icon`          | 符合 kebab-case 的图标 ID                       | -         | 在按钮中显示图标，使用内置或自定义图标集。                                                 | Material UI、Ant Design |
| `icon-set`      | `system` \| `outlined` \| `filled` \| 自定义集  | `system`  | 指定图标所属的图标集。                                                                     | Carbon Icons、Material  |
| `icon-position` | `left` \| `right`                               | `left`    | 控制图标相对于文本的位置。                                                                 | Ant Design、Chakra UI   |
| `class`         | string                                          | -         | 透传到内部按钮，允许在特定实例上追加 BEM/Utility 类名。                                    | Bootstrap               |

> 其他标准 HTML 属性（如 `name`、`form`、`value` 等）可通过 `setAttribute` 直接添加到 `<ma-button>`，内部 `<button>` 会继承受控属性。

### JavaScript 属性访问器

```javascript
const button = document.querySelector('ma-button');

button.variant = 'danger';
button.size = 'large';
button.disabled = false;
button.loading = true;

// 图标属性
button.icon = 'download';
button.iconSet = 'system';
button.iconPosition = 'right';
```

- Setter 会同步触发 `_updateComponent`，保持宿主属性与 Shadow DOM 状态一致。
- 同时兼容属性与 `setAttribute/removeAttribute` 调用，方便与框架式状态管理集成。
- 图标属性的更改会动态更新按钮中的 `ma-icon` 组件。

## 自定义事件

事件均 `bubbles: true` 且 `composed: true`，可在组件外层捕获。

| 事件名     | 触发时机                       | 事件负载                        |
| ---------- | ------------------------------ | ------------------------------- |
| `ma-click` | 非禁用且非加载状态下点击触发   | `{ originalEvent: MouseEvent }` |
| `ma-focus` | 内部 `<button>` 获得焦点时触发 | `{ originalEvent: FocusEvent }` |
| `ma-blur`  | 内部 `<button>` 失去焦点时触发 | `{ originalEvent: FocusEvent }` |

## 公共方法

- `focus(): void` — 聚焦内部按钮，保持与原生方法对齐。
- `blur(): void` — 移除焦点，便于在模态或对话框中协调焦点管理。
- `click(): void` — 调用原生 `HTMLButtonElement.click()`；若 `disabled`/`loading` 为真，将阻断点击。

## 状态与交互细节

- **Hover/Active**：依据 `variant` 派生 hover/active 颜色，遵循 Material/AntD 中“主按钮渐变-次按钮描边/透明”的规范。
- **Disabled**：禁用时移除阴影并降低对比度，同时禁止 hover 反馈，防止误导用户。内部通过 `button.disabled = true` 阻断键盘触发。
- **Loading**：加载态插入内置 spinner 并将文本透明度设为 0.6。遵循 AntD 的“按钮保持尺寸不变、内容轻量提示”原则。
- **Focus**：显示可访问的焦点环（outline）。建议在自定义主题时保留至少 3:1 的对比度，与 WCAG 2.1 AA 要求对齐。

## 样式与主题定制

`ma-button` 通过 CSS 自定义属性暴露设计令牌，可结合 Design Token 系统实现品牌化主题。

### 样式变量一览

| 变量名                                                              | 默认值                            | 作用                         |
| ------------------------------------------------------------------- | --------------------------------- | ---------------------------- |
| `--ma-button-border-radius`                                         | `6px`                             | 按钮圆角                     |
| `--ma-button-font-weight`                                           | `500`                             | 字重                         |
| `--ma-button-transition`                                            | `all 0.2s ease-in-out`            | 动画过渡                     |
| **尺寸（size）**                                                    |                                   |                              |
| `--ma-button-small-height`                                          | `28px`                            | 小尺寸高度                   |
| `--ma-button-small-padding`                                         | `0 12px`                          | 小尺寸内边距                 |
| `--ma-button-small-font-size`                                       | `12px`                            | 小尺寸字号                   |
| `--ma-button-medium-height`                                         | `36px`                            | 中尺寸高度                   |
| `--ma-button-medium-padding`                                        | `0 16px`                          | 中尺寸内边距                 |
| `--ma-button-medium-font-size`                                      | `14px`                            | 中尺寸字号                   |
| `--ma-button-large-height`                                          | `44px`                            | 大尺寸高度                   |
| `--ma-button-large-padding`                                         | `0 20px`                          | 大尺寸内边距                 |
| `--ma-button-large-font-size`                                       | `16px`                            | 大尺寸字号                   |
| **语义色彩**                                                        |                                   |                              |
| `--ma-primary` / `--ma-primary-hover` / `--ma-primary-active`       | `#007bff` / `#0056b3` / `#004085` | Primary 变体的主色及交互态   |
| `--ma-secondary` / `--ma-secondary-hover` / `--ma-secondary-active` | `#6c757d` / `#545b62` / `#3d4246` | Secondary 变体的主色及交互态 |
| `--ma-danger` / `--ma-danger-hover` / `--ma-danger-active`          | `#dc3545` / `#c82333` / `#bd2130` | Danger 变体的主色及交互态    |
| `--ma-white`                                                        | `#ffffff`                         | 文字/图标颜色                |
| `--ma-gray-100` / `--ma-gray-300` / `--ma-gray-500`                 | `#f8f9fa` / `#dee2e6` / `#adb5bd` | 禁用背景、边框与文字颜色     |

### 定制策略

```css
/* 全局主题 */
:root[data-theme='dark'] {
  --ma-primary: #3b82f6;
  --ma-primary-hover: #2563eb;
  --ma-primary-active: #1d4ed8;
  --ma-button-border-radius: 8px;
}

/* 局部差异化 */
ma-button[data-tone='success'] {
  --ma-primary: #10b981;
  --ma-primary-hover: #059669;
  --ma-primary-active: #047857;
}
```

- 建议使用 Design Token 命名（如 `--color-brand-primary`）接入企业级设计体系。
- 若需大范围覆盖，可结合外层 `class`（如 `.ma-button--xs`）或未来计划的 `part` 选择器，使主题切换更具可控性。

## 可访问性建议

- 始终提供明确的按钮文案；当仅展示图标时，需补充 `aria-label` 与 `title`。
- 确保 `variant` 自定义颜色与背景的对比度符合 WCAG 2.1 AA（视觉重点 ≥ 4.5:1）。
- 禁用与加载状态需同步暴露给屏幕阅读器，可根据需要增加 `aria-busy="true"` 等属性。
- 在键盘导航密集的场景下，利用 `ma-focus`/`ma-blur` 事件配合焦点管理，避免焦点陷阱。

## 与设计系统的协作建议

1. **命名收敛**：无论设计稿中使用“主要按钮/次要按钮”还是“强强调/弱强调”，均建议映射到 `variant`，减少设计与实现的术语差异。
2. **操作分组**：在工具栏/按钮组中，通过统一的尺寸与间距，借鉴 Bootstrap 的 Button Group，实现左右对齐与分隔。
3. **反馈节奏**：结合 `loading` 状态与外部 Toast/Alert，参考 Ant Design 的“提交后 300ms 仍未完成即进入加载态”的规则，提高响应透明度。

## 后续演进路线（Roadmap）

- **块级展示 (`block`)**：提供宽度 100% 的变体，对齐 Ant Design/Bootstrap 在移动端的用法。
- **~~图标插槽优化~~**：✅ 已通过 `icon`、`icon-set`、`icon-position` 属性集成 `ma-icon` 组件。
- **语义色彩扩展**：支持 `success`、`warning` 等 tone，参考 Chakra `colorScheme` 概念，提升语义覆盖。
- **Button Group 组件**：封装按钮组容器，提供分隔线、紧凑模式等能力。
- **Loading 自定义**：允许通过 `slot="spinner"` 或 CSS `part` 覆盖默认加载图标，满足品牌化需求。

## 浏览器兼容性

- 现代浏览器（Chrome 60+、Firefox 63+、Safari 11+、Edge 79+）。
- 若运行环境缺少 Web Components/Shadow DOM 原生支持，可引入 `@webcomponents/webcomponentsjs` polyfill。

通过以上设计，`ma-button` 能够在保持 API 简洁的前提下，复用主流控件库的最佳实践，同时为后续拓展留出足够空间。
## 测试规约（Test Spec）

### 测试范围
- Attribute & Property：`type`、`size`、`variant`、`disabled`、`loading`、`icon`、`icon-set`、`icon-position` 的默认值、属性反射与 DOM 同步。
- 交互状态：禁用、加载态对可点击性、样式 class 与 `aria-busy` 的影响。
- 自定义事件：`ma-click`、`ma-focus`、`ma-blur` 的触发、负载和事件选项（`bubbles`、`composed`）。
- 公共方法：`focus()`、`blur()`、`click()` 的行为与防护逻辑。
- 模板结构：Spinner 与内容插槽在加载/非加载态下的显示控制。
- 图标集成：`icon` 属性对 `ma-icon` 组件的渲染、`icon-position` 的布局控制、图标尺寸的自动适配。
- Shadow DOM Guard：重复定义 `customElements.define` 的安全性。

### 测试环境与前置条件
- 框架：Jest + `jest-environment-jsdom`。
- Polyfill：必要时注入 `@webcomponents/webcomponentsjs`（针对自定义元素与 Shadow DOM）。
- 入口：通过 `import './ma-button';` 注册组件，使用 `document.createElement('ma-button')` 初始化。
- 每个用例独立创建/销毁 DOM 节点，清理 `document.body` 防止状态串扰。

### 功能用例矩阵
| 用例 ID | 场景 | 步骤概述 | 期望结果 |
| --- | --- | --- | --- |
| TS01 | 默认渲染 | 创建元素后挂载至 DOM | `_shadowRoot` 中存在 `.ma-button`；type 为 `button`；class 包含 `ma-button--primary`、`ma-button--medium`；`aria-busy="false"` |
| TS02 | type 属性映射 | 设置 `button.type = 'submit'`，再移除 | 内部 `<button>` 的 `type` 同步为 `submit`；移除后恢复默认 `button` |
| TS03 | size 变体 | 依次设置 `small/large` | `className` 更新为对应 `ma-button--{size}`，无重复 class，互斥生效 |
| TS04 | variant 变体 | 依次设置 `secondary/danger/ghost` | `className` 更新为对应 `ma-button--{variant}`，其余变体 class 移除 |
| TS05 | disabled 状态 | `button.disabled = true` 后触发 click | 内部 `<button>` `disabled=true`；类包含 `ma-button--disabled`；`ma-click` 不触发；事件被阻止 |
| TS06 | loading 状态 | 设置 `loading=true` | 内部 `<button>` `disabled=true`；类包含 `ma-button--loading`；`.spinner` 可见（opacity 通过 class 切换）；`aria-busy="true"` |
| TS07 | loading + disabled 优先级 | 同时设定 `disabled=true`、`loading=true` | 仍不可点击；`ma-click` 不触发；`ma-button--disabled` 与 `ma-button--loading` 同时存在 |
| TS08 | 属性反射 | 通过 `setAttribute/removeAttribute` 控制 | 对应 getter 反射到 JS 属性；布尔属性遵循存在即 true、移除为 false |
| TS09 | Slot 内容 | 向默认插槽插入文本与自定义节点 | `.content` 中包含插入节点；结构保持顺序；无额外 wrapper |
| TS10 | focus/blur 方法 | 调用公开方法 | `focus()`/`blur()` 透传至内部按钮，触发 `ma-focus`/`ma-blur` 事件 |
| TS11 | click 方法防护 | 调用 `click()` 在禁用/加载态 | 正常态触发 `ma-click` 并带 `detail.originalEvent`；禁用或加载时不触发 |
| TS12 | 自定义事件属性 | 监听三个事件 | `event.bubbles === true`、`event.composed === true`；`detail.originalEvent` 指向原生事件实例 |
| TS13 | 重复注册守卫 | 二次 import 组件 | 不抛出 `DOMException`；组件仅注册一次 |
| TS14 | icon 属性渲染 | 设置 `icon='download'` | `.icon-container` 中渲染 `<ma-icon name="download">`；图标可见 |
| TS15 | icon-set 属性 | 设置 `icon-set='outlined'` | `<ma-icon>` 的 `set` 属性更新为 `outlined` |
| TS16 | icon-position 属性 | 设置 `icon-position='right'` | 按钮包含 `ma-button--icon-right` class；图标在文本右侧 |
| TS17 | icon 尺寸自适应 | 依次设置 `size='small/medium/large'` | `<ma-icon>` 的 `size` 属性自动更新为 `16/18/20` |
| TS18 | 移除 icon 属性 | 先设置 `icon`，后移除 | `.icon-container` 被清空；无 `<ma-icon>` 元素 |

### 边界与回归检查
- 属性输入校验：对无效的 `size`/`variant` 值应保持最后一次有效 class（当前实现未显式校验，记录为回归检查关注点）。
- 主题样式：验证自定义 CSS 变量覆盖（通过 `element.style.setProperty`）对高度/颜色的影响。
- 表单兼容：当 `type='submit'` 时放入表单，模拟 `form.submit` 触发确认按钮仍然提交。

### 无障碍与语义
- `aria-busy`：确认布尔值转换为字符串，并在状态切换时更新。
- 聚焦可视化：`focus-visible` 下 outline 可通过快照或 computed style 校验。
- 屏幕阅读器友好：禁用/加载态下，`disabled` 与 `aria-busy` 同步反映，无重复读数。

### 非目标（Out of Scope）
- 视觉像素级回归（建议由视觉回归工具覆盖）。
- 跨浏览器行为差异（由 E2E/手动冒烟补充）。
- Button Group / 未来路线图中尚未落地的扩展能力。
