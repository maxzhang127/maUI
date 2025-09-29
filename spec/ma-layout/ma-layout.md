# ma-layout API 设计

`ma-layout` 是一个页面级布局容器，负责组织头部、侧边导航、主体内容和底部区域，帮助中后台和多窗口场景快速构建一致的应用骨架。组件聚焦结构与状态管理，视觉表现通过设计令牌与主题系统统一控制。

## 背景与对标

中后台、数据分析工作台与内容管理系统的页面通常包含头部导航、侧边导航、内容区和辅助信息区域，需要在桌面宽屏、笔记本窄屏与嵌套容器中保持稳定的骨架结构。传统做法依赖定制 CSS 与 Flex/Grid 拼装，容易出现语义分裂、间距不一致与响应式断层问题。
`ma-layout` 对标 Ant Design `Layout`、Material UI 的 `App Layout` 模式以及 Shoelace `sl-layout`。相较竞品，组件内建命名插槽语义、响应式断点侦测与可插拔的折叠逻辑，避免在业务层反复处理布局粘性、侧栏收起、滚动同步等细节。

## 设计目标

- **一致性**：内置头部、次级头部、侧栏、内容与底部五大区域的排列与间距规则，跨页面呈现统一的结构与反馈。
- **语义清晰**：属性命名贴合布局术语（如 `has-sider`、`sider-position`、`sticky-header`），并通过 `data-state` 与 `part` 暴露状态，方便定位与扩展。
- **主题友好**：基于 CSS 自定义属性暴露背景、间距、边框、阴影等设计令牌，支持品牌主题与暗色模式快速切换。
- **渐进增强**：默认采用 CSS Grid + Flex 组合，保持在支持不足的环境下平稳退化，提供事件与方法扩展更复杂的交互需求。

## 组件架构与解剖

- 基于 `ComponentsBase` 封装，Shadow DOM 设为 `open`，通过 `part="header|subheader|sider|content|footer|toggle"` 供样式覆盖。
- DOM 结构：`<section class="ma-layout">` 作为容器，内部按插槽渲染 `<header part="header">`、`<div part="subheader">`、`<aside part="sider">`、`<main part="content">` 与 `<footer part="footer">`。当 `collapsible` 启用时，会在 `aside` 内追加 `<button part="toggle">` 控制收起/展开。
- Shadow DOM 中使用 CSS Grid 设置 `grid-template-columns`，在 `has-sider` 时预留侧栏宽度；`collapsed` 状态切换为窄列并显示图标模式。内容区包裹在 `div.scroll-container` 中管理滚动与粘性头部。
- 通过 `ResizeObserver` 监听宿主宽度，计算断点并写入 `data-breakpoint`，同时派发 `ma-breakpoint-change`。侧栏折叠动作同步 `collapsed` 属性、更新 `aria-expanded` 并派发 `ma-sider-toggle`。

## 快速上手

```html
<ma-layout id="workspace"
           has-sider
           collapsible
           sider-position="left"
           sticky-header
           padding="comfortable">
  <div slot="header" class="app-header">
    <h1>Analytics</h1>
    <ma-button id="toggle-sider" variant="secondary" size="small" icon="menu-fold">
      折叠导航
    </ma-button>
  </div>

  <div slot="subheader" class="toolbar">
    <ma-breadcrumb></ma-breadcrumb>
    <ma-tabs data-variant="underline">
      <ma-tab value="overview" active>概览</ma-tab>
      <ma-tab value="reports">报表</ma-tab>
      <ma-tab value="alerts">告警</ma-tab>
    </ma-tabs>
  </div>

  <nav slot="sider">
    <ma-nav selected="overview"></ma-nav>
  </nav>

  <section slot="content" class="card-grid">
    <!-- 页面内容 -->
  </section>

  <div slot="footer">© 2025 Modern Apps</div>
</ma-layout>

<!-- 无侧栏的全宽布局 -->
<ma-layout orientation="vertical"
           padding="compact"
           content-scroll="page">
  <header slot="header">文档中心</header>
  <article slot="content">...</article>
</ma-layout>
```

```javascript
const layout = document.querySelector('#workspace');

layout.addEventListener('ma-sider-toggle', (event) => {
  console.info('sider collapsed:', event.detail.collapsed, 'source:', event.detail.source);
});

layout.addEventListener('ma-breakpoint-change', (event) => {
  document.body.dataset.breakpoint = event.detail.breakpoint;
});

document.querySelector('#toggle-sider').addEventListener('click', () => {
  layout.toggleSider('toolbar');
});
```

## 插槽 (Slots)

- 命名插槽决定五大区域的渲染顺序，缺省的插槽会被移除，避免多余留白；`slotchange` 时同步 `data-slot-empty`，便于根据内容决定边框或阴影。
- 默认插槽用于放置面包屑以上层覆盖元素（如浮层、通知中心），会被插入到内容容器之后。

| 插槽名    | 内容期望                         | 默认行为                                                | 备注 |
| --------- | -------------------------------- | ------------------------------------------------------- | ---- |
| `header`  | 页面级头部（logo、搜索、操作区） | 高度自适应；`sticky-header` 时自动 `position: sticky`   | 建议包含 landmark 元素 `<header>` |
| `subheader` | 二级工具条、面包屑、筛选控件   | 若为空则不渲染；在小屏断点会自动堆叠                    | 与 `header` 共享粘性背景 |
| `sider`   | 左/右侧导航、过滤面板           | `has-sider` 时保留宽度；`collapsed` 时切换为图标栏      | 支持 `part="sider-content"` 选择器 |
| `content` | 主内容区域                      | 包裹在 `div.scroll-container`，控制滚动与间距           | 必填；若缺省则抛出警告 |
| `footer`  | 页脚、版权信息                   | `sticky-footer` 时贴底；默认与内容区共享背景            | 可置入 `<footer>` landmark |
| `default` | 覆盖层/浮动内容                 | 渲染在内容区之后，以 `position: relative` 定位          | 可用于浮窗、通知等 |

## HTML 属性

| 属性             | 取值                                        | 默认值        | 用途                                                                 | 对标参考                |
| ---------------- | ------------------------------------------- | ------------- | -------------------------------------------------------------------- | ----------------------- |
| `orientation`    | `vertical` \| `horizontal`                 | `vertical`    | 控制头部与内容的排列方向，横向模式用于分栏布局                       | Ant Design Layout       |
| `has-sider`      | boolean attribute                           | `false`       | 指示存在侧栏，提前分配栅格宽度并控制断点下折叠行为                   | Ant Design Layout       |
| `sider-position` | `left` \| `right`                          | `left`        | 决定侧栏出现在左侧或右侧                                             | Shoelace sl-layout      |
| `collapsible`    | boolean attribute                           | `false`       | 启用内置折叠按钮并处理 `ma-sider-toggle` 事件                       | Ant Design Layout       |
| `collapsed`      | boolean attribute                           | `false`       | 控制侧栏折叠状态，可受控/非受控                                     | Chakra UI Sidebar       |
| `padding`        | `none` \| `compact` \| `comfortable`      | `comfortable` | 统一内容区内边距，映射到设计令牌                                     | Material UI Container   |
| `gap`            | `none` \| `xs` \| `sm` \| `md` \| `lg`  | `md`          | 控制头部、侧栏、内容之间的间隔                                       | Ant Design Space        |
| `content-scroll` | `contain` \| `page` \| `none`             | `contain`     | 决定滚动策略：内部容器滚动、交给页面级滚动或禁用滚动                | Shoelace sl-drawer      |
| `sticky-header`  | boolean attribute                           | `false`       | 将头部（含 `subheader`）设置为粘性，滚动时保持可见                   | Material UI AppBar      |
| `sticky-footer`  | boolean attribute                           | `false`       | 使页脚粘性贴底，适合短内容页面                                      | Ant Design Layout Footer|
| `breakpoints`    | JSON 字符串（如 `{ "sm": 640, ... }` ）   | 预设 640/960/1200 | 自定义响应式断点，重置内置 `ResizeObserver` 比较阈值 | Tailwind Container      |

> 除上述属性外，`ma-layout` 透传标准全局属性（如 `aria-label`、`data-*`）到宿主元素，并自动在 Shadow DOM 中同步 `collapsed`、`sticky-*` 等状态类。

### JavaScript 属性访问器

```javascript
const layout = document.querySelector('ma-layout');

layout.collapsible = true;
layout.collapsed = true;               // 折叠侧栏，同时更新 aria-expanded
layout.padding = 'compact';            // 更新内容区 token
layout.siderPosition = 'right';
layout.breakpoints = { sm: 0, md: 768, lg: 1200 }; // 覆盖默认断点
```

- 所有属性 setter 会调用 `_syncHostState`，在宿主写入属性/布尔反射，并触发一次 `requestUpdate()` 保持 DOM 状态同步。
- `breakpoints` 支持对象或 JSON 字符串写入，内部会排序并缓存；与框架式状态管理协同时，推荐通过属性反射保持声明式写法。

## 自定义事件

| 事件名              | 触发时机                                                 | 事件负载                                              | 事件选项                          |
| ------------------- | -------------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| `ma-sider-toggle`   | 侧栏折叠/展开（按钮点击或调用方法）                      | `{ collapsed: boolean, source: 'toggle'\|'api', width: number }` | { bubbles: true, composed: true } |
| `ma-breakpoint-change` | 宿主宽度跨越定义断点时                                | `{ breakpoint: 'sm'\|'md'\|'lg'\|string, width: number }`       | { bubbles: true, composed: true } |
| `ma-scroll`         | 内容容器滚动，首尾或跨越阈值时                           | `{ position: { top, left, maxTop }, direction: 'up'\|'down' }`     | { bubbles: true, composed: true } |

- 内部节流滚动事件，默认 100ms；可通过 `ma-scroll` 监听避免重复派发。
- 若页面同时监听 `scroll`，注意去重处理，建议在事件负载中合并判断。

## 公共方法

- `toggleSider(source?: string): void` — 切换折叠状态，可传入来源标识用于遥测。
- `collapseSider(): void` — 折叠侧栏，若已折叠则忽略。
- `expandSider(): void` — 展开侧栏，自动聚焦到侧栏首个可聚焦元素。
- `scrollToContent(options?: ScrollToOptions): void` — 将内容容器滚动到指定位置（默认顶部），兼容平滑滚动配置。

> 所有方法调用后都会同步更新 `collapsed` 属性，并派发相应事件。

## 状态与交互细节

- **Collapsed**：侧栏折叠时宽度使用 `--ma-layout-sider-width-collapsed`，补充 tooltip 或 icon-only 模式；折叠时 `aria-expanded="false"`。
- **Sticky Header/Footer**：粘性区域会添加阴影与过渡，在内容滚动超过 8px 时赋予 `data-shadow="true"`，提示层级关系。
- **Responsive**：断点切换时会自动隐藏侧栏（`md` 以下默认折叠），并在宿主写入 `data-breakpoint="sm|md|lg"` 供外部样式使用。
- **Scrollable Content**：`content-scroll="contain"` 时内部容器设置 `overflow: auto`，滚动位置同步到 `ma-scroll`；`page` 模式则移除内部滚动，交给页面级处理。

## 样式与主题定制

### 样式变量一览

| 变量名                               | 默认值              | 作用 |
| ------------------------------------ | ------------------- | ---- |
| `--ma-layout-background`             | `var(--surface-1)`  | 容器背景色 |
| `--ma-layout-color`                  | `var(--text-normal)`| 页内文本/图标默认色 |
| `--ma-layout-border-color`           | `var(--divider)`    | 区域分隔线颜色 |
| `--ma-layout-gap`                    | `24px`              | 区域之间的间隔，对应 `gap` 属性 |
| `--ma-layout-padding`                | `24px`              | 内容区内边距 |
| `--ma-layout-sider-width`            | `256px`             | 侧栏展开宽度 |
| `--ma-layout-sider-width-collapsed`  | `64px`              | 侧栏折叠宽度 |
| `--ma-layout-header-height`          | `56px`              | 头部最小高度 |
| `--ma-layout-shadow`                 | `var(--shadow-sm)`  | 粘性区域阴影 |
| **尺寸（size）**                     |                     |      |
| `--ma-layout-max-content-width`      | `1200px`            | 内容最大宽度（可用于居中） |
| **语义色彩**                         |                     |      |
| `--ma-layout-accent`                 | `var(--brand-500)`  | 侧栏折叠按钮与选中态强调色 |

### 定制策略

```css
:root[data-theme='dark'] {
  --ma-layout-background: #1f2933;
  --ma-layout-border-color: rgba(255, 255, 255, 0.08);
  --ma-layout-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

ma-layout[data-breakpoint='sm'] {
  --ma-layout-gap: 16px;
  --ma-layout-padding: 16px;
}

ma-layout[collapsed]::part(sider) {
  backdrop-filter: blur(12px);
}
```

## 可访问性建议

- 为各插槽内容提供语义化 landmark（`<header>`、`<nav>`、`<main>`、`<footer>`），确保辅助技术能够理解页面结构。
- 折叠按钮需配合 `aria-label` 或文本说明；`collapseSider/expandSider` 会同步 `aria-expanded` 与 `aria-controls` 指向侧栏容器。
- 粘性头部在颜色覆盖时保证 4.5:1 的对比度；为内部滚动容器提供 `tabindex="0"` 与焦点环，便于键盘用户识别滚动区域。
- 加载或禁用侧栏场景请同步 `aria-busy` 或禁用折叠按钮，避免焦点落入不可见区域。

## 与设计系统的协作建议

1. **命名收敛**：设计稿中统一使用 Header/Subheader/Sider/Main/Footer 名称，通过蓝图标注对应 slot，降低交接沟通成本。
2. **操作分组**：结合 `subheader` 插槽展示过滤器、批量操作，与 `ma-toolbar`、`ma-tabs` 等组件形成协同布局策略。
3. **反馈节奏**：约定侧栏折叠/展开的动画时长（建议 160ms）与阴影层级，确保与抽屛、浮层的交互节奏一致。

## 后续演进路线（Roadmap）

- 引入 **分栏模式**（多侧栏/二级侧栏）与 **浮动面板** 支持，扩展到工作流与设计器场景。
- 提供 **布局预设**（如中心列、三栏模板）的 `preset` 属性，简化常见场景选型。
- 集成全局 **跳转焦点指示**（Skip links）与 `prefers-reduced-motion` 动画降级，提升可访问体验。
- 研究与 `ma-drawer`、`ma-split-panel` 的整合能力，支撑多窗口编辑器。

## 浏览器兼容性

- 支持现代浏览器：Chrome 79+、Edge 79+、Firefox 72+、Safari 13.1+。
- 若需兼容旧版（无 Shadow DOM/Custom Elements 支持），可引入 `@webcomponents/webcomponentsjs` polyfill 并降级到 light DOM 模式。
- CSS Grid 是核心依赖；在不支持的环境下 fallback 为 Flex，需配合 `--ma-layout-sider-width` 设置宽度。

## 测试规约（Test Spec）

### 测试范围

- 属性/状态：`orientation`、`has-sider`、`collapsible`、`collapsed`、`padding`、`gap`、`content-scroll`、`sticky-*`、`breakpoints` 的默认值与反射。
- 插槽：渲染顺序、空插槽折叠、`slotchange` 触发与 `data-slot-empty` 同步。
- 侧栏折叠：按钮交互、方法调用、事件派发、宽度变化。
- 响应式断点：`ResizeObserver` 触发、`data-breakpoint` 更新与事件负载。
- 滚动：内部滚动容器行为、`ma-scroll` 事件节流、粘性头部阴影。
- 可访问性：`aria-expanded`、`aria-controls`、landmark 渲染。

### 测试环境与前置条件

- 框架：Jest + `jest-environment-jsdom`。
- Polyfill：通过 `@webcomponents/webcomponentsjs` 注册自定义元素与 Shadow DOM（按需）。
- 初始化：`import './ma-layout';`，每个用例后清理 `document.body` 并断开 `ResizeObserver`。

### 功能用例矩阵

| 用例 ID | 场景                     | 步骤概述                                                        | 期望结果 |
| ------- | ------------------------ | --------------------------------------------------------------- | -------- |
| TS01    | 默认渲染                 | 创建 `<ma-layout>` 并挂载                                     | DOM 包含 header/content/footer part；`orientation='vertical'` |
| TS02    | has-sider 布局           | 设置 `has-sider` + slot `sider`                                | `::part(sider)` 可见；容器 `grid-template-columns` 包含侧栏宽度 |
| TS03    | collapsible 按钮         | 设置 `collapsible` 并点击默认折叠按钮                          | `collapsed` 属性变更；`ma-sider-toggle` detail.collapsed 为 true |
| TS04    | 控制 collapsed 属性      | 通过属性和 setter 切换 `collapsed`                             | 侧栏 class 更新；`aria-expanded` 同步；方法无重复触发 |
| TS05    | orientation=horizontal   | 设置 orientation -> horizontal                                 | `grid-template-rows` 调整，header 在左/右排列 |
| TS06    | sticky-header 生效       | 设置 `sticky-header` 并模拟滚动                                | header 添加 `position: sticky`；滚动超过阈值后 `data-shadow="true"` |
| TS07    | content-scroll=page      | 设置 `content-scroll='page'`                                   | 内部滚动容器移除 `overflow`；`ma-scroll` 不派发 |
| TS08    | breakpoints 自定义       | 修改 `breakpoints` 并触发 `ResizeObserver`                    | `data-breakpoint` 更新为自定义 key；事件 detail.width 匹配 |
| TS09    | scroll 事件节流          | 模拟多次滚动                                                   | 事件触发节流（小于 10 次/秒）；detail.position 含 top/maxTop |
| TS10    | 公共方法 scrollToContent | 调用 `scrollToContent({ top: 200 })`                           | 滚动容器 `scrollTop` 变为 200；可平滑过渡 |
| TS11    | slotchange 反馈          | 动态添加/移除 `subheader` 内容                                 | 容器 `data-slot-empty` 更新；无残留分隔线 |
| TS12    | 可访问性属性             | 启用折叠 -> 检查按钮 attr                                      | 按钮具备 `aria-controls` 指向侧栏 id；`aria-label` 可覆盖 |

### 边界与回归检查

- 无侧栏但误设置 `collapsed` 时组件应忽略并给出告警，保持布局稳定。
- 自定义断点 JSON 解析失败时 fallback 到默认配置并警告，不应阻塞渲染。
- 嵌套布局（Layout 内再嵌套 Layout）时 `ResizeObserver` 应避免循环调用。
- 当内容高度小于视口且 `sticky-footer` 启用，需确认底部粘性策略不影响滚动。

### 无障碍与语义

- 校验内部 landmark 渲染，保证 `<main>` 唯一。
- 侧栏折叠后仍可通过键盘导航触达（焦点序列与 `tabindex`）。
- 粘性头部下 `aria-live` 区域不被遮挡，滚动时可通过 `ma-scroll` 同步隐藏/显示。

### 非目标（Out of Scope）

- 视觉像素级差异（交由视觉回归工具覆盖）。
- 内容区内业务组件的空间治理（由业务自测）。
- 多窗口拖拽、拆分编辑器等高级场景将在后续 Roadmap 评估。
