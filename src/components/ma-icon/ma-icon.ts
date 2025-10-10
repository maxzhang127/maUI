import { ComponentsBase } from '../componentsBase';
import { iconStore, IconDescriptor } from './icon-store';
import styles from './ma-icon.scss?inline';
import template from '@tpl/ma-icon.html';

export type IconSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';
export type IconRotation = '0' | '90' | '180' | '270';

export interface IconLoadEventDetail {
  name?: string;
  set?: string;
  source: 'sprite' | 'src' | 'slot';
  fromCache: boolean;
  [key: string]: unknown;
}

export interface IconErrorEventDetail {
  name?: string;
  set?: string;
  src?: string;
  error: Error;
  [key: string]: unknown;
}

class MaIcon extends ComponentsBase {
  private _iconWrapper!: HTMLElement;
  private _intersectionObserver?: IntersectionObserver;
  private _currentDescriptor: IconDescriptor | null = null;
  private _loadPromise: Promise<void> | null = null;
  private _lastRenderKey = '';

  constructor() {
    super({
      tagName: 'ma-icon',
      styles,
      shadowMode: 'open',
    });
    this._completeInitialization();
  }

  static get observedAttributes(): string[] {
    return [
      'name',
      'set',
      'src',
      'size',
      'tone',
      'label',
      'decorative',
      'mirrored',
      'rotation',
      'lazy',
    ];
  }

  // Getters and setters for attributes
  get name(): string {
    return this.getAttribute('name') || '';
  }

  set name(value: string) {
    this._setAttribute('name', value);
  }

  get set(): string {
    return this._getAttributeWithDefault('set', 'system', [
      'system',
      'outlined',
      'filled',
    ]);
  }

  set set(value: string) {
    this._setAttribute('set', value);
  }

  get src(): string {
    return this.getAttribute('src') || '';
  }

  set src(value: string) {
    this._setAttribute('src', value);
  }

  get size(): IconSize {
    return this._getAttributeWithDefault('size', 'md', [
      'xxs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ]);
  }

  set size(value: IconSize) {
    this._setAttribute('size', value);
  }

  get tone(): IconTone {
    return this._getAttributeWithDefault('tone', 'default', [
      'default',
      'muted',
      'primary',
      'success',
      'warning',
      'danger',
    ]);
  }

  set tone(value: IconTone) {
    this._setAttribute('tone', value);
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this._setAttribute('label', value);
  }

  get decorative(): boolean {
    return this._getBooleanAttribute('decorative');
  }

  set decorative(value: boolean) {
    this._setAttribute('decorative', value);
  }

  get mirrored(): boolean {
    return this._getBooleanAttribute('mirrored');
  }

  set mirrored(value: boolean) {
    this._setAttribute('mirrored', value);
  }

  get rotation(): IconRotation {
    return this._getAttributeWithDefault('rotation', '0', [
      '0',
      '90',
      '180',
      '270',
    ]);
  }

  set rotation(value: IconRotation) {
    this._setAttribute('rotation', value);
  }

  get lazy(): boolean {
    return this._getBooleanAttribute('lazy');
  }

  set lazy(value: boolean) {
    this._setAttribute('lazy', value);
  }

  protected _createElements(): void {
    this._shadowRoot.innerHTML = template;
    this._iconWrapper = this._shadowRoot.querySelector(
      '.icon-wrapper'
    ) as HTMLElement;
    this._setupAccessibility();
  }

  protected _bindEvents(): void {
    if (this.lazy) {
      this._setupLazyLoading();
    }
  }

  protected async _updateComponent(): Promise<void> {
    this._setupAccessibility();

    if (this.lazy && !this.classList.contains('ma-icon--loaded')) {
      // 懒加载模式下，等待进入视窗再加载
      return;
    }

    await this._resolveIcon();
  }

  private _setupAccessibility(): void {
    if (this.decorative) {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    } else if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('aria-hidden');
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
  }

  private _setupLazyLoading(): void {
    if (!('IntersectionObserver' in window)) {
      // 降级方案：立即加载
      this._resolveIcon();
      return;
    }

    this._intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.classList.add('ma-icon--loaded');
            this._resolveIcon();
            this._intersectionObserver?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    this._intersectionObserver.observe(this);
  }

  private async _resolveIcon(): Promise<void> {
    // 生成当前渲染的唯一键，防止重复渲染
    const renderKey = `${this.name}:${this.set}:${this.src}`;
    if (renderKey === this._lastRenderKey && this._currentDescriptor) {
      return;
    }

    this._lastRenderKey = renderKey;
    this.classList.add('ma-icon--loading');

    try {
      // 检查是否有默认插槽内容
      const slotContent = this.querySelector('svg, img');
      if (slotContent) {
        this._renderSlotContent();
        return;
      }

      // 优先处理外部 src
      if (this.src) {
        await this._loadExternalIcon();
        return;
      }

      // 处理内置图标
      if (this.name) {
        this._loadInternalIcon();
        return;
      }

      // 没有有效图标，渲染占位符
      this._renderPlaceholder();
    } catch (error) {
      this._handleIconError(error as Error);
    } finally {
      this.classList.remove('ma-icon--loading');
    }
  }

  private _renderSlotContent(): void {
    this._currentDescriptor = { name: '', set: '', src: '' };
    this._dispatchLoadEvent('slot', true);
  }

  private async _loadExternalIcon(): Promise<void> {
    try {
      const svgContent = await iconStore.loadExternalIcon(this.src);
      this._renderSvgContent(svgContent);
      this._currentDescriptor = { name: '', set: '', src: this.src };
      this._dispatchLoadEvent('src', false);
    } catch (error) {
      throw new Error(`Failed to load external icon: ${error}`);
    }
  }

  private _loadInternalIcon(): void {
    const svgContent = iconStore.getIcon(this.name, this.set);
    if (svgContent) {
      this._renderSvgContent(svgContent);
      this._currentDescriptor = { name: this.name, set: this.set };
      this._dispatchLoadEvent('sprite', true);
    } else {
      throw new Error(`Icon not found: ${this.name} in set ${this.set}`);
    }
  }

  private _renderSvgContent(svgContent: string): void {
    // 清空现有内容（除了插槽）
    const existingSlot = this._iconWrapper.querySelector('slot');
    this._iconWrapper.innerHTML = '';

    // 创建 SVG 元素
    const svgElement = this._createSvgElement(svgContent);
    svgElement.setAttribute('part', 'icon');
    this._iconWrapper.appendChild(svgElement);

    // 重新添加插槽
    if (existingSlot) {
      this._iconWrapper.appendChild(existingSlot);
    }
  }

  private _createSvgElement(svgContent: string): SVGElement {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgContent.trim();
    const svgElement = tempDiv.firstElementChild as SVGElement;

    if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
      throw new Error('Invalid SVG content');
    }

    return svgElement;
  }

  private _renderPlaceholder(): void {
    const placeholderSvg = iconStore.getIcon('placeholder', 'system');
    if (placeholderSvg) {
      this._renderSvgContent(placeholderSvg);
    } else {
      // 降级占位符
      const existingSlot = this._iconWrapper.querySelector('slot');
      this._iconWrapper.innerHTML =
        '<span class="icon-placeholder" part="placeholder"></span>';
      if (existingSlot) {
        this._iconWrapper.appendChild(existingSlot);
      }
    }
    this._currentDescriptor = null;
  }

  private _handleIconError(error: Error): void {
    this.classList.add('ma-icon--error');
    this._renderPlaceholder();
    this._dispatchErrorEvent(error);
  }

  private _dispatchLoadEvent(
    source: 'sprite' | 'src' | 'slot',
    fromCache: boolean
  ): void {
    const detail: IconLoadEventDetail = {
      name: this.name || undefined,
      set: this.set || undefined,
      source,
      fromCache,
    };

    this._dispatchCustomEvent('ma-load', detail);
  }

  private _dispatchErrorEvent(error: Error): void {
    const detail: IconErrorEventDetail = {
      name: this.name || undefined,
      set: this.set || undefined,
      src: this.src || undefined,
      error,
    };

    this._dispatchCustomEvent('ma-error', detail);
  }

  // 公共方法
  async load(): Promise<void> {
    if (this._loadPromise) {
      return this._loadPromise;
    }

    this._loadPromise = this._resolveIcon();

    try {
      await this._loadPromise;
    } finally {
      this._loadPromise = null;
    }
  }

  refresh(): void {
    this._lastRenderKey = '';
    this._currentDescriptor = null;
    this.classList.remove('ma-icon--error');
    iconStore.clearCache();
    this._resolveIcon();
  }

  getCurrentDescriptor(): IconDescriptor | null {
    return this._currentDescriptor;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._intersectionObserver?.disconnect();
  }
}

// 确保自定义元素只定义一次
if (!customElements.get('ma-icon')) {
  customElements.define('ma-icon', MaIcon);
}

export default MaIcon;
