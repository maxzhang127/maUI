import { ComponentsBase } from '../componentsBase';
import styles from './ma-button.scss?inline';
import template from '@tpl/ma-button.html';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonType = 'button' | 'submit' | 'reset';

class MaButton extends ComponentsBase {
  private _button!: HTMLButtonElement;
  private _lastValidSize: ButtonSize = 'medium';
  private _lastValidVariant: ButtonVariant = 'primary';
  private _lastValidType: ButtonType = 'button';

  constructor() {
    super({
      tagName: 'ma-button',
      styles,
      shadowMode: 'open',
      observedAttributes: ['type', 'size', 'variant', 'disabled', 'loading'],
    });
    this._completeInitialization();
  }

  static get observedAttributes(): string[] {
    return ['type', 'size', 'variant', 'disabled', 'loading'];
  }

  get type(): ButtonType {
    const validTypes: readonly ButtonType[] = ['button', 'submit', 'reset'];
    const currentValue = this.getAttribute('type') as ButtonType;

    if (!currentValue) {
      return 'button'; // 当属性被移除时返回默认值
    }

    if (validTypes.includes(currentValue)) {
      this._lastValidType = currentValue;
      return currentValue;
    }

    return this._lastValidType;
  }

  set type(value: ButtonType) {
    const validTypes: readonly ButtonType[] = ['button', 'submit', 'reset'];
    if (validTypes.includes(value)) {
      this._lastValidType = value;
    }
    this._setAttribute('type', value);
  }

  get size(): ButtonSize {
    const validSizes: readonly ButtonSize[] = ['small', 'medium', 'large'];
    const currentValue = this.getAttribute('size') as ButtonSize;

    if (!currentValue) {
      return 'medium'; // 当属性被移除时返回默认值
    }

    if (validSizes.includes(currentValue)) {
      this._lastValidSize = currentValue;
      return currentValue;
    }

    return this._lastValidSize;
  }

  set size(value: ButtonSize) {
    const validSizes: readonly ButtonSize[] = ['small', 'medium', 'large'];
    if (validSizes.includes(value)) {
      this._lastValidSize = value;
    }
    this._setAttribute('size', value);
  }

  get variant(): ButtonVariant {
    const validVariants: readonly ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];
    const currentValue = this.getAttribute('variant') as ButtonVariant;

    if (!currentValue) {
      return 'primary'; // 当属性被移除时返回默认值
    }

    if (validVariants.includes(currentValue)) {
      this._lastValidVariant = currentValue;
      return currentValue;
    }

    return this._lastValidVariant;
  }

  set variant(value: ButtonVariant) {
    const validVariants: readonly ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];
    if (validVariants.includes(value)) {
      this._lastValidVariant = value;
    }
    this._setAttribute('variant', value);
  }

  get disabled(): boolean {
    return this._getBooleanAttribute('disabled');
  }

  set disabled(value: boolean) {
    this._setAttribute('disabled', value);
  }

  get loading(): boolean {
    return this._getBooleanAttribute('loading');
  }

  set loading(value: boolean) {
    this._setAttribute('loading', value);
  }

  protected _createElements(): void {
    this._shadowRoot.innerHTML = template;

    this._button = this._shadowRoot.querySelector(
      '.ma-button'
    ) as HTMLButtonElement;
  }

  protected _bindEvents(): void {
    this._button.addEventListener('click', this._handleClick.bind(this));
    this._button.addEventListener('focus', this._handleFocus.bind(this));
    this._button.addEventListener('blur', this._handleBlur.bind(this));
  }

  protected _updateComponent(): void {
    if (!this._button) return;

    this._button.type = this.type;
    this._button.disabled = this.disabled || this.loading;

    this._button.className = `ma-button ma-button--${this.variant} ma-button--${this.size}`;

    if (this.disabled) {
      this._button.classList.add('ma-button--disabled');
    }

    if (this.loading) {
      this._button.classList.add('ma-button--loading');
    }

    this._button.setAttribute('aria-busy', this.loading.toString());
  }

  private _handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this._dispatchCustomEvent('ma-click', { originalEvent: event });
  }

  private _handleFocus(event: FocusEvent): void {
    this._dispatchCustomEvent('ma-focus', { originalEvent: event });
  }

  private _handleBlur(event: FocusEvent): void {
    this._dispatchCustomEvent('ma-blur', { originalEvent: event });
  }

  public focus(): void {
    this._button?.focus();
  }

  public blur(): void {
    this._button?.blur();
  }

  public click(): void {
    if (this.disabled || this.loading) {
      return;
    }
    this._button?.click();
  }
}

// 注册组件
if (!customElements.get('ma-button')) {
  customElements.define('ma-button', MaButton);
}

export default MaButton;
