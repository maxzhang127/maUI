import { ButtonSize, ButtonType, ButtonVariant } from '@/types';
import { classNames } from '@/utils';
import { ComponentsBase, ComponentConfig } from '../componentsBase';
import buttonStyles from './ma-button.scss?inline';
import buttonTemplate from './templates/button.html';
import loadingSpinnerTemplate from './templates/loading-spinner.html';

const isButtonType = (value: string | null): value is ButtonType =>
  value === 'button' || value === 'submit' || value === 'reset';

class MaButton extends ComponentsBase {
  private _button: HTMLButtonElement;
  private _loadingSpinner: HTMLElement;

  static get observedAttributes(): string[] {
    return ['size', 'variant', 'type', 'disabled', 'loading', 'class'];
  }

  constructor() {
    const config: ComponentConfig = {
      tagName: 'ma-button',
      styles: buttonStyles,
      shadowMode: 'open',
    };

    super(config);

    // 元素将在_createElements中创建
    this._button = {} as HTMLButtonElement;
    this._loadingSpinner = {} as HTMLElement;

    // 完成组件初始化
    this._completeInitialization();
  }

  protected _createElements(): void {
    // 创建loading spinner元素
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = loadingSpinnerTemplate;
    this._loadingSpinner = tempDiv.firstElementChild as HTMLElement;

    // 使用模板创建button元素
    const buttonTempDiv = document.createElement('div');
    buttonTempDiv.innerHTML = buttonTemplate;
    this._button = buttonTempDiv.firstElementChild as HTMLButtonElement;

    this._shadowRoot.appendChild(this._button);
  }

  protected _bindEvents(): void {
    this._button.addEventListener('click', this._handleClick.bind(this));
    this._button.addEventListener('focus', this._handleFocus.bind(this));
    this._button.addEventListener('blur', this._handleBlur.bind(this));
  }

  protected _updateComponent(): void {
    const size = this._getAttributeWithDefault('size', 'medium' as ButtonSize);
    const variant = this._getAttributeWithDefault(
      'variant',
      'primary' as ButtonVariant
    );
    const typeAttribute = this.getAttribute('type');
    const buttonType: ButtonType = isButtonType(typeAttribute)
      ? typeAttribute
      : 'button';
    const disabled = this._getBooleanAttribute('disabled');
    const loading = this._getBooleanAttribute('loading');
    const customClass = this.getAttribute('class') || '';

    this._button.type = buttonType;
    this._button.disabled = disabled || loading;

    this._button.className = classNames(
      'ma-button',
      `ma-button--${size}`,
      `ma-button--${variant}`,
      loading ? 'ma-button--loading' : '',
      disabled ? 'ma-button--disabled' : '',
      customClass
    );

    if (loading) {
      if (!this._button.contains(this._loadingSpinner)) {
        this._button.insertBefore(
          this._loadingSpinner,
          this._button.firstChild
        );
      }
    } else {
      if (this._button.contains(this._loadingSpinner)) {
        this._button.removeChild(this._loadingSpinner);
      }
    }
  }

  private _handleClick(event: MouseEvent): void {
    if (
      this._getBooleanAttribute('disabled') ||
      this._getBooleanAttribute('loading')
    ) {
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
    this._button.focus();
  }

  public blur(): void {
    this._button.blur();
  }

  public click(): void {
    this._button.click();
  }

  get size(): ButtonSize {
    return this._getAttributeWithDefault('size', 'medium' as ButtonSize);
  }

  set size(value: ButtonSize) {
    this._setAttribute('size', value);
  }

  get variant(): ButtonVariant {
    return this._getAttributeWithDefault('variant', 'primary' as ButtonVariant);
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
}

// 注册组件
if (!customElements.get('ma-button')) {
  customElements.define('ma-button', MaButton);
}

export default MaButton;
