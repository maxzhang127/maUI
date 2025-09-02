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
export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'outlined' | 'filled' | 'standard';
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color';
export interface InputValidationRule {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp | string;
    custom?: (value: string) => boolean | string | Promise<boolean | string>;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
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
export interface InputProps extends ComponentProps, InputEventHandlers {
    type?: InputType;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    loading?: boolean;
    size?: InputSize;
    variant?: InputVariant;
    pattern?: string | RegExp;
    min?: number | string;
    max?: number | string;
    minLength?: number;
    maxLength?: number;
    step?: number | string;
    autocomplete?: string;
    autofocus?: boolean;
    clearable?: boolean;
    label?: string;
    helperText?: string;
    error?: string;
    validationRules?: InputValidationRule;
}
export interface WebComponentOptions {
    tagName: string;
    template: string;
    styles?: string;
}
export type ComponentRegistration = () => void;
//# sourceMappingURL=index.d.ts.map