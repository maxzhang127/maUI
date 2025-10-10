# ma-tabs API 设计

`ma-tabs` 是基于 Web Components 封装的标签页导航控件，用于在多内容视图间切换并保持状态同步，适配桌面与移动端的分栏与分组场景。

## 背景与对标

- 主要使用场景：仪表盘模块切换、配置与设置页分组、详情页二级内容折叠、表单分步导航、抽屉内嵌数据面板。
- 用户痛点：页面通过手写按钮控制展示导致焦点管理混乱、键盘可访问性缺失、主题样式不一致；缺少统一的标签关闭、溢出滚动与移动端适配策略。
- 对标对象：Material Web `<md-tabs>`、Ant Design `<Tabs>`、Lightning Web Components `<lightning-tabset>`。`ma-tabs` 在 token 暗色适配、面板懒加载与手势滚动上做增强，以符合内部设计体系与多端用例。

## 设计目标

- **一致性**：提供 `line`、`segment`、`pill` 三种视觉变体与 `sm`/`md`/`lg` 尺寸阶梯，控制标签间距、指示条宽度、分隔线样式保持品牌一致。
- **语义清晰**：强制使用 `value` 作为唯一索引，覆盖 `orientation`、`activation` 等交互语义属性，避免通过魔数 class 或索引访问。
- **主题友好**：暴露标签前景、背景、指示条、分隔线、面板间距等 CSS token，可在暗色主题和品牌主题下覆写；支持 `prefers-color-scheme` 自动切换。
- **渐进增强**：基础情况下保证鼠标点击切换与面板展示；可按需开启懒渲染、溢出滚动按钮、可关闭标签等能力，并保持良好的键盘与屏幕阅读器体验。

## 组件架构与解剖

- 继承 `ComponentsBase` 并注册为 `customElements.define('ma-tabs', ...)`，采用 `Shadow DOM (open)`；通过 `adoptedStyleSheets` 注入组件样式，暴露 `part="root tablist indicator panels extra"` 以供主题定制。
- Shadow DOM 结构：`<div class="root">` 下包含 `<div class="tablist" role="tablist">`（内部托管 `<slot name="tab">`、溢出按钮、指示条）与 `<div class="panel-host">`（挂载 `<slot name="panel">`），在竖向模式下插入分隔线装饰。
- 配套子组件：`ma-tab`（渲染按钮元素并同步 `role="tab"`、`aria-selected`、`aria-controls`）、`ma-tab-panel`（渲染 `<section role="tabpanel">`，默认 `hidden`），均继承 `ComponentsBase` 并通过共享的 `value` 属性与宿主关联。
- 内置 UI 元素：当 `ma-tab` 标记 `closable` 时自动插入 `ma-icon name="close"`；加载态渲染 `ma-spinner`；溢出滚动时显示前/后跳转按钮并触发 `ma-tabs-scroll` 事件。
- 属性与事件同步：宿主监听 `slotchange`、`MutationObserver` 更新内部索引，使用 requestAnimationFrame 对 `indicator` 做平滑过渡；公共属性 setter 会更新 Shadow DOM 并通过 `CustomEvent` 冒泡通知外部。

## 快速上手

```html
<ma-tabs value="overview" appearance="line" size="md">
  <ma-tab slot="tab" value="overview" icon="dashboard">概览</ma-tab>
  <ma-tab slot="tab" value="insight" badge="2">洞察</ma-tab>
  <ma-tab slot="tab" value="settings" closable>设置</ma-tab>
  <button slot="extra" class="create-button">
    <ma-icon name="add"></ma-icon>新建
  </button>

  <ma-tab-panel slot="panel" value="overview">
    <ma-layout>
      <!-- ... -->
    </ma-layout>
  </ma-tab-panel>
  <ma-tab-panel slot="panel" value="insight">
    <!-- 数据洞察 -->
  </ma-tab-panel>
  <ma-tab-panel slot="panel" value="settings" lazy>
    <!-- 设置内容 -->
  </ma-tab-panel>
</ma-tabs>
```

```javascript
const tabs = document.querySelector('ma-tabs');

tabs.addEventListener('ma-change', (event) => {
  const { value, previousValue, userInitiated } = event.detail;
  console.log('active tab ->', value, 'from', previousValue, userInitiated);
});

tabs.addEventListener('ma-tab-close', (event) => {
  console.log('tab closed', event.detail.value);
});

tabs.value = 'insight';
tabs.select('settings');
```

## 插槽 (Slots)

- `tab` 插槽：放置 `ma-tab` 子组件，遵循插入顺序生成索引；支持插入 `ma-tab-group`（未来增强）实现分组。
- `panel` 插槽：放置 `ma-tab-panel`，通过 `value` 匹配标签；支持懒加载与延迟卸载。
- `extra` 插槽：位于标签尾部，可放置搜索、按钮或更多操作；当不存在内容时不渲染容器。

| 插槽名  | 内容期望                          | 默认行为                         | 备注                                               |
| ------- | --------------------------------- | -------------------------------- | -------------------------------------------------- |
| tab     | `ma-tab` 或实现 `ITabLike` 接口的节点 | 未提供时组件不渲染任何标签       | 必须提供 `value` 唯一标识                          |
| panel   | `ma-tab-panel`                    | 未匹配时面板区域保持空态显示     | 同名 `value` 的面板互斥显示，可开启懒渲染          |
| extra   | 操作按钮 / 输入组件               | 缺省时不占位                     | 与 `stretch` 组合时自动分隔，支持 `part="extra"` 定制 |

## HTML 属性

### `ma-tabs`

| 属性            | 取值                                       | 默认值     | 用途                                                      | 对标参考                         |
| --------------- | ------------------------------------------ | ---------- | --------------------------------------------------------- | -------------------------------- |
| `value`         | 任意字符串（需唯一）                       | 首个标签值 | 当前激活标签的标识，支持属性反射与受控模式               | Material `<md-tabs value>`       |
| `orientation`   | `horizontal` \| `vertical`                | `horizontal` | 控制标签排列方向与键盘导航规则                           | Ant Design `tabPosition`         |
| `appearance`    | `line` \| `segment` \| `pill`            | `line`     | 切换视觉样式（底部指示条、分段卡片、胶囊）                | Carbon `Tabs` variant            |
| `size`          | `sm` \| `md` \| `lg`                     | `md`       | 控制标签高度、字体字号与间距                              | Lightning `variant` + size       |
| `activation`    | `auto` \| `manual`                        | `auto`     | 键盘导航时是否立即激活（`auto`）或等待 Enter（`manual`） | WAI-ARIA Authoring Practices     |
| `stretch`       | boolean (存在即启用)                       | `false`    | 使标签平均分配可用宽度，适用于导航型标签                  | Fluent UI `aria-setsize`         |
| `panel-lazy`    | boolean                                    | `false`    | 启用懒渲染：未激活面板不会挂载；与单个 `ma-tab-panel[lazy]` 组合 | Chakra `isLazy`                  |
| `tab-align`     | `start` \| `center` \| `end` \| `justify` | `start`    | 控制横向对齐方式                                          | Ant Design `tabBarGutter` + `centered` |
| `overflow`      | `auto` \| `scroll` \| `wrap`             | `auto`     | 溢出策略：自动显示滚动按钮、始终滚动或换行               | Material scrollable tabs         |
| `disable-indicator` | boolean                               | `false`    | 隐藏活动指示条，用于纯按钮分组场景                        | Semantic UI pointing tab         |

> 属性与原生 DOM 属性完全同步，`value`/`orientation` 等 setter 会触发内部状态重算并更新 `aria` 属性。违反唯一性的 `value` 会在开发模式抛出警告。

### `ma-tab`

| 属性        | 取值                                     | 默认值  | 用途                                                | 对标参考                    |
| ----------- | ---------------------------------------- | ------- | --------------------------------------------------- | --------------------------- |
| `value`     | 任意字符串（需唯一）                      | -       | 对应 `ma-tabs.value`，确定标签与面板映射            | Material `md-primary-tab`   |
| `label`     | 任意字符串                               | 文本节点 | 显式设置标签文本，优先级高于 `textContent`          | Ant Design `tab`            |
| `icon`      | 内置图标 ID                              | -       | 在标签前渲染图标                                    | Lightning `icon-name`       |
| `badge`     | 数字/字符串                              | -       | 右上角徽标，支持小型计数或提示                      | Carbon `Tab` badge          |
| `disabled`  | boolean                                  | `false` | 禁用交互并同步 `aria-disabled`                      | 所有对标通用                |
| `closable`  | boolean                                  | `false` | 显示关闭按钮并派发 `ma-tab-close`                   | Ant Design closable tabs    |
| `loading`   | boolean                                  | `false` | 展示加载指示并阻断点击                              | Fluent UI `PivotItem`       |
| `tooltip`   | 任意字符串                               | -       | 提供长文本提示，映射到 `title` 或配合 `ma-tooltip` | 内部规范                    |
| `danger`    | boolean                                  | `false` | 标识危险态标签（红色指示条）                        | 设计系统要求                |

### `ma-tab-panel`

| 属性           | 取值                       | 默认值  | 用途                                                   | 对标参考                   |
| -------------- | -------------------------- | ------- | ------------------------------------------------------ | -------------------------- |
| `value`        | 任意字符串                 | -       | 与 `ma-tab` 的 `value` 匹配以决定显示状态              | WAI-ARIA tabpanel          |
| `lazy`         | boolean                    | `false` | 控制该面板是否在首次激活时才渲染内容                   | Chakra Tabs                |
| `unmount-on-exit` | boolean                 | `false` | 每次切换后卸载内容，适合重置内部表单或高内存页面       | React Tabs `unmount`       |
| `padding`      | `none` \| `xs` \| `sm` \| `md` | `md`    | 统一面板内边距，映射到 CSS token                       | 内部布局规范               |
| `aria-label`   | 任意字符串                 | -       | 自定义辅助技术朗读文案（当标签为空）                   | WAI-ARIA                   |

> `ma-tab`/`ma-tab-panel` 支持透传任意原生 ARIA 属性，宿主会在连接时同步 `aria-controls` 与 `aria-labelledby`。

### JavaScript 属性访问器

```javascript
const tabsEl = document.querySelector('ma-tabs');

tabsEl.value = 'insight';
tabsEl.orientation = 'vertical';
tabsEl.stretch = true;

const analyticsTab = tabsEl.getTab('analytics');
analyticsTab.badge = '●';

const activePanel = tabsEl.activePanel; // => ma-tab-panel
```

- 所有属性均通过 getter/setter 与属性反射保持同步；设置重复 `value` 会阻止更新并抛出 `DOMException`。
- 当宿主属性变化时，`ma-tab` 与 `ma-tab-panel` 内部会调用 `syncWithHost()` 更新 Shadow DOM 状态并保证与框架状态管理兼容。
- `activeTab`、`activePanel` 只读返回当前激活节点，便于宿主进行布局或滚动控制。

## 自定义事件

| 事件名           | 触发时机                                     | 事件负载                                                                                 | 事件选项                          |
| ---------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| `ma-before-change` | 用户或脚本试图切换标签（可取消）              | `{ value, previousValue, tab, panel, userInitiated }`                                     | { bubbles: true, composed: true, cancelable: true } |
| `ma-change`      | 激活标签切换完成并更新指示条                   | `{ value, previousValue, tab, panel, userInitiated }`                                     | { bubbles: true, composed: true } |
| `ma-tab-close`   | 用户点击可关闭标签的关闭按钮                   | `{ value, tab, action: 'request-close' }`; 监听方可移除对应节点                         | { bubbles: true, composed: true } |
| `ma-tabs-scroll` | 滚动或溢出状态变化                             | `{ scrollPosition, canScrollPrev, canScrollNext }`                                        | { bubbles: true, composed: true } |

- 为避免重复派发，组件对同值切换做去抖处理；脚本重复设置相同 `value` 不会触发事件。
- 当 `ma-before-change` 被阻止时，组件保持原状态，并在调试模式输出原因，便于与路由守卫协作。

## 公共方法

- `focus(): void` — 将焦点置于当前激活标签，若被禁用则跳转到下一个可用标签。
- `blur(): void` — 移除当前标签焦点，保持激活状态不变。
- `click(): void` — 模拟点击当前激活标签，触发 `ma-change`，遵守禁用/加载态保护。
- `select(value: string, options?: { force?: boolean, animated?: boolean }): void` — 切换到指定标签；`force` 可跳过 `ma-before-change`，`animated` 控制指示条过渡。
- `getTab(value: string): MaTab | null` — 返回匹配的 `ma-tab` 实例，便于外部更新徽标等状态。
- `scrollTabIntoView(value: string, options?: ScrollIntoViewOptions): void` — 将标签滚动到可视区域，结合溢出场景使用。

> 额外方法保持幂等：不存在的 `value` 会抛出开发警告而不破坏当前状态。

## 状态与交互细节

- **Hover/Active**：`line` 模式下 hover 展示浅色底纹与指示条预览；`segment`/`pill` 模式使用阴影与背景色。指示条使用 CSS `transform` 平滑过渡，阻止多次重绘。
- **Disabled**：禁用标签降饱和并阻断 `pointer`、`keyboard` 事件，保留在 DOM 中便于布局；屏幕阅读器朗读为“不可用”。
- **Loading**：标签展示 `ma-spinner` 替换标签文本，指示条保持原位置且点击无效；宿主可通过 `aria-live="polite"` 提示加载状态。
- **Focus-visible**：使用 outline token 与指示条放大结合，满足无障碍规范；键盘导航支持 `ArrowLeft/Right/Up/Down`、`Home/End`、`PageUp/PageDown` 与 `Ctrl+PageUp/PageDown`（横向）。
- **Danger**：`danger` 标签使用强调色与警示图标，可与 `ma-badge` 协同显示数量；hover 时提供背景渐变提示。
- **Overflow**：当标签宽度超出容器且 `overflow="auto"` 时，自动展示前后滑动按钮并允许鼠标滚轮与触控板滚动；移动端支持 swipe 手势切换。

## 样式与主题定制

### 样式变量一览

| 变量名                            | 默认值                         | 作用                                         |
| --------------------------------- | ------------------------------ | -------------------------------------------- |
| `--ma-tabs-tab-color`             | `var(--ma-color-text-primary)` | 标签未选中前景色                             |
| `--ma-tabs-tab-color-active`      | `var(--ma-color-text-strong)`  | 激活标签前景色                               |
| `--ma-tabs-tab-background`        | `transparent`                  | 标签背景（segment/pill 模式使用）            |
| `--ma-tabs-tab-background-active` | `var(--ma-color-surface-emphasis)` | 激活标签背景色                           |
| `--ma-tabs-indicator-color`       | `var(--ma-color-brand-500)`    | 指示条颜色                                   |
| `--ma-tabs-indicator-thickness`   | `2px`                          | 指示条厚度                                   |
| `--ma-tabs-divider-color`         | `var(--ma-color-border-subtle)` | tablist 与面板之间分隔线颜色                |
| `--ma-tabs-tab-gap`               | `0.75rem`                      | 标签间水平间距                               |
| `--ma-tabs-tab-padding-sm`        | `0.375rem 0.75rem`             | 不同尺寸标签内边距                           |
| `--ma-tabs-tab-padding-md`        | `0.5rem 1rem`                  |                                              |
| `--ma-tabs-tab-padding-lg`        | `0.75rem 1.25rem`              |                                              |
| `--ma-tabs-panel-padding`         | `1rem`                         | 面板默认内边距                               |
| `--ma-tabs-shadow-focus`          | `0 0 0 2px var(--ma-color-focus-ring)` | 焦点可见轮廓                       |
| **尺寸（size）**                  |                                |                                              |
| `--ma-tabs-height-sm`             | `2rem`                         | tab 高度                                     |
| `--ma-tabs-height-md`             | `2.5rem`                       |                                              |
| `--ma-tabs-height-lg`             | `3rem`                         |                                              |
| **语义色彩**                      |                                |                                              |
| `--ma-tabs-danger-color`          | `var(--ma-color-danger-600)`   | 危险态标签色                                 |
| `--ma-tabs-badge-color`           | `var(--ma-color-accent-500)`   | 徽标背景色                                   |

### 定制策略

```css
:root[data-theme='dark'] {
  --ma-tabs-tab-color: var(--ma-color-text-muted);
  --ma-tabs-tab-color-active: var(--ma-color-text-invert);
  --ma-tabs-indicator-color: var(--ma-color-brand-300);
  --ma-tabs-divider-color: color-mix(in srgb, var(--ma-color-surface-100) 40%, transparent);
}

ma-tabs[appearance='pill'][data-tone='success'] {
  --ma-tabs-tab-background-active: var(--ma-color-success-50);
  --ma-tabs-indicator-color: var(--ma-color-success-500);
}

.dashboard-tabs {
  --ma-tabs-tab-gap: 0.5rem;
  --ma-tabs-panel-padding: 1.5rem;
}
```

## 可访问性建议

- 标准模式下组件自动注入 `role="tablist"`、`role="tab"`、`role="tabpanel"`，并维护 `aria-selected`、`aria-controls`、`aria-labelledby` 与 `tabindex`，确保屏幕阅读器正确分组朗读。
- 建议为每个标签提供简短文本或 `aria-label`，避免仅使用图标；徽标/图标应设置 `aria-hidden="true"`。
- 暗色主题与 `danger` 语义需保证对比度达 WCAG 4.5:1；指示条与背景组合需通过设计验收。
- 键盘导航遵循 WAI-ARIA 规范：左右方向键在标签间循环，Home/End 跳转首尾，`Ctrl + PageUp/PageDown` 用于跨容器切换。
- 当使用懒渲染时，确保初次加载面板内存在 `aria-live` 或骨架屏提示，避免空白内容困惑用户。

## 与设计系统的协作建议

1. **命名收敛**：设计稿中标签命名与 `value` 保持一致；当出现多层标签时以 `namespace:child` 形式命名，便于埋点与测试。
2. **操作分组**：将全局操作放入 `extra` 插槽，避免与标签混淆；需要固定操作时配合 `ma-layout` 的 `slot="actions"`。
3. **反馈节奏**：切换标签时动画时长不超过 200ms，并与面板内容加载骨架同步；危险态或错误提示需搭配 toast 或 inline message，避免仅靠颜色。

## 后续演进路线（Roadmap）

- 支持标签拖拽排序与溢出菜单折叠（`more` 模式）。
- 引入层叠标签（secondary tabs）与响应式折叠为下拉列表的能力。
- 与路由系统集成的 declarative API（基于 `href` 与 `router-link`）与历史记录同步。
- 探索与 `ma-stepper` 协作的多步流程模式，统一交互语言。

## 浏览器兼容性

- 目标浏览器：Chrome 88+、Edge 88+、Firefox 85+、Safari 14+，移动端覆盖 iOS 14+ Safari 与 Android Chrome。
- IE 浏览器不支持；如需兼容必须由宿主引入 Web Components polyfill (`@webcomponents/webcomponentsjs`) 与 `ResizeObserver` polyfill。
- 溢出滚动依赖 `ResizeObserver` 与 `IntersectionObserver`；在不支持的环境中回退为无指示条的自动换行模式。

## 测试规约（Test Spec）

### 测试范围

- 属性与反射：`value`、`orientation`、`appearance`、`size`、`activation`、`stretch`、`panel-lazy`、`overflow`。
- 子组件属性：`ma-tab` 的 `disabled`、`closable`、`loading`、`badge`，`ma-tab-panel` 的 `lazy`、`unmount-on-exit`。
- 事件：`ma-before-change`、`ma-change`、`ma-tab-close`、`ma-tabs-scroll`。
- 方法：`select()`、`getTab()`、`scrollTabIntoView()`、`focus()`。
- Shadow DOM 结构与 `part` 暴露、指示条定位、溢出按钮显示逻辑。
- 可访问性：ARIA 属性同步、键盘导航顺序、焦点可见样式。
- 主题 token：不同 `appearance`/`size` 下 CSS 变量是否取值正确，并支持暗色皮肤。

### 测试环境与前置条件

- 测试框架：Jest + `@webcomponents/webcomponentsjs` polyfill + `@testing-library/dom`。
- 需要在测试入口引入 `import './ma-tabs'; import './ma-tab'; import './ma-tab-panel';`。
- 使用 `ResizeObserver`、`IntersectionObserver` mock 控制溢出与懒加载场景；动画通过 `jest.useFakeTimers()` 控制。

### 功能用例矩阵

| 用例 ID | 场景                               | 步骤概述                                                                 | 期望结果 |
| ------- | ---------------------------------- | ------------------------------------------------------------------------ | -------- |
| TS01    | 默认渲染                           | 创建 `ma-tabs`，插入三个标签与面板                                      | 第一个标签激活；指示条定位正确；面板与标签关联 |
| TS02    | 属性反射                           | 设置 `tabs.value = 'settings'` 并观察属性                               | 属性写入 DOM；对应面板展示；触发 `ma-change` |
| TS03    | 键盘导航（auto 模式）             | 焦点置于第一个标签，按 `ArrowRight`                                     | 焦点与激活同步移动；`ma-change.userInitiated === true` |
| TS04    | 键盘导航（manual 模式）           | 设置 `activation='manual'`，重复 TS03                                   | 焦点移动但未派发 `ma-change`，按 Enter 后才切换 |
| TS05    | 溢出滚动                          | 设置固定宽度并插入多个标签，模拟滚动                                   | `ma-tabs-scroll` 触发；溢出按钮可用状态正确 |
| TS06    | 懒渲染面板                        | 给面板加 `lazy`，切换标签                                               | 首次激活时才挂载 DOM；离开后保持内容（除非 `unmount-on-exit`） |
| TS07    | 可关闭标签                         | 点击 `closable` 标签的关闭按钮                                         | 派发 `ma-tab-close`，无异常；外部移除后组件重算激活项 |
| TS08    | Loading 状态                       | 设置 `ma-tab.loading = true`                                           | 显示 spinner；阻断点击；ARIA 状态提示 |
| TS09    | 主题变量                           | 覆写自定义属性并刷新                                                    | 渲染样式匹配自定义值；无 console error |
| TS10    | API 方法                           | 调用 `select('insight', { animated: false })`                          | 直接切换且指示条无动画；`ma-change.userInitiated === false` |

### 边界与回归检查

- 重复 `value` 提示与回退逻辑；空 `tab` 插槽时的降级提示。
- `ma-before-change` 被取消时状态不变且不会派发 `ma-change`。
- 懒渲染与 `unmount-on-exit` 组合时，多次切换不会泄漏 DOM。
- 在 `orientation='vertical'` + `stretch` 场景下布局与分隔线是否正确。
- 面板内聚焦元素切换后返回标签栏时焦点是否复位（避免焦点丢失）。

### 无障碍与语义

- 验证 `aria-selected`、`aria-controls`、`aria-labelledby` 与 `tabindex` 在属性变更时同步。
- 检查 `Home/End`、`PageUp/PageDown`、`Ctrl+PageUp/PageDown` 支持情况。
- 测试屏幕阅读器（NVDA/JAWS/VoiceOver）朗读顺序与懒加载面板朗读策略。
- 确保徽标、图标默认 `aria-hidden`，标签 loading 状态提供 `aria-live` 或替代信息。

### 非目标（Out of Scope）

- 与浏览器历史或路由直接同步（交由路由层实现）。
- 拖拽排序、标签分组折叠的交互（纳入后续路线）。
- 动画时间轴自定义与第三方手势库集成（需独立需求评估）。



