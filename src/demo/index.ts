import './entry';

import buttonDemoHTML from './template/button-demo.html';
import layoutDemoHTML from './template/layout-demo.html';
import gettingStartedHTML from './template/getting-started.html';
import themeHTML from './template/theme.html';

interface DemoContent {
  [key: string]: string;
}

class DemoApp {
  private contentWrapper!: HTMLElement;
  private navLinks!: NodeListOf<HTMLAnchorElement>;
  private currentComponent: string = 'getting-started';
  private demoContents: DemoContent = {
    button: buttonDemoHTML,
    layout: layoutDemoHTML,
    'getting-started': gettingStartedHTML,
    theme: themeHTML
  };

  constructor() {
    console.log('🎨 maUI Demo 应用已初始化');
    this.initializeElements();
    this.setupNavigation();
    this.renderContent('getting-started');
    this.bindGlobalEvents();
  }

  private initializeElements(): void {
    this.contentWrapper = document.querySelector('.content-wrapper') as HTMLElement;
    this.navLinks = document.querySelectorAll('.nav-link') as NodeListOf<HTMLAnchorElement>;
  }

  private setupNavigation(): void {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const component = link.dataset.component;
        if (component && this.demoContents[component]) {
          this.switchToComponent(component);
        }
      });
    });

    // 监听浏览器前进后退
    window.addEventListener('popstate', (e) => {
      const component = e.state?.component || 'getting-started';
      this.switchToComponent(component, false);
    });
  }

  private switchToComponent(component: string, pushState: boolean = true): void {
    if (component === this.currentComponent) return;

    // 更新导航状态
    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.component === component);
    });

    // 渲染内容
    this.renderContent(component);
    this.currentComponent = component;

    // 更新 URL
    if (pushState) {
      history.pushState({ component }, '', `#${component}`);
    }
  }

  private renderContent(component: string): void {
    const content = this.demoContents[component];
    if (content) {
      this.contentWrapper.innerHTML = content;
      this.bindComponentEvents(component);
    }
  }

  private bindComponentEvents(component: string): void {
    switch (component) {
      case 'button':
        this.bindButtonEvents();
        break;
      case 'layout':
        this.bindLayoutEvents();
        break;
      case 'theme':
        this.bindThemeEvents();
        break;
    }
  }

  private bindButtonEvents(): void {
    // Toggle Loading 按钮
    const toggleLoadingBtn = this.contentWrapper.querySelector('#toggle-loading') as HTMLElement;
    let isLoading = false;
    toggleLoadingBtn?.addEventListener('ma-click', () => {
      isLoading = !isLoading;
      toggleLoadingBtn.setAttribute('loading', isLoading ? 'true' : 'false');
      toggleLoadingBtn.textContent = isLoading ? 'Loading...' : 'Toggle Loading';
    });

    // 表单提交测试
    const testForm = this.contentWrapper.querySelector('#test-form') as HTMLFormElement;
    testForm?.addEventListener('submit', e => {
      e.preventDefault();
      this.logEvent('表单提交');
    });

    testForm?.addEventListener('reset', () => {
      this.logEvent('表单重置');
    });

    // 事件测试
    const clickTestBtn = this.contentWrapper.querySelector('#click-test');
    const focusTestBtn = this.contentWrapper.querySelector('#focus-test');

    clickTestBtn?.addEventListener('ma-click', e => {
      this.logEvent('ma-click 事件触发', e);
    });

    focusTestBtn?.addEventListener('ma-focus', e => {
      this.logEvent('ma-focus 事件触发', e);
    });

    focusTestBtn?.addEventListener('ma-blur', e => {
      this.logEvent('ma-blur 事件触发', e);
    });
  }

  private bindLayoutEvents(): void {
    // 可折叠侧边栏
    const toggleSiderBtn = this.contentWrapper.querySelector('#toggle-sider');
    const collapsibleLayout = this.contentWrapper.querySelector('#collapsible-layout') as any;

    toggleSiderBtn?.addEventListener('ma-click', () => {
      if (collapsibleLayout && typeof collapsibleLayout.toggleSider === 'function') {
        collapsibleLayout.toggleSider('api');
      }
    });

    // 监听折叠事件
    const eventTestLayout = this.contentWrapper.querySelector('#event-test-layout');
    const programmaticToggle = this.contentWrapper.querySelector('#programmatic-toggle');

    eventTestLayout?.addEventListener('ma-sider-toggle', (e: any) => {
      this.logLayoutEvent(`侧边栏${e.detail.collapsed ? '折叠' : '展开'} (${e.detail.source})`);
    });

    programmaticToggle?.addEventListener('ma-click', () => {
      if (eventTestLayout && typeof (eventTestLayout as any).toggleSider === 'function') {
        (eventTestLayout as any).toggleSider('api');
      }
    });
  }

  private bindThemeEvents(): void {

    // 主题切换按钮
    const defaultThemeBtn = this.contentWrapper.querySelector('#default-theme');
    const darkThemeBtn = this.contentWrapper.querySelector('#dark-theme');
    const colorfulThemeBtn = this.contentWrapper.querySelector('#colorful-theme');
    const minimalThemeBtn = this.contentWrapper.querySelector('#minimal-theme');

    defaultThemeBtn?.addEventListener('ma-click', () => {
      this.applyTheme('default');
      this.updateThemeButtonState('default-theme');
    });

    darkThemeBtn?.addEventListener('ma-click', () => {
      this.applyTheme('dark');
      this.updateThemeButtonState('dark-theme');
    });

    colorfulThemeBtn?.addEventListener('ma-click', () => {
      this.applyTheme('colorful');
      this.updateThemeButtonState('colorful-theme');
    });

    minimalThemeBtn?.addEventListener('ma-click', () => {
      this.applyTheme('minimal');
      this.updateThemeButtonState('minimal-theme');
    });
  }

  private applyTheme(theme: string): void {
    const root = document.documentElement;

    // 移除所有主题类
    root.className = root.className.replace(/theme-\w+/g, '');

    // 应用新主题
    switch (theme) {
      case 'dark':
        root.setAttribute('data-theme', 'dark');
        break;
      case 'colorful':
        root.classList.add('theme-colorful');
        root.removeAttribute('data-theme');
        break;
      case 'minimal':
        root.classList.add('theme-minimal');
        root.removeAttribute('data-theme');
        break;
      default:
        root.removeAttribute('data-theme');
        break;
    }
  }

  private updateThemeButtonState(activeId: string): void {
    const themeButtons = this.contentWrapper.querySelectorAll('.theme-switcher ma-button');
    themeButtons.forEach(btn => {
      btn.setAttribute('variant', btn.id === activeId ? 'primary' : 'secondary');
    });
  }

  private bindGlobalEvents(): void {
    // 监听布局组件的事件
    document.addEventListener('ma-sider-toggle', (e: any) => {
      console.log('Layout sider toggled:', e.detail);
    });
  }

  private logEvent(message: string, event?: unknown): void {
    const eventLog = this.contentWrapper.querySelector('#event-log');
    this.addLogEntry(eventLog, message, event);
  }

  private logLayoutEvent(message: string): void {
    const eventLog = this.contentWrapper.querySelector('#layout-event-log');
    this.addLogEntry(eventLog, message);
  }

  private addLogEntry(eventLog: Element | null, message: string, event?: unknown): void {
    if (eventLog) {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
      eventLog.appendChild(logEntry);

      // 保持最新的10条记录
      const entries = eventLog.querySelectorAll('.log-entry');
      if (entries.length > 10) {
        entries[0].remove();
      }
    }

    console.log(message, event);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DemoApp();
});
