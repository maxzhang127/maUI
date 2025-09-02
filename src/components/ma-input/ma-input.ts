import { InputSize, InputType, InputVariant, InputValidationRule, ValidationResult, InputChangeContext } from '@/types';
import { classNames, generateId } from '@/utils';
import inputStyles from './ma-input.scss';

class MaInput extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _inputContainer: HTMLElement;
  private _label: HTMLLabelElement;
  private _input: HTMLInputElement;
  private _helperText: HTMLElement;
  private _clearButton: HTMLButtonElement;
  private _eyeButton: HTMLButtonElement;
  private _validationRules: InputValidationRule = {};
  private _lastValidationResult: ValidationResult = { valid: true, errors: [] };
  private _previousValue: string = '';

  static get observedAttributes(): string[] {
    return [
      'size', 'variant', 'type', 'placeholder', 'value', 'disabled', 
      'readonly', 'required', 'maxlength', 'minlength', 'pattern',
      'autocomplete', 'label', 'error', 'helper-text', 'clearable', 'class'
    ];
  }

  constructor() {
    super();
    
    const id = generateId('ma-input');
    this.setAttribute('id', id);
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    this._inputContainer = document.createElement('div');
    this._label = document.createElement('label');
    this._input = document.createElement('input');
    this._helperText = document.createElement('div');
    this._clearButton = document.createElement('button');
    this._eyeButton = document.createElement('button');
    
    this._initializeComponent();
  }

  private _initializeComponent(): void {
    const style = document.createElement('style');
    style.textContent = inputStyles;
    
    this._label.className = 'ma-input__label';
    this._inputContainer.className = 'ma-input__container';
    this._input.className = 'ma-input__field';
    this._helperText.className = 'ma-input__helper-text';
    
    this._clearButton.className = 'ma-input__clear-button';
    this._clearButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `;
    this._clearButton.type = 'button';
    
    this._eyeButton.className = 'ma-input__eye-button';
    this._eyeButton.innerHTML = `
      <svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
      <svg class="eye-close" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
      </svg>
    `;
    this._eyeButton.type = 'button';
    
    this._inputContainer.appendChild(this._input);
    this._inputContainer.appendChild(this._clearButton);
    this._inputContainer.appendChild(this._eyeButton);
    
    this._input.addEventListener('input', this._handleInput.bind(this));
    this._input.addEventListener('change', this._handleChange.bind(this));
    this._input.addEventListener('focus', this._handleFocus.bind(this));
    this._input.addEventListener('blur', this._handleBlur.bind(this));
    this._input.addEventListener('keydown', this._handleKeydown.bind(this));
    this._input.addEventListener('keyup', this._handleKeyup.bind(this));
    
    this._clearButton.addEventListener('click', this._handleClear.bind(this));
    this._eyeButton.addEventListener('click', this._handleTogglePassword.bind(this));
    
    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._label);
    this._shadowRoot.appendChild(this._inputContainer);
    this._shadowRoot.appendChild(this._helperText);
    
    this._updateComponent();
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this._updateComponent();
    }
  }

  connectedCallback(): void {
    this._updateComponent();
  }

  private _updateComponent(): void {
    const size = this.getAttribute('size') as InputSize || 'medium';
    const variant = this.getAttribute('variant') as InputVariant || 'outlined';
    const type = this.getAttribute('type') as InputType || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const disabled = this.hasAttribute('disabled');
    const readonly = this.hasAttribute('readonly');
    const required = this.hasAttribute('required');
    const maxlength = this.getAttribute('maxlength');
    const minlength = this.getAttribute('minlength');
    const pattern = this.getAttribute('pattern');
    const autocomplete = this.getAttribute('autocomplete');
    const label = this.getAttribute('label') || '';
    const error = this.getAttribute('error') || '';
    const helperText = this.getAttribute('helper-text') || '';
    const clearable = this.hasAttribute('clearable');
    const customClass = this.getAttribute('class') || '';

    // 更新验证规则
    this._updateValidationRules();

    this._input.type = type;
    this._input.placeholder = placeholder;
    this._input.value = value;
    this._input.disabled = disabled;
    this._input.readOnly = readonly;
    this._input.required = required;
    
    if (maxlength) this._input.maxLength = parseInt(maxlength, 10);
    if (minlength) this._input.minLength = parseInt(minlength, 10);
    if (pattern) this._input.pattern = pattern;
    if (autocomplete) this._input.setAttribute('autocomplete', autocomplete);

    const inputId = generateId('input');
    this._input.id = inputId;
    this._label.htmlFor = inputId;
    this._label.textContent = label;
    this._label.style.display = label ? 'block' : 'none';

    // 使用验证结果来设置错误状态
    const hasValidationError = !this._lastValidationResult.valid;
    const displayError = error || (hasValidationError ? this._lastValidationResult.errors[0] : '');

    this._inputContainer.className = classNames(
      'ma-input__container',
      `ma-input__container--${size}`,
      `ma-input__container--${variant}`,
      displayError ? 'ma-input__container--error' : '',
      disabled ? 'ma-input__container--disabled' : '',
      readonly ? 'ma-input__container--readonly' : '',
      customClass
    );

    this._clearButton.style.display = clearable && value && !disabled && !readonly ? 'flex' : 'none';
    this._eyeButton.style.display = type === 'password' ? 'flex' : 'none';

    this._helperText.textContent = displayError || helperText;
    this._helperText.className = classNames(
      'ma-input__helper-text',
      displayError ? 'ma-input__helper-text--error' : ''
    );
    this._helperText.style.display = displayError || helperText ? 'block' : 'none';
  }

  private async _handleInput(event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value;
    const previousValue = this._previousValue;
    this._previousValue = value;
    this.setAttribute('value', value);
    
    // 验证输入值
    const validationResult = await this._validateValue(value);
    
    const context: InputChangeContext = {
      value,
      previousValue,
      isUserInput: true,
      validationResult
    };
    
    this.dispatchEvent(new CustomEvent('ma-input', {
      detail: { value, context, originalEvent: event },
      bubbles: true,
      composed: true
    }));
    
    // 更新显示状态
    this._updateComponent();
  }

  private async _handleChange(event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value;
    const previousValue = this._previousValue;
    
    const validationResult = await this._validateValue(value);
    
    const context: InputChangeContext = {
      value,
      previousValue,
      isUserInput: true,
      validationResult
    };
    
    this.dispatchEvent(new CustomEvent('ma-change', {
      detail: { value, context, originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleFocus(event: FocusEvent): void {
    this._inputContainer.classList.add('ma-input__container--focused');
    
    this.dispatchEvent(new CustomEvent('ma-focus', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleBlur(event: FocusEvent): void {
    this._inputContainer.classList.remove('ma-input__container--focused');
    
    this.dispatchEvent(new CustomEvent('ma-blur', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeydown(event: KeyboardEvent): void {
    // 处理Enter键事件
    if (event.key === 'Enter') {
      const value = this._input.value;
      this.dispatchEvent(new CustomEvent('ma-enter', {
        detail: { value, originalEvent: event },
        bubbles: true,
        composed: true
      }));
    }
    
    this.dispatchEvent(new CustomEvent('ma-keydown', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyup(event: KeyboardEvent): void {
    this.dispatchEvent(new CustomEvent('ma-keyup', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleClear(): void {
    this._input.value = '';
    this.setAttribute('value', '');
    this._updateComponent();
    
    this.dispatchEvent(new CustomEvent('ma-clear', {
      detail: {},
      bubbles: true,
      composed: true
    }));
    
    this._input.focus();
  }

  private _handleTogglePassword(): void {
    const isPassword = this._input.type === 'password';
    this._input.type = isPassword ? 'text' : 'password';
    
    const eyeOpen = this._eyeButton.querySelector('.eye-open') as HTMLElement;
    const eyeClose = this._eyeButton.querySelector('.eye-close') as HTMLElement;
    
    if (isPassword) {
      eyeOpen.style.display = 'none';
      eyeClose.style.display = 'block';
    } else {
      eyeOpen.style.display = 'block';
      eyeClose.style.display = 'none';
    }
  }

  // 验证相关方法
  private async _validateValue(value: string): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // 必填验证
    if (this._validationRules.required && !value.trim()) {
      errors.push('此字段为必填项');
    }
    
    if (value) {
      // 长度验证
      if (this._validationRules.minLength !== undefined && value.length < this._validationRules.minLength) {
        errors.push(`最少需要输入 ${this._validationRules.minLength} 个字符`);
      }
      
      if (this._validationRules.maxLength !== undefined && value.length > this._validationRules.maxLength) {
        errors.push(`最多只能输入 ${this._validationRules.maxLength} 个字符`);
      }
      
      // 数值验证
      const numValue = parseFloat(value);
      if (this._input.type === 'number' && !isNaN(numValue)) {
        if (this._validationRules.min !== undefined && numValue < this._validationRules.min) {
          errors.push(`输入值不能小于 ${this._validationRules.min}`);
        }
        
        if (this._validationRules.max !== undefined && numValue > this._validationRules.max) {
          errors.push(`输入值不能大于 ${this._validationRules.max}`);
        }
      }
      
      // 正则验证
      if (this._validationRules.pattern) {
        const pattern = typeof this._validationRules.pattern === 'string' 
          ? new RegExp(this._validationRules.pattern) 
          : this._validationRules.pattern;
          
        if (!pattern.test(value)) {
          errors.push('输入格式不正确');
        }
      }
      
      // 自定义验证
      if (this._validationRules.custom) {
        try {
          const customResult = await this._validationRules.custom(value);
          if (typeof customResult === 'string') {
            errors.push(customResult);
          } else if (customResult === false) {
            errors.push('输入值不符合要求');
          }
        } catch (error) {
          errors.push('验证失败');
        }
      }
    }
    
    const result: ValidationResult = {
      valid: errors.length === 0,
      errors
    };
    
    this._lastValidationResult = result;
    
    // 触发验证事件
    if (result.valid) {
      this.dispatchEvent(new CustomEvent('ma-valid', {
        detail: { result },
        bubbles: true,
        composed: true
      }));
    } else {
      this.dispatchEvent(new CustomEvent('ma-invalid', {
        detail: { result, errors: result.errors },
        bubbles: true,
        composed: true
      }));
    }
    
    return result;
  }

  private _updateValidationRules(): void {
    const rules: InputValidationRule = {};
    
    // 从属性中提取验证规则
    if (this.hasAttribute('required')) rules.required = true;
    
    const minLength = this.getAttribute('minlength');
    if (minLength) rules.minLength = parseInt(minLength, 10);
    
    const maxLength = this.getAttribute('maxlength');
    if (maxLength) rules.maxLength = parseInt(maxLength, 10);
    
    const pattern = this.getAttribute('pattern');
    if (pattern) rules.pattern = pattern;
    
    const min = this.getAttribute('min');
    if (min) rules.min = parseFloat(min);
    
    const max = this.getAttribute('max');
    if (max) rules.max = parseFloat(max);
    
    this._validationRules = rules;
  }

  public focus(): void {
    this._input.focus();
  }

  public blur(): void {
    this._input.blur();
  }

  public select(): void {
    this._input.select();
  }

  public setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void {
    this._input.setSelectionRange(start, end, direction);
  }

  public clear(): void {
    this._handleClear();
  }

  public async validate(): Promise<ValidationResult> {
    return await this._validateValue(this.value);
  }

  public clearValidation(): void {
    this._lastValidationResult = { valid: true, errors: [] };
    this._updateComponent();
  }

  public setCustomValidation(customFn: (value: string) => boolean | string | Promise<boolean | string>): void {
    this._validationRules.custom = customFn;
  }

  public setValue(value: string, options?: { silent?: boolean }): void {
    const oldValue = this._input.value;
    this._previousValue = oldValue;
    this._input.value = value;
    this.setAttribute('value', value);
    
    if (!options?.silent) {
      // 触发change事件
      this._handleChange(new Event('change'));
    }
    
    this._updateComponent();
  }

  public getValue(): string {
    return this._input.value;
  }

  public getValidationResult(): ValidationResult {
    return this._lastValidationResult;
  }

  get value(): string {
    return this._input.value;
  }

  set value(value: string) {
    this._input.value = value;
    this.setAttribute('value', value);
    this._updateComponent();
  }

  get size(): InputSize {
    return (this.getAttribute('size') as InputSize) || 'medium';
  }

  set size(value: InputSize) {
    this.setAttribute('size', value);
  }

  get variant(): InputVariant {
    return (this.getAttribute('variant') as InputVariant) || 'outlined';
  }

  set variant(value: InputVariant) {
    this.setAttribute('variant', value);
  }

  get type(): InputType {
    return (this.getAttribute('type') as InputType) || 'text';
  }

  set type(value: InputType) {
    this.setAttribute('type', value);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || '';
  }

  set placeholder(value: string) {
    this.setAttribute('placeholder', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get readonly(): boolean {
    return this.hasAttribute('readonly');
  }

  set readonly(value: boolean) {
    if (value) {
      this.setAttribute('readonly', '');
    } else {
      this.removeAttribute('readonly');
    }
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }

  set required(value: boolean) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }

  get error(): string {
    return this.getAttribute('error') || '';
  }

  set error(value: string) {
    if (value) {
      this.setAttribute('error', value);
    } else {
      this.removeAttribute('error');
    }
  }

  get helperText(): string {
    return this.getAttribute('helper-text') || '';
  }

  set helperText(value: string) {
    if (value) {
      this.setAttribute('helper-text', value);
    } else {
      this.removeAttribute('helper-text');
    }
  }

  get clearable(): boolean {
    return this.hasAttribute('clearable');
  }

  set clearable(value: boolean) {
    if (value) {
      this.setAttribute('clearable', '');
    } else {
      this.removeAttribute('clearable');
    }
  }
}

if (!customElements.get('ma-input')) {
  customElements.define('ma-input', MaInput);
}

export default MaInput;