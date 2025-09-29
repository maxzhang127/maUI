# ma-icon API 设计

`ma-icon` 是遵循 Web Components 规范封装的矢量图标渲染控件，用于在应用中呈现统一的图形语言，并与 `ma-button`、`ma-layout` 等控件协同表达状态与反馈。

## 背景与对标

- 主要使用场景：操作按钮前缀/后缀图标、通知与状态反馈、导航菜单标识、表单校验结果与空状态插图缩略版。
- 用户痛点：项目混用字体图标与散落的 SVG 文件导致视觉不统一、尺寸难以控制、暗色模式适配成本高；图标缺少语义标签，屏幕阅读器对装饰性图标处理困难。
- 对标对象：Material Symbols `<md-icon>`、Chakra UI `<Icon>`、Carbon `<cds-icon>` 等库。`ma-icon` 在无障碍默认值、主题化 token、运行时更新能力上做了本地化增强，以便满足内部设计系统的连续演进。

## 设计目标

- **一致性**：预设尺寸阶梯与色彩语义映射，保证跨页面的图标视觉密度与基线对齐统一。
- **语义清晰**：采用 `name`/`set`/`tone` 等语义化属性，避免魔法类名；与设计稿命名保持一一对应，降低沟通成本。
- **主题友好**：通过 CSS 自定义属性暴露尺寸、颜色、描边厚度等关键 token，支持品牌色与亮/暗主题切换。
- **渐进增强**：默认支持内置 sprite 与外部 `src` 两种加载模式，提供 loading/error 事件便于宿主兜底，可按需懒加载或替换为自定义插槽。

## 组件架构与解剖

- 继承 `ComponentsBase`，使用 `Shadow DOM (open)` 以隔离样式，同时暴露 `part="wrapper"`、`part="icon"` 供外部定制。
- DOM 结构：`<span class="icon-wrapper" part="wrapper">` 内部根据来源渲染 `<svg part="icon">` 或 `<img part="icon">`。当缺少图标时渲染占位 `<span part="placeholder">`。
- 引入轻量图标注册表（`IconStore`）与 sprite 缓存，`name`/`set` 属性映射到内置路径；`src` 会通过 `fetch` 内联 SVG，缓存后复用。
- 自定义事件用于同步加载状态；属性 setter 会触发重新渲染并保持与 DOM/Shadow DOM 一致。

## 快速上手

```html
<!-- 使用内置 sprite -->
<ma-icon name="download"></ma-icon>

<!-- 带语义色彩与尺寸 -->
<ma-icon name="check-circle" tone="success" size="lg" label="已通过"></ma-icon>

<!-- 外部 SVG 资源，装饰性用法 -->
<ma-icon src="/assets/icons/file-pdf.svg" size="xl" decorative></ma-icon>
```

```javascript
const statusIcon = document.querySelector('#status-icon');

statusIcon.name = 'cloud-upload';
statusIcon.tone = 'primary';

statusIcon.addEventListener('ma-load', (event) => {
  console.log('icon ready', event.detail.source);
});

statusIcon.addEventListener('ma-error', (event) => {
  console.warn('fallback icon rendered', event.detail);
});
```

## 插槽 (Slots)

- 默认插槽：允许直接传入自定义 `<svg>` 或 `<img>` 内容。当 `name`/`src` 未提供或加载失败时可作为兜底内容；内部不会改写插槽节点，只包裹在 `icon-wrapper` 中以保持对齐。
- 典型场景：用于实验性图标或第三方品牌 logo，避免提前注册到 sprite。

| 插槽名  | 内容期望                 | 默认行为                    | 备注                         |
| ------- | ------------------------ | --------------------------- | ---------------------------- |
| default | 单个 `<svg>`/`<img>` 节点 | 未提供时会渲染默认占位符 ⚠ | 插槽与 `name`/`src` 互斥优先 |

## HTML 属性

| 属性         | 取值                                           | 默认值  | 用途                                                                 | 对标参考                          |
| ------------ | ---------------------------------------------- | ------- | -------------------------------------------------------------------- | --------------------------------- |
| `name`       | 符合 kebab-case 的内置图标 ID                  | `''`    | 指向内置 sprite 的图标资源，配合 `set` 映射到命名空间。             | Material Symbols `md-icon`        |
| `set`        | `system` \| `outlined` \| `filled` \| 自定义集 | `system` | 切换不同权重/风格的图标集合，支持按需扩展命名空间。                 | Carbon Icons `set`                |
| `src`        | 绝对/相对 URL                                  | -       | 加载外部 SVG 或图片资源，适用于品牌图标或临时资源。                 | Lightning Design System `<svg>`   |
| `size`       | `xxs` \| `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md`    | 控制图标盒子尺寸与基线对齐，映射到 CSS token。                       | Chakra UI `boxSize`               |
| `tone`       | `default` \| `muted` \| `primary` \| `success` \| `warning` \| `danger` | `default` | 对应设计语义色彩，自动切换填充或描边颜色。                         | Carbon、Ant Design 状态色         |
| `label`      | 任意字符串                                       | `''`    | 为信息性图标提供可读标签，映射到 `aria-label` 并设置 `role="img"`。 | Material Design 无障碍建议        |
| `decorative` | boolean attribute                               | -       | 标记图标仅为装饰用途，组件会设置 `aria-hidden="true"`。             | Carbon Icons `aria-hidden` 方案   |
| `mirrored`   | boolean attribute                               | -       | 在 RTL 环境水平翻转图标，用于方向性图标。                           | Material Symbols `rtl`            |
| `rotation`   | `0` \| `90` \| `180` \| `270`                  | `0`     | 旋转图标，用于重复利用单个箭头图形。                               | Fluent UI `rotate`                |
| `lazy`       | boolean attribute                               | -       | 延迟外部资源加载，进入视窗时再触发 `fetch`。                        | Ionic `ion-img`                   |

> 所有标准 `aria-*`、`data-*` 属性会透传到根节点，`part` 属性可用于定点覆写 Shadow DOM 内部样式。

### JavaScript 属性访问器

```javascript
const icon = document.querySelector('ma-icon');

icon.name = 'calendar';
icon.tone = 'muted';
icon.size = 'sm';
icon.decorative = false;

await icon.load(); // 确认远程资源已注入 Shadow DOM
```

- Setter 会调用内部的 `resolveIcon`，保持 Shadow DOM 与属性同步，并在必要时触发 `ma-load`/`ma-error`。
- 布尔属性遵循存在即真、移除为假的语义；与 `setAttribute/removeAttribute` 互通，便于框架式绑定。

## 自定义事件

| 事件名    | 触发时机                                   | 事件负载                                                     | 事件选项                          |
| --------- | ------------------------------------------ | ------------------------------------------------------------ | --------------------------------- |
| `ma-load` | 图标成功解析并插入 Shadow DOM 后           | `{ name, set, source: 'sprite' | 'src' | 'slot', fromCache }` | { bubbles: true, composed: true } |
| `ma-error`| 图标加载失败并回落到占位或插槽内容时       | `{ name, set, src, error }`                                  | { bubbles: true, composed: true } |

- 事件防抖：同一次渲染只会派发一次 `ma-load`，重新设置资产时会先执行降噪再触发。

## 公共方法

- `load(): Promise<void>` — 强制执行一次资源解析逻辑，返回图标渲染完成的承诺，用于宿主等待远程资源。
- `refresh(): void` — 清理缓存并根据当前属性重新渲染，当 icon 注册表或全局主题 token 更新时调用。
- `getCurrentDescriptor(): IconDescriptor` — 返回当前渲染图标的元数据（`{ name, set, src }`），便于上层调试与埋点。

## 状态与交互细节

- **Decorative**：当存在 `decorative` 属性时自动设置 `aria-hidden="true"` 与移除 `aria-label`，同时加入 `ma-icon--decorative` class 以便筛选样式。
- **Informative**：提供 `label` 时自动赋予 `role="img"` 并同步 `aria-live="polite"`（可配置），用于状态型提示。
- **Loading/Lazy**：外部资源开启 `lazy` 时初始渲染透明占位，进入视窗后再加载并派发 `ma-load`。
- **Fallback**：当内置 `name` 未命中或 `src` 报错时，优先渲染默认 slot 内容，否则使用占位符（带虚线边框 SVG）提示缺失。
- **Mirrored/Rotation**：通过添加对应 class 与 CSS transform 实现，不会改写原 SVG path，保证像素级一致性。

## 样式与主题定制

### 样式变量一览

| 变量名                  | 默认值           | 作用                         |
| ----------------------- | ---------------- | ---------------------------- |
| `--ma-icon-size`        | `1.25rem`        | 控制图标盒子宽高             |
| `--ma-icon-color`       | `currentColor`   | 控制填充/描边颜色           |
| `--ma-icon-stroke`      | `1.5px`          | SVG 描边厚度                 |
| `--ma-icon-transition`  | `120ms ease-out` | 颜色与变形的过渡动画         |
| **尺寸（size）**        |                  |                              |
| `--ma-icon-size-xs`     | `0.75rem`        | `xs` 预设尺寸                |
| `--ma-icon-size-sm`     | `1rem`           | `sm` 预设尺寸                |
| `--ma-icon-size-lg`     | `1.5rem`         | `lg` 预设尺寸                |
| **语义色彩**            |                  |                              |
| `--ma-icon-color-default` | `var(--color-fg-muted)` | 默认语义色             |
| `--ma-icon-color-primary` | `var(--color-accent)`   | 主动作语义色             |
| `--ma-icon-color-success` | `var(--color-success)`  | 成功状态色               |
| `--ma-icon-color-warning` | `var(--color-warning)`  | 警告状态色               |
| `--ma-icon-color-danger`  | `var(--color-danger)`   | 错误状态色               |

### 定制策略

```css
:root[data-theme='dark'] {
  --ma-icon-color-default: var(--color-fg-inverted-muted);
  --ma-icon-color-primary: var(--color-accent-strong);
}

ma-icon[tone='success'] {
  --ma-icon-color: var(--ma-icon-color-success);
}

.dashboard-card ma-icon[mirrored]::part(icon) {
  transform: scaleX(-1);
}
```

## 可访问性建议

- 所有信息性图标必须传入 `label`，或在附近提供屏幕阅读器可读的文本；装饰性图标应设置 `decorative` 以避免重复朗读。
- 保持图标与背景之间达到 WCAG 2.1 AA 对比度（至少 3:1），尤其在 `muted` 与暗色主题中。
- 旋转、翻转等视觉状态变更应伴随可感知的辅助文案或 `aria-live` 更新，避免仅依赖动画提示。
- 对加载/错误状态提供额外视觉与语义反馈（例如 tooltip 或文本），保障不同能力用户均可理解。

## 与设计系统的协作建议

1. **命名收敛**：设计稿上的图标标识统一采用 `set/name` 组合，生成切图与开发使用同一份清单。
2. **操作分组**：在导航、工具栏等场景优先通过 `ma-icon` + `ma-button` 组合，保持间距与对齐规范一致。
3. **反馈节奏**：状态切换时同步更新语义色与文案，避免仅用颜色传达成功/错误，必要时配合轻量过渡动画。

## 后续演进路线（Roadmap）

- 扩展动画能力（如脉冲、旋转）并提供 `tone='interactive'` 的可控动效。
- 支持多色 SVG 与 `filled/outline` 动态切换，减少重复资源。
- 引入构建时 icon manifest，结合 tree-shaking 减少生产包体积。
- 探索与 Lottie/SVG 动画的集成，满足空状态/品牌动效需求。

## 浏览器兼容性

- 目标浏览器：Chrome 80+、Firefox 78+、Safari 13+、Edge 88+。
- IE 不在支持范围；如需兼容需由宿主引入 Web Components polyfill 与 SVG 内联降级方案。
- 外部资源加载依赖 `IntersectionObserver`（用于 `lazy`），低版本需通过 polyfill 补齐。

## 测试规约（Test Spec）

### 测试范围

- 属性/属性反射：`name`、`set`、`size`、`tone`、`label`、`decorative`、`mirrored`、`rotation`、`lazy`。
- 事件：`ma-load`、`ma-error` 的触发条件、负载字段与事件选项。
- 方法：`load()`、`refresh()`、`getCurrentDescriptor()` 的行为与副作用。
- Shadow DOM 结构：`part`、class、占位符与插槽优先级。
- 样式 token：不同 `size`/`tone` 下 CSS 变量取值是否正确映射。

### 测试环境与前置条件

- 测试框架：Jest + `jest-environment-jsdom`。
- Polyfill：必要时引入 `@webcomponents/webcomponentsjs` 与 `intersection-observer`。
- 初始化：`import './ma-icon';`，通过 `document.createElement('ma-icon')` 实例化。
- 对外部资源测试使用 `fetch` mock，模拟成功、失败与缓存命中场景。

### 功能用例矩阵

| 用例 ID | 场景                         | 步骤概述                                                     | 期望结果 |
| ------- | ---------------------------- | ------------------------------------------------------------ | -------- |
| TS01    | 默认渲染                     | 创建元素并挂载 DOM                                           | Shadow DOM 存在 `icon-wrapper`；默认占位元素渲染；`aria-hidden` 为 `true` |
| TS02    | name + set 渲染              | 设置 `name='download'`、`set='system'`                       | 内联 SVG 注入，派发一次 `ma-load`，`detail.source === 'sprite'` |
| TS03    | tone 与 size                 | 设置不同 `tone`、`size`                                      | 根节点包含对应 class；`--ma-icon-size`、`--ma-icon-color` 被更新 |
| TS04    | 外部 src 成功                | 设置 `src` 并 mock fetch 成功                                | Shadow DOM 渲染 fetched SVG；`ma-load` 触发一次；`fromCache === false` |
| TS05    | 外部 src 失败 fallback       | 模拟 fetch 拒绝                                              | 渲染占位符或默认插槽内容；派发 `ma-error` 且不再派发 `ma-load` |
| TS06    | 插槽优先级                   | 设置默认插槽 + `name`                                        | 插槽内容优先展示；无网络请求；`detail.source === 'slot'` |
| TS07    | decorative/label 无障碍      | 切换 `decorative` 与 `label`                                 | 组件正确设置/移除 `aria-hidden`、`aria-label`、`role` |
| TS08    | mirrored/rotation            | 设置 `mirrored`、`rotation='90'`                             | `transform` 应用正确；`getComputedStyle` 验证旋转/翻转 |
| TS09    | lazy 加载                    | 开启 `lazy` 并模拟进入视窗                                   | 初始不触发 `fetch`；进入视窗后才加载并触发事件 |
| TS10    | refresh 方法                 | 先渲染后更新 icon registry，再调用 `refresh()`               | 组件重新解析资源并派发一次新的 `ma-load` |
| TS11    | getCurrentDescriptor         | 调用 `getCurrentDescriptor()`                                 | 返回与当前渲染一致的 `{ name, set, src }` 信息 |
| TS12    | 事件降噪                     | 连续将 `name` 设置为相同值                                   | 仅第一次触发 `ma-load`；后续不重复派发 |

### 边界与回归检查

- 无效 `name`/`set` 组合时是否正确降级到占位而不抛异常。
- `src` 指向非 SVG（如 PNG）时的渲染兼容性与尺寸换算。
- 重复定义自定义元素的保护（确保 `customElements.define` 只执行一次）。
- 暗色主题切换时 `tone` 颜色是否同步刷新；`refresh()` 能否正确复用缓存。

### 无障碍与语义

- 确认 `decorative` 场景下屏幕阅读器不朗读；信息性图标朗读 `label`。
- 验证 `ma-load` 触发后对 `aria-live` 的更新不会导致过度打扰。
- 检查 `role` 与 `aria` 属性在属性变更时同步更新。

### 非目标（Out of Scope）

- 复杂图标动画（由后续路线图覆盖）。
- 与第三方图标字体文件的自动转换流程。
- IE/老旧浏览器的特殊兼容策略（需要独立需求评估）。

