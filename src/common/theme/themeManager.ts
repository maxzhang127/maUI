// 主题管理器
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  compactMode?: boolean;
}

export class ThemeManager {
  private static _instance: ThemeManager;
  private _config: ThemeConfig = {
    mode: 'light',
    borderRadius: 'rounded',
    compactMode: false
  };
  private _listeners: Set<(config: ThemeConfig) => void> = new Set();
  private _mediaQuery: MediaQueryList;

  private constructor() {
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._mediaQuery.addEventListener('change', this._handleSystemThemeChange.bind(this));
    this._initTheme();
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager._instance) {
      ThemeManager._instance = new ThemeManager();
    }
    return ThemeManager._instance;
  }

  // 获取当前主题配置
  getConfig(): ThemeConfig {
    return { ...this._config };
  }

  // 设置主题模式
  setMode(mode: ThemeMode): void {
    if (this._config.mode !== mode) {
      this._config.mode = mode;
      this._applyTheme();
      this._notifyListeners();
      this._saveToStorage();
    }
  }

  // 设置主品牌色
  setPrimaryColor(color: string): void {
    if (this._config.primaryColor !== color) {
      this._config.primaryColor = color;
      this._applyPrimaryColor(color);
      this._notifyListeners();
      this._saveToStorage();
    }
  }

  // 设置圆角样式
  setBorderRadius(radius: 'sharp' | 'rounded' | 'pill'): void {
    if (this._config.borderRadius !== radius) {
      this._config.borderRadius = radius;
      this._applyBorderRadius(radius);
      this._notifyListeners();
      this._saveToStorage();
    }
  }

  // 设置紧凑模式
  setCompactMode(compact: boolean): void {
    if (this._config.compactMode !== compact) {
      this._config.compactMode = compact;
      this._applyCompactMode(compact);
      this._notifyListeners();
      this._saveToStorage();
    }
  }

  // 更新完整配置
  updateConfig(config: Partial<ThemeConfig>): void {
    const oldConfig = { ...this._config };
    this._config = { ...this._config, ...config };
    
    if (oldConfig.mode !== this._config.mode) {
      this._applyTheme();
    }
    
    if (oldConfig.primaryColor !== this._config.primaryColor && this._config.primaryColor) {
      this._applyPrimaryColor(this._config.primaryColor);
    }
    
    if (oldConfig.borderRadius !== this._config.borderRadius) {
      this._applyBorderRadius(this._config.borderRadius || 'rounded');
    }
    
    if (oldConfig.compactMode !== this._config.compactMode) {
      this._applyCompactMode(this._config.compactMode || false);
    }

    this._notifyListeners();
    this._saveToStorage();
  }

  // 切换主题模式
  toggleMode(): void {
    const newMode = this._config.mode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  // 监听主题变化
  subscribe(listener: (config: ThemeConfig) => void): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  // 获取当前实际主题（解析auto模式）
  getActualTheme(): 'light' | 'dark' {
    if (this._config.mode === 'auto') {
      return this._mediaQuery.matches ? 'dark' : 'light';
    }
    return this._config.mode;
  }

  // 初始化主题
  private _initTheme(): void {
    // 从本地存储加载配置
    this._loadFromStorage();
    
    // 应用主题
    this._applyTheme();
    
    // 应用其他配置
    if (this._config.primaryColor) {
      this._applyPrimaryColor(this._config.primaryColor);
    }
    
    this._applyBorderRadius(this._config.borderRadius || 'rounded');
    this._applyCompactMode(this._config.compactMode || false);
  }

  // 应用主题
  private _applyTheme(): void {
    const actualTheme = this.getActualTheme();
    document.documentElement.setAttribute('data-theme', actualTheme);
    
    // 更新meta标签
    this._updateMetaTheme(actualTheme);
  }

  // 应用主品牌色
  private _applyPrimaryColor(color: string): void {
    const root = document.documentElement;
    
    // 基础颜色
    root.style.setProperty('--ma-color-primary', color);
    
    // 生成渐变色
    const lightColor = this._lightenColor(color, 0.1);
    const lighterColor = this._lightenColor(color, 0.2);
    const darkColor = this._darkenColor(color, 0.1);
    const darkerColor = this._darkenColor(color, 0.2);
    
    root.style.setProperty('--ma-color-primary-light', lightColor);
    root.style.setProperty('--ma-color-primary-lighter', lighterColor);
    root.style.setProperty('--ma-color-primary-dark', darkColor);
    root.style.setProperty('--ma-color-primary-darker', darkerColor);
  }

  // 应用圆角样式
  private _applyBorderRadius(radius: 'sharp' | 'rounded' | 'pill'): void {
    const root = document.documentElement;
    
    switch (radius) {
      case 'sharp':
        root.style.setProperty('--ma-border-radius-sm', '0px');
        root.style.setProperty('--ma-border-radius-md', '0px');
        root.style.setProperty('--ma-border-radius-lg', '0px');
        break;
      case 'rounded':
        root.style.setProperty('--ma-border-radius-sm', '4px');
        root.style.setProperty('--ma-border-radius-md', '6px');
        root.style.setProperty('--ma-border-radius-lg', '8px');
        break;
      case 'pill':
        root.style.setProperty('--ma-border-radius-sm', '12px');
        root.style.setProperty('--ma-border-radius-md', '16px');
        root.style.setProperty('--ma-border-radius-lg', '20px');
        break;
    }
    
    document.documentElement.setAttribute('data-border-radius', radius);
  }

  // 应用紧凑模式
  private _applyCompactMode(compact: boolean): void {
    document.documentElement.setAttribute('data-compact', compact.toString());
    
    if (compact) {
      const root = document.documentElement;
      root.style.setProperty('--ma-spacing-xs', '2px');
      root.style.setProperty('--ma-spacing-sm', '4px');
      root.style.setProperty('--ma-spacing-md', '8px');
      root.style.setProperty('--ma-spacing-lg', '12px');
      root.style.setProperty('--ma-spacing-xl', '16px');
      
      root.style.setProperty('--ma-size-xs', '12px');
      root.style.setProperty('--ma-size-sm', '20px');
      root.style.setProperty('--ma-size-md', '28px');
      root.style.setProperty('--ma-size-lg', '36px');
      root.style.setProperty('--ma-size-xl', '44px');
    } else {
      // 恢复默认值
      const root = document.documentElement;
      root.style.removeProperty('--ma-spacing-xs');
      root.style.removeProperty('--ma-spacing-sm');
      root.style.removeProperty('--ma-spacing-md');
      root.style.removeProperty('--ma-spacing-lg');
      root.style.removeProperty('--ma-spacing-xl');
      
      root.style.removeProperty('--ma-size-xs');
      root.style.removeProperty('--ma-size-sm');
      root.style.removeProperty('--ma-size-md');
      root.style.removeProperty('--ma-size-lg');
      root.style.removeProperty('--ma-size-xl');
    }
  }

  // 更新页面meta主题色
  private _updateMetaTheme(theme: 'light' | 'dark'): void {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    
    const themeColor = theme === 'dark' ? '#141414' : '#ffffff';
    metaTheme.setAttribute('content', themeColor);
  }

  // 处理系统主题变化
  private _handleSystemThemeChange(e: MediaQueryListEvent): void {
    if (this._config.mode === 'auto') {
      this._applyTheme();
      this._notifyListeners();
    }
  }

  // 通知监听器
  private _notifyListeners(): void {
    this._listeners.forEach(listener => {
      try {
        listener(this.getConfig());
      } catch (error) {
        console.error('Theme listener error:', error);
      }
    });
  }

  // 保存到本地存储
  private _saveToStorage(): void {
    try {
      localStorage.setItem('maui-theme-config', JSON.stringify(this._config));
    } catch (error) {
      console.warn('Failed to save theme config to localStorage:', error);
    }
  }

  // 从本地存储加载
  private _loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('maui-theme-config');
      if (stored) {
        const config = JSON.parse(stored);
        this._config = { ...this._config, ...config };
      }
    } catch (error) {
      console.warn('Failed to load theme config from localStorage:', error);
    }
  }

  // 颜色工具函数
  private _lightenColor(color: string, amount: number): string {
    return this._adjustColor(color, amount);
  }

  private _darkenColor(color: string, amount: number): string {
    return this._adjustColor(color, -amount);
  }

  private _adjustColor(color: string, amount: number): string {
    // 简单的颜色调整实现
    // 在实际项目中可能需要更复杂的颜色处理库
    const usePound = color[0] === "#";
    const colorCode = usePound ? color.slice(1) : color;
    
    const num = parseInt(colorCode, 16);
    let r = (num >> 16) + Math.round(255 * amount);
    let g = (num >> 8 & 0x00FF) + Math.round(255 * amount);
    let b = (num & 0x0000FF) + Math.round(255 * amount);
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  }
}

// 导出单例实例
export const themeManager = ThemeManager.getInstance();

// 便捷函数
export function setTheme(mode: ThemeMode): void {
  themeManager.setMode(mode);
}

export function toggleTheme(): void {
  themeManager.toggleMode();
}

export function setPrimaryColor(color: string): void {
  themeManager.setPrimaryColor(color);
}

export function subscribeTheme(listener: (config: ThemeConfig) => void): () => void {
  return themeManager.subscribe(listener);
}