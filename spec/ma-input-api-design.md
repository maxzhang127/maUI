# MA-INPUT 组件 API 设计文档

## 概述

`ma-input` 是基于 Web Components 标准构建的原生输入框组件，提供完整的表单验证、多种样式变体和丰富的交互功能。

## 基础用法

```html
<!-- 基础输入框 -->
<ma-input placeholder="请输入内容"></ma-input>

<!-- 带标签的输入框 -->
<ma-input label="用户名" placeholder="请输入用户名" required></ma-input>

<!-- 不同类型的输入框 -->
<ma-input type="email" label="邮箱" placeholder="请输入邮箱"></ma-input>
<ma-input type="password" label="密码" clearable></ma-input>
<ma-input type="number" label="年龄" min="0" max="150"></ma-input>
```

## API 参考

### 属性 (Attributes)

#### 基础属性
- `type`: InputType - 输入框类型，支持 text/password/email/number 等
- `value`: string - 当前值
- `placeholder`: string - 占位符文本
- `name`: string - 表单名称
- `id`: string - 元素ID

#### 状态属性
- `disabled`: boolean - 禁用状态
- `readonly`: boolean - 只读状态  
- `required`: boolean - 必填状态
- `loading`: boolean - 加载状态

#### 样式属性
- `size`: 'small' | 'medium' | 'large' - 尺寸大小（默认：medium）
- `variant`: 'outlined' | 'filled' | 'standard' - 样式变体（默认：outlined）

#### 验证属性
- `pattern`: string | RegExp - 正则验证模式
- `min`: number | string - 最小值（用于number/date类型）
- `max`: number | string - 最大值（用于number/date类型）
- `minlength`: number - 最小长度
- `maxlength`: number - 最大长度
- `step`: number | string - 步进值（用于number类型）

#### 特殊属性
- `autocomplete`: string - 自动完成设置
- `autofocus`: boolean - 自动聚焦
- `clearable`: boolean - 显示清除按钮

#### 标签和提示
- `label`: string - 输入框标签
- `helper-text`: string - 帮助文本
- `error`: string - 错误消息

### 事件 (Events)

#### 标准输入事件
- `ma-input`: 输入时触发
  ```javascript
  detail: { value: string, context: InputChangeContext, originalEvent: InputEvent }
  ```

- `ma-change`: 值变化时触发（失去焦点或回车）
  ```javascript
  detail: { value: string, context: InputChangeContext, originalEvent: Event }
  ```

#### 焦点事件
- `ma-focus`: 获得焦点时触发
  ```javascript
  detail: { originalEvent: FocusEvent }
  ```

- `ma-blur`: 失去焦点时触发
  ```javascript
  detail: { originalEvent: FocusEvent }
  ```

#### 键盘事件
- `ma-keydown`: 按键按下时触发
- `ma-keyup`: 按键松开时触发
- `ma-enter`: 按下回车键时触发
  ```javascript
  detail: { value: string, originalEvent: KeyboardEvent }
  ```

#### 验证事件
- `ma-valid`: 验证通过时触发
  ```javascript
  detail: { result: ValidationResult }
  ```

- `ma-invalid`: 验证失败时触发
  ```javascript
  detail: { result: ValidationResult, errors: string[] }
  ```

#### 交互事件
- `ma-clear`: 点击清除按钮时触发

### 方法 (Methods)

#### 基础控制方法
- `focus()`: void - 聚焦输入框
- `blur()`: void - 失去焦点
- `select()`: void - 选中所有文本
- `setSelectionRange(start, end, direction?)`: void - 设置选中范围

#### 值操作方法
- `getValue()`: string - 获取当前值
- `setValue(value, options?)`: void - 设置值
  ```javascript
  options: { silent?: boolean } // silent为true时不触发change事件
  ```
- `clear()`: void - 清空输入框

#### 验证方法
- `validate()`: Promise<ValidationResult> - 手动验证
- `clearValidation()`: void - 清除验证状态
- `setCustomValidation(fn)`: void - 设置自定义验证函数
- `getValidationResult()`: ValidationResult - 获取最后的验证结果

### 属性访问器 (Property Getters/Setters)

所有 attribute 都有对应的 property 访问器，支持 JavaScript 直接操作：

```javascript
const input = document.querySelector('ma-input');

// 设置属性
input.value = 'hello';
input.size = 'large';
input.disabled = true;

// 获取属性
console.log(input.value);
console.log(input.size);
console.log(input.disabled);
```

## TypeScript 类型定义

### 核心类型

```typescript
// 输入框类型
export type InputType = 
  | 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' 
  | 'search' | 'date' | 'time' | 'datetime-local' 
  | 'month' | 'week' | 'color';

// 尺寸类型
export type InputSize = 'small' | 'medium' | 'large';

// 样式变体
export type InputVariant = 'outlined' | 'filled' | 'standard';
```

### 验证相关类型

```typescript
// 验证规则接口
export interface InputValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  custom?: (value: string) => boolean | string | Promise<boolean | string>;
}

// 验证结果接口
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// 输入变化上下文
export interface InputChangeContext {
  value: string;
  previousValue: string;
  isUserInput: boolean;
  validationResult?: ValidationResult;
}
```

### 事件处理器类型

```typescript
export interface InputEventHandlers {
  onInput?: (value: string, context: InputChangeContext) => void;
  onChange?: (value: string, context: InputChangeContext) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeydown?: (event: KeyboardEvent) => void;
  onKeyup?: (event: KeyboardEvent) => void;
  onEnter?: (value: string, event: KeyboardEvent) => void;
  onClear?: () => void;
  onValidate?: (result: ValidationResult) => void;
  onInvalid?: (errors: string[]) => void;
}
```

## CSS 变量自定义

组件支持通过 CSS 变量进行样式自定义：

```css
ma-input {
  /* 基础变量 */
  --ma-input-border-radius: 4px;
  --ma-input-border-width: 1px;
  --ma-input-font-size: 14px;
  --ma-input-line-height: 1.5;
  --ma-input-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 颜色变量 */
  --ma-input-text-color: #1f2937;
  --ma-input-placeholder-color: #9ca3af;
  --ma-input-border-color: #d1d5db;
  --ma-input-border-focus-color: #3b82f6;
  --ma-input-bg-color: #ffffff;
  
  /* 错误状态颜色 */
  --ma-input-error-color: #ef4444;
  --ma-input-error-border-color: #ef4444;
}
```

## 使用示例

### 基础表单

```html
<form>
  <ma-input 
    label="姓名" 
    name="name" 
    required 
    minlength="2"
    placeholder="请输入您的姓名">
  </ma-input>
  
  <ma-input 
    label="邮箱" 
    name="email" 
    type="email" 
    required
    placeholder="请输入邮箱地址">
  </ma-input>
  
  <ma-input 
    label="密码" 
    name="password" 
    type="password" 
    required 
    minlength="6"
    clearable>
  </ma-input>
</form>
```

### JavaScript 交互

```javascript
const nameInput = document.querySelector('ma-input[name="name"]');
const emailInput = document.querySelector('ma-input[name="email"]');

// 监听输入事件
nameInput.addEventListener('ma-input', (event) => {
  console.log('Name input:', event.detail.value);
});

// 监听验证事件
emailInput.addEventListener('ma-invalid', (event) => {
  console.log('Email validation errors:', event.detail.errors);
});

// 手动验证
async function validateForm() {
  const nameResult = await nameInput.validate();
  const emailResult = await emailInput.validate();
  
  return nameResult.valid && emailResult.valid;
}

// 设置自定义验证
emailInput.setCustomValidation(async (value) => {
  // 模拟异步邮箱唯一性检查
  const exists = await checkEmailExists(value);
  return exists ? '此邮箱已被使用' : true;
});
```

### 样式变体示例

```html
<!-- Outlined 样式（默认） -->
<ma-input variant="outlined" label="Outlined Input"></ma-input>

<!-- Filled 样式 -->
<ma-input variant="filled" label="Filled Input"></ma-input>

<!-- Standard 样式 -->
<ma-input variant="standard" label="Standard Input"></ma-input>

<!-- 不同尺寸 -->
<ma-input size="small" label="Small Input"></ma-input>
<ma-input size="medium" label="Medium Input"></ma-input>
<ma-input size="large" label="Large Input"></ma-input>
```

## 设计理念

### 1. Web Components 标准
- 严格遵循 Web Components 规范
- 使用 Shadow DOM 实现样式隔离
- 支持跨框架使用

### 2. 渐进增强
- 基础功能开箱即用
- 高级功能按需启用
- 良好的默认配置

### 3. 类型安全
- 完整的 TypeScript 支持
- 智能类型推导
- 编译时错误检查

### 4. 无障碍支持
- 完整的 ARIA 标签支持
- 键盘导航友好
- 屏幕阅读器兼容

### 5. 可定制性
- 丰富的 CSS 变量
- 多种样式变体
- 灵活的验证系统

## 兼容性

- 现代浏览器（Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+）
- 支持服务端渲染（SSR）
- 渐进式增强，优雅降级