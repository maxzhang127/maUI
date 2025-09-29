# {{组件名}} API 设计

<!-- 用 1-2 句概述组件定位与在产品中的角色 -->

## 背景与对标

- TODO: 说明主要使用场景、用户痛点。
- TODO: 列出对标的参考组件（组件库或竞品）与关键差异。

## 设计目标

- **一致性**：TODO: 描述视觉/交互一致性的要求。
- **语义清晰**：TODO: 解释属性命名、优先级表达。
- **主题友好**：TODO: 标注设计令牌与主题扩展方式。
- **渐进增强**：TODO: 说明默认行为与可扩展点。

## 组件架构与解剖

- TODO: 指出继承/基础类与 Shadow DOM 策略。
- TODO: 绘制或描述 DOM 结构、关键节点 class/part。
- TODO: 说明内置 UI 元素（icon、spinner 等）的插入逻辑。
- TODO: 列出向外暴露的事件或属性同步机制。

## 快速上手

```html
<!-- TODO: 给出最常见的 HTML 使用示例（含默认与变体） -->
<{{tag-name}}>{{示例文案}}</{{tag-name}}>
```

```javascript
// TODO: 补充与宿主应用交互的最小示例（事件监听/状态联动）
const element = document.querySelector('{{selector}}');
element.addEventListener('{{event}}', () => {
  // ...
});
```

## 插槽 (Slots)

- TODO: 列出默认及命名插槽的职责与内容约束。
- TODO: 给出典型插槽用法的 HTML/CSS 示例片段。

| 插槽名  | 内容期望 | 默认行为 | 备注 |
| ------- | -------- | -------- | ---- |
| default | TODO     | TODO     | TODO |

## HTML 属性

| 属性 | 取值 | 默认值 | 用途 | 对标参考 |
| ---- | ---- | ------ | ---- | -------- |
| TODO | TODO | TODO   | TODO | TODO     |

> TODO: 补充与原生属性透传相关的说明。

### JavaScript 属性访问器

```javascript
// TODO: 展示通过属性访问器读写的示例，以及调用后的副作用
```

- TODO: 说明 setter/getter 与 DOM/Shadow DOM 同步策略。
- TODO: 描述属性反射与兼容框架状态管理的注意事项。

## 自定义事件

| 事件名 | 触发时机 | 事件负载 | 事件选项                          |
| ------ | -------- | -------- | --------------------------------- |
| TODO   | TODO     | TODO     | { bubbles: true, composed: true } |

- TODO: 指出是否需要防止重复派发或做降噪处理。

## 公共方法

- `focus(): void` — TODO: 说明调用效果与场景。
- `blur(): void` — TODO: 说明调用效果与场景。
- `click(): void` — TODO: 标注安全防护（禁用/加载态）。

> 如有额外方法，请按上述格式补充。

## 状态与交互细节

- **Hover/Active**：TODO: 描述不同变体的反馈策略。
- **Disabled**：TODO: 描述视觉变化与事件阻断逻辑。
- **Loading**：TODO: 说明加载动画、文案、交互限制。
- TODO: 视情况新增其他状态（focus-visible、danger 等）。

## 样式与主题定制

### 样式变量一览

| 变量名              | 默认值 | 作用 |
| ------------------- | ------ | ---- |
| `--{{token}}`       | TODO   | TODO |
| **尺寸（size）**    |        |      |
| `--{{size-token}}`  | TODO   | TODO |
| **语义色彩**        |        |      |
| `--{{color-token}}` | TODO   | TODO |

### 定制策略

```css
/* TODO: 示例说明如何在全局/局部覆写设计令牌 */
:root[data-theme='dark'] {
  --{{token}}: {{value}};
}
{{tag-name}}[data-tone='success'] {
  --{{token}}: {{value}};
}
```

## 可访问性建议

- TODO: 说明文案/aria 属性要求。
- TODO: 标注颜色对比度与键盘可访问性注意事项。
- TODO: 提醒加载/禁用态的辅助技术反馈。

## 与设计系统的协作建议

1. **命名收敛**：TODO: 提示设计与实现术语统一方式。
2. **操作分组**：TODO: 说明与其他组件协同的布局策略。
3. **反馈节奏**：TODO: 规定交互状态与反馈的节奏。

## 后续演进路线（Roadmap）

- TODO: 列出计划中的变体或能力拓展。
- TODO: 标记依赖或风险。

## 浏览器兼容性

- TODO: 指出目标浏览器范围与 polyfill 方案。

## 测试规约（Test Spec）

### 测试范围

- TODO: 枚举属性/状态/事件/方法等测试维度。

### 测试环境与前置条件

- TODO: 标注测试框架、polyfill 与初始化方式。

### 功能用例矩阵

| 用例 ID | 场景 | 步骤概述 | 期望结果 |
| ------- | ---- | -------- | -------- |
| TS01    | TODO | TODO     | TODO     |

### 边界与回归检查

- TODO: 说明需要关注的错误输入或历史问题。

### 无障碍与语义

- TODO: 列出需要验证的 aria 属性与可访问性细节。

### 非目标（Out of Scope）

- TODO: 明确本期不覆盖的范围或交给其他流程的事项。
