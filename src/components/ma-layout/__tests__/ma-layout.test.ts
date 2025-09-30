import { MaLayout } from '../ma-layout';

describe('MaLayout', () => {
  let layout: MaLayout;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.warn before creating the component to prevent noise in tests
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    layout = document.createElement('ma-layout') as MaLayout;
    document.body.appendChild(layout);

    // Clear the spy calls from initialization
    consoleWarnSpy.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(layout);
    consoleWarnSpy.mockRestore();
  });

  describe('Initialization', () => {
    it('should create layout element', () => {
      expect(layout).toBeInstanceOf(MaLayout);
      expect(layout.tagName.toLowerCase()).toBe('ma-layout');
    });

    it('should have shadow root', () => {
      expect(layout.shadowRoot).toBeTruthy();
    });

    it('should render main layout structure', () => {
      const shadowRoot = layout.shadowRoot!;
      expect(shadowRoot.querySelector('.ma-layout')).toBeTruthy();
      expect(shadowRoot.querySelector('[part="header"]')).toBeTruthy();
      expect(shadowRoot.querySelector('[part="subheader"]')).toBeTruthy();
      expect(shadowRoot.querySelector('[part="sider"]')).toBeTruthy();
      expect(shadowRoot.querySelector('[part="content"]')).toBeTruthy();
      expect(shadowRoot.querySelector('[part="footer"]')).toBeTruthy();
    });
  });

  describe('Default Properties', () => {
    it('should have correct default values', () => {
      expect(layout.orientation).toBe('vertical');
      expect(layout.hasSider).toBe(false);
      expect(layout.siderPosition).toBe('left');
      expect(layout.collapsible).toBe(false);
      expect(layout.collapsed).toBe(false);
      expect(layout.padding).toBe('comfortable');
      expect(layout.gap).toBe('md');
      expect(layout.contentScroll).toBe('contain');
      expect(layout.stickyHeader).toBe(false);
      expect(layout.stickyFooter).toBe(false);
    });

    it('should have default breakpoints', () => {
      const breakpoints = layout.breakpoints;
      expect(breakpoints.sm).toBe(640);
      expect(breakpoints.md).toBe(960);
      expect(breakpoints.lg).toBe(1200);
    });
  });

  describe('Property Setters', () => {
    it('should update orientation', () => {
      layout.orientation = 'horizontal';
      expect(layout.orientation).toBe('horizontal');
      expect(layout.getAttribute('orientation')).toBe('horizontal');
    });

    it('should update has-sider', () => {
      layout.hasSider = true;
      expect(layout.hasSider).toBe(true);
      expect(layout.hasAttribute('has-sider')).toBe(true);
    });

    it('should update sider position', () => {
      layout.siderPosition = 'right';
      expect(layout.siderPosition).toBe('right');
      expect(layout.getAttribute('sider-position')).toBe('right');
    });

    it('should update collapsible state', () => {
      layout.collapsible = true;
      expect(layout.collapsible).toBe(true);
      expect(layout.hasAttribute('collapsible')).toBe(true);
    });

    it('should update collapsed state', () => {
      layout.collapsed = true;
      expect(layout.collapsed).toBe(true);
      expect(layout.hasAttribute('collapsed')).toBe(true);
    });

    it('should update padding', () => {
      layout.padding = 'compact';
      expect(layout.padding).toBe('compact');
      expect(layout.getAttribute('padding')).toBe('compact');
    });

    it('should update gap', () => {
      layout.gap = 'lg';
      expect(layout.gap).toBe('lg');
      expect(layout.getAttribute('gap')).toBe('lg');
    });

    it('should update content scroll', () => {
      layout.contentScroll = 'page';
      expect(layout.contentScroll).toBe('page');
      expect(layout.getAttribute('content-scroll')).toBe('page');
    });

    it('should update sticky header', () => {
      layout.stickyHeader = true;
      expect(layout.stickyHeader).toBe(true);
      expect(layout.hasAttribute('sticky-header')).toBe(true);
    });

    it('should update sticky footer', () => {
      layout.stickyFooter = true;
      expect(layout.stickyFooter).toBe(true);
      expect(layout.hasAttribute('sticky-footer')).toBe(true);
    });
  });

  describe('Sider Functionality', () => {
    beforeEach(() => {
      layout.hasSider = true;
      layout.collapsible = true;
    });

    it('should toggle sider state', () => {
      const initialState = layout.collapsed;
      layout.toggleSider();
      expect(layout.collapsed).toBe(!initialState);
    });

    it('should collapse sider', () => {
      layout.expandSider();
      expect(layout.collapsed).toBe(false);

      layout.collapseSider();
      expect(layout.collapsed).toBe(true);
    });

    it('should expand sider', () => {
      layout.collapseSider();
      expect(layout.collapsed).toBe(true);

      layout.expandSider();
      expect(layout.collapsed).toBe(false);
    });

    it('should emit sider toggle event', () => {
      const eventSpy = jest.fn();
      layout.addEventListener('ma-sider-toggle', eventSpy);

      layout.toggleSider('api');

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            collapsed: true,
            source: 'api',
          }),
        })
      );
    });

    it('should warn when toggling without sider', () => {
      layout.hasSider = false;

      layout.toggleSider();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ma-layout: Cannot toggle sider when has-sider is false'
      );
    });
  });

  describe('Breakpoints', () => {
    it('should accept custom breakpoints object', () => {
      const customBreakpoints = { sm: 480, md: 768, lg: 1024 };
      layout.breakpoints = customBreakpoints;

      const result = layout.breakpoints;
      expect(result.sm).toBe(480);
      expect(result.md).toBe(768);
      expect(result.lg).toBe(1024);
    });

    it('should accept breakpoints as JSON string', () => {
      layout.breakpoints = '{"sm": 480, "md": 768, "lg": 1024}';

      const result = layout.breakpoints;
      expect(result.sm).toBe(480);
      expect(result.md).toBe(768);
      expect(result.lg).toBe(1024);
    });

    it('should fallback to defaults on invalid JSON', () => {
      layout.breakpoints = 'invalid json';

      const result = layout.breakpoints;
      expect(result.sm).toBe(640);
      expect(result.md).toBe(960);
      expect(result.lg).toBe(1200);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ma-layout: Invalid breakpoints JSON, using defaults'
      );
    });
  });

  describe('Scroll Functionality', () => {
    it('should have scroll to content method', () => {
      expect(typeof layout.scrollToContent).toBe('function');
    });

    it('should scroll to specified position', () => {
      const scrollContainer = layout.shadowRoot!.querySelector(
        '.scroll-container'
      ) as HTMLElement;

      // Mock scrollTo method since it doesn't exist in jsdom
      scrollContainer.scrollTo = jest.fn();
      const scrollToSpy = jest.spyOn(scrollContainer, 'scrollTo');

      layout.scrollToContent({ top: 100, behavior: 'smooth' });

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 100,
        behavior: 'smooth',
      });
      scrollToSpy.mockRestore();
    });
  });

  describe('Slot Management', () => {
    it('should handle slot changes', () => {
      const headerSlot = layout.shadowRoot!.querySelector(
        'slot[name="header"]'
      ) as HTMLSlotElement;
      const headerDiv = document.createElement('div');
      headerDiv.slot = 'header';
      headerDiv.textContent = 'Header Content';

      // Add the element first
      layout.appendChild(headerDiv);

      // Mock assignedElements to return the expected element
      const originalAssignedElements =
        headerSlot.assignedElements.bind(headerSlot);
      headerSlot.assignedElements = jest.fn().mockReturnValue([headerDiv]);

      // Directly call the slot update method
      (layout as any)._updateSlotState(headerSlot, 'header');

      expect(layout.dataset.slotHeaderEmpty).toBe('false');

      // Restore original method
      headerSlot.assignedElements = originalAssignedElements;
    });

    it('should warn when content slot is empty', () => {
      const contentSlot = layout.shadowRoot!.querySelector(
        'slot[name="content"]'
      ) as HTMLSlotElement;

      // Mock assignedElements to return empty array (no content)
      const originalAssignedElements =
        contentSlot.assignedElements.bind(contentSlot);
      contentSlot.assignedElements = jest.fn().mockReturnValue([]);

      // Directly call the slot update method
      (layout as any)._updateSlotState(contentSlot, 'content');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ma-layout: Content slot is empty, which may cause layout issues'
      );

      // Restore original method
      contentSlot.assignedElements = originalAssignedElements;
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      layout.hasSider = true;
      layout.collapsible = true;
    });

    it('should set aria-expanded on sider', () => {
      const sider = layout.shadowRoot!.querySelector(
        '[part="sider"]'
      ) as HTMLElement;

      layout.collapsed = false;
      expect(sider.getAttribute('aria-expanded')).toBe('true');

      layout.collapsed = true;
      expect(sider.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update toggle button aria-label', () => {
      const toggleButton = layout.shadowRoot!.querySelector(
        '[part="toggle"]'
      ) as HTMLButtonElement;

      layout.collapsed = false;
      expect(toggleButton.getAttribute('aria-label')).toBe('Collapse sidebar');

      layout.collapsed = true;
      expect(toggleButton.getAttribute('aria-label')).toBe('Expand sidebar');
    });

    it('should set aria-controls on toggle button', () => {
      const toggleButton = layout.shadowRoot!.querySelector(
        '[part="toggle"]'
      ) as HTMLButtonElement;
      const sider = layout.shadowRoot!.querySelector(
        '[part="sider"]'
      ) as HTMLElement;

      expect(toggleButton.getAttribute('aria-controls')).toBe(sider.id);
    });
  });

  describe('CSS Classes', () => {
    it('should apply orientation classes', () => {
      const container = layout.shadowRoot!.querySelector(
        '.ma-layout'
      ) as HTMLElement;

      layout.orientation = 'horizontal';
      expect(container.classList.contains('orientation-horizontal')).toBe(true);
    });

    it('should apply sider classes', () => {
      const container = layout.shadowRoot!.querySelector(
        '.ma-layout'
      ) as HTMLElement;

      layout.hasSider = true;
      layout.siderPosition = 'right';

      expect(container.classList.contains('has-sider')).toBe(true);
      expect(container.classList.contains('sider-right')).toBe(true);
    });

    it('should apply collapsed class', () => {
      const container = layout.shadowRoot!.querySelector(
        '.ma-layout'
      ) as HTMLElement;

      layout.hasSider = true;
      layout.collapsed = true;

      expect(container.classList.contains('collapsed')).toBe(true);
    });

    it('should apply padding classes', () => {
      const container = layout.shadowRoot!.querySelector(
        '.ma-layout'
      ) as HTMLElement;

      layout.padding = 'compact';
      expect(container.classList.contains('padding-compact')).toBe(true);
    });

    it('should apply gap classes', () => {
      const container = layout.shadowRoot!.querySelector(
        '.ma-layout'
      ) as HTMLElement;

      layout.gap = 'lg';
      expect(container.classList.contains('gap-lg')).toBe(true);
    });

    it('should apply sticky classes', () => {
      const container = layout.shadowRoot!.querySelector(
        '.ma-layout'
      ) as HTMLElement;

      layout.stickyHeader = true;
      layout.stickyFooter = true;

      expect(container.classList.contains('sticky-header')).toBe(true);
      expect(container.classList.contains('sticky-footer')).toBe(true);
    });
  });

  describe('Attribute Validation', () => {
    it('should validate orientation values', () => {
      layout.setAttribute('orientation', 'invalid');
      expect(layout.orientation).toBe('vertical'); // should fallback to default

      layout.setAttribute('orientation', 'horizontal');
      expect(layout.orientation).toBe('horizontal');
    });

    it('should validate sider position values', () => {
      layout.setAttribute('sider-position', 'invalid');
      expect(layout.siderPosition).toBe('left'); // should fallback to default

      layout.setAttribute('sider-position', 'right');
      expect(layout.siderPosition).toBe('right');
    });

    it('should validate padding values', () => {
      layout.setAttribute('padding', 'invalid');
      expect(layout.padding).toBe('comfortable'); // should fallback to default

      layout.setAttribute('padding', 'compact');
      expect(layout.padding).toBe('compact');
    });

    it('should validate gap values', () => {
      layout.setAttribute('gap', 'invalid');
      expect(layout.gap).toBe('md'); // should fallback to default

      layout.setAttribute('gap', 'lg');
      expect(layout.gap).toBe('lg');
    });

    it('should validate content scroll values', () => {
      layout.setAttribute('content-scroll', 'invalid');
      expect(layout.contentScroll).toBe('contain'); // should fallback to default

      layout.setAttribute('content-scroll', 'page');
      expect(layout.contentScroll).toBe('page');
    });
  });
});
