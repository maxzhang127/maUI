import { generateId } from '@/utils';

export interface ComponentConfig {
  tagName: string;
  styles?: string;
  shadowMode?: 'open' | 'closed';
  observedAttributes?: string[];
}

export interface CustomEventDetail {
  originalEvent?: Event;
  [key: string]: unknown;
}

export abstract class ComponentsBase extends HTMLElement {
  protected _shadowRoot: ShadowRoot;
  protected _config: ComponentConfig;
  protected _isInitialized: boolean = false;

  constructor(config: ComponentConfig) {
    super();
    this._config = config;

    const id = generateId(this._config.tagName);
    this.setAttribute('id', id);

    this._shadowRoot = this.attachShadow({
      mode: this._config.shadowMode || 'open',
    });

    this._loadStyles();
  }

  private _initialize(): void {
    this._createElements();
    this._bindEvents();
    this._isInitialized = true;
    this._updateComponent();
  }

  protected _completeInitialization(): void {
    if (!this._isInitialized) {
      this._initialize();
    }
  }

  protected _loadStyles(): void {
    if (this._config.styles) {
      // 使用现代的 CSSStyleSheet API，性能更好且支持样式共享
      if (
        'adoptedStyleSheets' in this._shadowRoot &&
        'CSSStyleSheet' in window
      ) {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(this._config.styles);
        this._shadowRoot.adoptedStyleSheets = [styleSheet];
      } else {
        // 降级方案：对于不支持 adoptedStyleSheets 的旧浏览器
        const style = document.createElement('style');
        style.textContent = this._config.styles;
        (this._shadowRoot as ShadowRoot).appendChild(style);
      }
    }
  }

  protected abstract _createElements(): void;

  protected _bindEvents(): void {
    // 子类可以覆盖此方法来绑定事件
  }

  protected _updateComponent(): void {
    // 子类可以覆盖此方法来更新组件状态
  }

  protected _dispatchCustomEvent(
    eventName: string,
    detail: CustomEventDetail = {}
  ): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  static get observedAttributes(): string[] {
    return [];
  }

  attributeChangedCallback(
    _name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (this._isInitialized && oldValue !== newValue) {
      this._updateComponent();
    }
  }

  connectedCallback(): void {
    if (this._isInitialized) {
      this._updateComponent();
    }
  }

  disconnectedCallback(): void {
    // 子类可以覆盖此方法来清理资源
  }

  protected _getBooleanAttribute(name: string): boolean {
    return this.hasAttribute(name);
  }

  protected _setAttribute(name: string, value: string | boolean): void {
    if (typeof value === 'boolean') {
      if (value) {
        this.setAttribute(name, '');
      } else {
        this.removeAttribute(name);
      }
    } else {
      this.setAttribute(name, value);
    }
  }

  protected _getAttributeWithDefault<T extends string>(
    name: string,
    defaultValue: T
  ): T {
    return (this.getAttribute(name) as T) || defaultValue;
  }
}
