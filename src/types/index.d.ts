export interface ComponentProps {
    className?: string;
    id?: string;
    style?: Partial<CSSStyleDeclaration>;
}
export interface EventHandlers {
    onClick?: (event: MouseEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
}
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
export interface WebComponentOptions {
    tagName: string;
    template: string;
    styles?: string;
}
export type ComponentRegistration = () => void;
//# sourceMappingURL=index.d.ts.map