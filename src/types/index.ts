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

export interface ButtonProps extends ComponentProps, EventHandlers {
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
}

// Web Component 基础类型
export interface WebComponentOptions {
  tagName: string;
  template: string;
  styles?: string;
}

// 组件注册函数类型
export type ComponentRegistration = () => void;