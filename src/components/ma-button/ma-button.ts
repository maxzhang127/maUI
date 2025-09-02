import { ButtonSize, ButtonVariant } from '@/types';
import { classNames, generateId } from '@/utils';
import buttonStyles from './ma-button.scss';

// 按钮组件类
class MaButton extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _button: HTMLButtonElement;
  private _loadingSpinner: HTMLElement;

  // 观察的属性
  static get observedAttributes(): string[] {
    return ['size', 'variant', 'type', 'disabled', 'loading', 'class'];
  }

  constructor() {
    super();
    
    const id = generateId('ma-button');
    this.setAttribute('id', id);
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    this._button = document.createElement('button');
    this._loadingSpinner = document.createElement('span');
    
    this._initializeComponent();
  }

  private _initializeComponent(): void {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = buttonStyles;
    
    // 设置加载动画
    this._loadingSpinner.className = 'loading-spinner';
    this._loadingSpinner.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    `;

    // 设置按钮内容
    this._button.innerHTML = `
      <span class="content">
        <slot></slot>
      </span>
    `;
    
    // 添加事件监听
    this._button.addEventListener('click', this._handleClick.bind(this));
    this._button.addEventListener('focus', this._handleFocus.bind(this));
    this._button.addEventListener('blur', this._handleBlur.bind(this));
    
    // 组装 Shadow DOM
    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._button);
    
    this._updateButton();
  }

  // 属性变化时触发
  attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this._updateButton();
    }
  }

  // 连接到 DOM 时触发
  connectedCallback(): void {
    this._updateButton();
  }

  // 更新按钮状态和样式
  private _updateButton(): void {
    const size = this.getAttribute('size') as ButtonSize || 'medium';
    const variant = this.getAttribute('variant') as ButtonVariant || 'primary';
    const type = this.getAttribute('type') || 'button';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');
    const customClass = this.getAttribute('class') || '';

    // 更新按钮属性
    this._button.type = type as any;
    this._button.disabled = disabled || loading;
    
    // 更新按钮类名
    this._button.className = classNames(
      'ma-button',
      `ma-button--${size}`,
      `ma-button--${variant}`,
      loading ? 'ma-button--loading' : '',
      disabled ? 'ma-button--disabled' : '',
      customClass
    );

    // 处理加载状态
    if (loading) {
      if (!this._button.contains(this._loadingSpinner)) {
        this._button.insertBefore(this._loadingSpinner, this._button.firstChild);
      }
    } else {
      if (this._button.contains(this._loadingSpinner)) {
        this._button.removeChild(this._loadingSpinner);
      }
    }
  }

  // 事件处理
  private _handleClick(event: MouseEvent): void {
    if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // 触发自定义事件
    this.dispatchEvent(new CustomEvent('ma-click', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleFocus(event: FocusEvent): void {
    this.dispatchEvent(new CustomEvent('ma-focus', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  private _handleBlur(event: FocusEvent): void {
    this.dispatchEvent(new CustomEvent('ma-blur', {
      detail: { originalEvent: event },
      bubbles: true,
      composed: true
    }));
  }

  // 公共方法
  public focus(): void {
    this._button.focus();
  }

  public blur(): void {
    this._button.blur();
  }

  public click(): void {
    this._button.click();
  }

  // 属性 getter/setter
  get size(): ButtonSize {
    return (this.getAttribute('size') as ButtonSize) || 'medium';
  }

  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }

  get variant(): ButtonVariant {
    return (this.getAttribute('variant') as ButtonVariant) || 'primary';
  }

  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value);
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

  get loading(): boolean {
    return this.hasAttribute('loading');
  }

  set loading(value: boolean) {
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }
}

// 注册组件
if (!customElements.get('ma-button')) {
  customElements.define('ma-button', MaButton);
}

export default MaButton;