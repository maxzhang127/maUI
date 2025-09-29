import { ComponentsBase } from '../componentsBase';
import styles from './ma-button.scss?inline';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonType = 'button' | 'submit' | 'reset';

class MaButton extends ComponentsBase {
  private _button!: HTMLButtonElement;

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
    return this._getAttributeWithDefault('type', 'button');
  }

  set type(value: ButtonType) {
    this._setAttribute('type', value);
  }

  get size(): ButtonSize {
    return this._getAttributeWithDefault('size', 'medium');
  }

  set size(value: ButtonSize) {
    this._setAttribute('size', value);
  }

  get variant(): ButtonVariant {
    return this._getAttributeWithDefault('variant', 'primary');
  }

  set variant(value: ButtonVariant) {
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
    this._shadowRoot.innerHTML = `
      <button class="ma-button" part="button">
        <span class="spinner" part="spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="content" part="content">
          <slot></slot>
        </span>
      </button>
    `;

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
