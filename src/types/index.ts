// 全局类型定义

// 组件基础属性接口
export interface ComponentProps {
  className?: string;
  id?: string;
  style?: Partial<CSSStyleDeclaration>;
}

// 事件处理器接口
export interface EventHandlers {
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

// 按钮组件相关类型
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonType = 'button' | 'submit' | 'reset';

// 输入框组件相关类型
export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'outlined' | 'filled' | 'standard';
export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color';

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

// 输入框变化上下文
export interface InputChangeContext {
  value: string;
  previousValue: string;
  isUserInput: boolean;
  validationResult?: ValidationResult;
}

export interface ButtonProps extends ComponentProps, EventHandlers {
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
}

// 输入框事件处理器
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

// 输入框组件属性接口
export interface InputProps extends ComponentProps, InputEventHandlers {
  // 基础属性
  type?: InputType;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  id?: string;

  // 状态属性
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  loading?: boolean;

  // 样式属性
  size?: InputSize;
  variant?: InputVariant;

  // 验证属性
  pattern?: string | RegExp;
  min?: number | string;
  max?: number | string;
  minLength?: number;
  maxLength?: number;
  step?: number | string;

  // 特殊属性
  autocomplete?: string;
  autofocus?: boolean;
  clearable?: boolean;

  // 标签和提示
  label?: string;
  helperText?: string;
  error?: string;

  // 验证规则
  validationRules?: InputValidationRule;
}

// Web Component 基础类型
export interface WebComponentOptions {
  tagName: string;
  template: string;
  styles?: string;
}

// 组件注册函数类型
export type ComponentRegistration = () => void;
