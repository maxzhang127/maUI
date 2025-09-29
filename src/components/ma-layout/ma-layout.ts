import { ComponentsBase, ComponentConfig } from '../componentsBase';
import styles from './ma-layout.scss?inline';
import template from '@tpl/ma-layout.html';

export type OrientationType = 'vertical' | 'horizontal';
export type SiderPositionType = 'left' | 'right';
export type PaddingType = 'none' | 'compact' | 'comfortable';
export type GapType = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type ContentScrollType = 'contain' | 'page' | 'none';
export type BreakpointType = 'sm' | 'md' | 'lg';

export interface LayoutBreakpoints {
  sm: number;
  md: number;
  lg: number;
  [key: string]: number;
}

export interface SiderToggleEventDetail {
  collapsed: boolean;
  source: 'toggle' | 'api';
  width: number;
  [key: string]: unknown;
}

export interface BreakpointChangeEventDetail {
  breakpoint: BreakpointType | string;
  width: number;
  [key: string]: unknown;
}

export interface ScrollEventDetail {
  position: {
    top: number;
    left: number;
    maxTop: number;
  };
  direction: 'up' | 'down';
  [key: string]: unknown;
}

export class MaLayout extends ComponentsBase {
  private _resizeObserver?: ResizeObserver;
  private _scrollContainer?: HTMLElement;
  private _headerElement?: HTMLElement;
  private _siderElement?: HTMLElement;
  private _toggleButton?: HTMLButtonElement;
  private _currentBreakpoint: BreakpointType | string = 'lg';
  private _lastScrollTop = 0;
  private _scrollTimer?: number;

  static get observedAttributes(): string[] {
    return [
      'orientation',
      'has-sider',
      'sider-position',
      'collapsible',
      'collapsed',
      'padding',
      'gap',
      'content-scroll',
      'sticky-header',
      'sticky-footer',
      'breakpoints',
    ];
  }

  constructor() {
    super({
      tagName: 'ma-layout',
      styles,
      shadowMode: 'open',
      observedAttributes: MaLayout.observedAttributes,
    } as ComponentConfig);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._completeInitialization();
    this._setupResizeObserver();
    this._updateBreakpoint();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanup();
  }

  protected _createElements(): void {
    this._shadowRoot.innerHTML = template;

    this._scrollContainer = this._shadowRoot.querySelector(
      '.scroll-container'
    ) as HTMLElement;
    this._headerElement = this._shadowRoot.querySelector(
      '[part="header"]'
    ) as HTMLElement;
    this._siderElement = this._shadowRoot.querySelector(
      '[part="sider"]'
    ) as HTMLElement;
    this._toggleButton = this._shadowRoot.querySelector(
      '[part="toggle"]'
    ) as HTMLButtonElement;

    this._setupSlots();
  }

  protected _bindEvents(): void {
    if (this._toggleButton) {
      this._toggleButton.addEventListener('click', () => {
        this.toggleSider('toggle');
      });
    }

    if (this._scrollContainer) {
      this._scrollContainer.addEventListener(
        'scroll',
        this._handleScroll.bind(this)
      );
    }

    this._shadowRoot.addEventListener(
      'slotchange',
      this._handleSlotChange.bind(this)
    );
  }

  protected _updateComponent(): void {
    this._updateLayoutClasses();
    this._updateGridTemplate();
    this._updateSiderState();
    this._updateStickyElements();
    this._updateScrollContainer();
    this._updateToggleButton();
  }

  // Public Properties
  get orientation(): OrientationType {
    return this._getAttributeWithDefault('orientation', 'vertical', [
      'vertical',
      'horizontal',
    ]);
  }

  set orientation(value: OrientationType) {
    this._setAttribute('orientation', value);
  }

  get hasSider(): boolean {
    return this._getBooleanAttribute('has-sider');
  }

  set hasSider(value: boolean) {
    this._setAttribute('has-sider', value);
  }

  get siderPosition(): SiderPositionType {
    return this._getAttributeWithDefault('sider-position', 'left', [
      'left',
      'right',
    ]);
  }

  set siderPosition(value: SiderPositionType) {
    this._setAttribute('sider-position', value);
  }

  get collapsible(): boolean {
    return this._getBooleanAttribute('collapsible');
  }

  set collapsible(value: boolean) {
    this._setAttribute('collapsible', value);
  }

  get collapsed(): boolean {
    return this._getBooleanAttribute('collapsed');
  }

  set collapsed(value: boolean) {
    this._setAttribute('collapsed', value);
  }

  get padding(): PaddingType {
    return this._getAttributeWithDefault('padding', 'comfortable', [
      'none',
      'compact',
      'comfortable',
    ]);
  }

  set padding(value: PaddingType) {
    this._setAttribute('padding', value);
  }

  get gap(): GapType {
    return this._getAttributeWithDefault('gap', 'md', [
      'none',
      'xs',
      'sm',
      'md',
      'lg',
    ]);
  }

  set gap(value: GapType) {
    this._setAttribute('gap', value);
  }

  get contentScroll(): ContentScrollType {
    return this._getAttributeWithDefault('content-scroll', 'contain', [
      'contain',
      'page',
      'none',
    ]);
  }

  set contentScroll(value: ContentScrollType) {
    this._setAttribute('content-scroll', value);
  }

  get stickyHeader(): boolean {
    return this._getBooleanAttribute('sticky-header');
  }

  set stickyHeader(value: boolean) {
    this._setAttribute('sticky-header', value);
  }

  get stickyFooter(): boolean {
    return this._getBooleanAttribute('sticky-footer');
  }

  set stickyFooter(value: boolean) {
    this._setAttribute('sticky-footer', value);
  }

  get breakpoints(): LayoutBreakpoints {
    const attr = this.getAttribute('breakpoints');
    if (!attr) {
      return { sm: 640, md: 960, lg: 1200 };
    }

    try {
      const parsed = JSON.parse(attr);
      return { sm: 640, md: 960, lg: 1200, ...parsed };
    } catch {
      console.warn('ma-layout: Invalid breakpoints JSON, using defaults');
      return { sm: 640, md: 960, lg: 1200 };
    }
  }

  set breakpoints(value: LayoutBreakpoints | string) {
    if (typeof value === 'string') {
      this._setAttribute('breakpoints', value);
    } else {
      this._setAttribute('breakpoints', JSON.stringify(value));
    }
    this._updateBreakpoint();
  }

  // Public Methods
  toggleSider(source: 'toggle' | 'api' = 'api'): void {
    if (!this.hasSider) {
      console.warn('ma-layout: Cannot toggle sider when has-sider is false');
      return;
    }

    this.collapsed = !this.collapsed;
    this._dispatchSiderToggleEvent(source);
  }

  collapseSider(): void {
    if (!this.collapsed) {
      this.collapsed = true;
      this._dispatchSiderToggleEvent('api');
    }
  }

  expandSider(): void {
    if (this.collapsed) {
      this.collapsed = false;
      this._dispatchSiderToggleEvent('api');
      this._focusFirstSiderElement();
    }
  }

  scrollToContent(options: ScrollToOptions = { top: 0 }): void {
    if (this._scrollContainer) {
      this._scrollContainer.scrollTo(options);
    }
  }

  // Private Methods
  private _setupSlots(): void {
    const slots = ['header', 'subheader', 'sider', 'content', 'footer'];
    slots.forEach(slotName => {
      const slot = this._shadowRoot.querySelector(
        `slot[name="${slotName}"]`
      ) as HTMLSlotElement;
      if (slot) {
        this._updateSlotState(slot, slotName);
      }
    });
  }

  private _handleSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const slotName = slot.getAttribute('name') || 'default';
    this._updateSlotState(slot, slotName);
  }

  private _updateSlotState(slot: HTMLSlotElement, slotName: string): void {
    const hasContent = slot.assignedElements().length > 0;
    this.dataset[
      `slot${slotName.charAt(0).toUpperCase() + slotName.slice(1)}Empty`
    ] = (!hasContent).toString();

    if (slotName === 'content' && !hasContent) {
      console.warn(
        'ma-layout: Content slot is empty, which may cause layout issues'
      );
    }
  }

  private _updateLayoutClasses(): void {
    const container = this._shadowRoot.querySelector(
      '.ma-layout'
    ) as HTMLElement;
    if (!container) return;

    container.className = 'ma-layout';
    container.classList.add(`orientation-${this.orientation}`);
    container.classList.add(`padding-${this.padding}`);
    container.classList.add(`gap-${this.gap}`);
    container.classList.add(`content-scroll-${this.contentScroll}`);

    if (this.hasSider) {
      container.classList.add('has-sider');
      container.classList.add(`sider-${this.siderPosition}`);
    }

    if (this.collapsed) {
      container.classList.add('collapsed');
    }

    if (this.stickyHeader) {
      container.classList.add('sticky-header');
    }

    if (this.stickyFooter) {
      container.classList.add('sticky-footer');
    }

    container.dataset.breakpoint = this._currentBreakpoint;
  }

  private _updateGridTemplate(): void {
    const container = this._shadowRoot.querySelector(
      '.ma-layout'
    ) as HTMLElement;
    if (!container) return;

    if (this.orientation === 'horizontal') {
      // Horizontal layout uses rows
      container.style.gridTemplateColumns = '1fr';
      if (this.hasSider) {
        const siderWidth = this.collapsed
          ? 'var(--ma-layout-sider-width-collapsed)'
          : 'var(--ma-layout-sider-width)';
        if (this.siderPosition === 'left') {
          container.style.gridTemplateRows = `auto auto ${siderWidth} 1fr auto`;
        } else {
          container.style.gridTemplateRows = `auto auto 1fr ${siderWidth} auto`;
        }
      } else {
        container.style.gridTemplateRows = 'auto auto 1fr auto';
      }
    } else {
      // Vertical layout uses columns
      container.style.gridTemplateRows = 'auto auto 1fr auto';
      if (this.hasSider) {
        const siderWidth = this.collapsed
          ? 'var(--ma-layout-sider-width-collapsed)'
          : 'var(--ma-layout-sider-width)';
        if (this.siderPosition === 'left') {
          container.style.gridTemplateColumns = `${siderWidth} 1fr`;
        } else {
          container.style.gridTemplateColumns = `1fr ${siderWidth}`;
        }
      } else {
        container.style.gridTemplateColumns = '1fr';
      }
    }
  }

  private _updateSiderState(): void {
    if (!this._siderElement) return;

    this._siderElement.setAttribute(
      'aria-expanded',
      (!this.collapsed).toString()
    );

    if (this.collapsed) {
      this._siderElement.setAttribute(
        'aria-label',
        'Collapsed navigation sidebar'
      );
    } else {
      this._siderElement.setAttribute('aria-label', 'Navigation sidebar');
    }
  }

  private _updateStickyElements(): void {
    if (this._headerElement) {
      if (this.stickyHeader) {
        this._headerElement.style.position = 'sticky';
        this._headerElement.style.top = '0';
        this._headerElement.style.zIndex = '100';
      } else {
        this._headerElement.style.position = '';
        this._headerElement.style.top = '';
        this._headerElement.style.zIndex = '';
      }
    }
  }

  private _updateScrollContainer(): void {
    if (!this._scrollContainer) return;

    if (this.contentScroll === 'contain') {
      this._scrollContainer.style.overflow = 'auto';
    } else {
      this._scrollContainer.style.overflow = 'visible';
    }
  }

  private _updateToggleButton(): void {
    if (!this._toggleButton) return;

    if (this.collapsible && this.hasSider) {
      this._toggleButton.style.display = 'block';
      this._toggleButton.setAttribute(
        'aria-label',
        this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'
      );
      this._toggleButton.setAttribute(
        'aria-controls',
        this._siderElement?.id || 'sider'
      );
    } else {
      this._toggleButton.style.display = 'none';
    }
  }

  private _setupResizeObserver(): void {
    if ('ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          this._updateBreakpoint(entry.contentRect.width);
        }
      });
      this._resizeObserver.observe(this);
    }
  }

  private _updateBreakpoint(width?: number): void {
    const currentWidth = width || this.offsetWidth;
    const breakpoints = this.breakpoints;

    let newBreakpoint: BreakpointType | string = 'lg';

    // Sort breakpoints by value
    const sortedBreakpoints = Object.entries(breakpoints).sort(
      ([, a], [, b]) => a - b
    );

    for (const [name, value] of sortedBreakpoints) {
      if (currentWidth >= value) {
        newBreakpoint = name;
      } else {
        break;
      }
    }

    if (newBreakpoint !== this._currentBreakpoint) {
      this._currentBreakpoint = newBreakpoint;
      this.dataset.breakpoint = newBreakpoint;

      // Auto-collapse on small screens
      if (newBreakpoint === 'sm' && this.hasSider && !this.collapsed) {
        this.collapsed = true;
      }

      this._dispatchCustomEvent('ma-breakpoint-change', {
        breakpoint: newBreakpoint,
        width: currentWidth,
      } as BreakpointChangeEventDetail);
    }
  }

  private _handleScroll(): void {
    if (!this._scrollContainer) return;

    if (this._scrollTimer) {
      clearTimeout(this._scrollTimer);
    }

    this._scrollTimer = window.setTimeout(() => {
      if (!this._scrollContainer) return;

      const { scrollTop, scrollLeft, scrollHeight, clientHeight } =
        this._scrollContainer;
      const maxTop = scrollHeight - clientHeight;
      const direction = scrollTop > this._lastScrollTop ? 'down' : 'up';

      this._lastScrollTop = scrollTop;

      // Update sticky header shadow
      if (this.stickyHeader && this._headerElement) {
        this._headerElement.dataset.shadow = (scrollTop > 8).toString();
      }

      this._dispatchCustomEvent('ma-scroll', {
        position: { top: scrollTop, left: scrollLeft, maxTop },
        direction,
      } as ScrollEventDetail);
    }, 100); // Throttle to 100ms
  }

  private _dispatchSiderToggleEvent(source: 'toggle' | 'api'): void {
    const siderWidth = this._siderElement?.offsetWidth || 0;

    this._dispatchCustomEvent('ma-sider-toggle', {
      collapsed: this.collapsed,
      source,
      width: siderWidth,
    } as SiderToggleEventDetail);
  }

  private _focusFirstSiderElement(): void {
    if (!this._siderElement) return;

    const focusableElements = this._siderElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  }

  private _cleanup(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    if (this._scrollTimer) {
      clearTimeout(this._scrollTimer);
    }
  }
}

// Register the custom element
if (!customElements.get('ma-layout')) {
  customElements.define('ma-layout', MaLayout);
}
