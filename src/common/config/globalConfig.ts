// 全局配置管理器
export interface GlobalConfig {
  // 组件默认配置
  componentDefaults: {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant: string;
    color: string;
  };
  
  // 国际化配置
  locale: string;
  
  // 主题配置
  theme: {
    mode: 'light' | 'dark' | 'auto';
    primaryColor: string;
    borderRadius: 'sharp' | 'rounded' | 'pill';
    compactMode: boolean;
  };
  
  // 功能开关
  features: {
    animations: boolean;
    sounds: boolean;
    hapticFeedback: boolean;
    accessibility: boolean;
  };
  
  // 性能配置
  performance: {
    lazyLoading: boolean;
    virtualScrolling: boolean;
    batchUpdates: boolean;
  };
  
  // 调试配置
  debug: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    showBoundingBoxes: boolean;
  };
}

export class GlobalConfigManager {
  private static _instance: GlobalConfigManager;
  private _config: GlobalConfig;
  private _listeners: Set<(config: GlobalConfig) => void> = new Set();

  private constructor() {
    this._config = this._getDefaultConfig();
    this._loadFromStorage();
    this._applyConfig();
  }

  static getInstance(): GlobalConfigManager {
    if (!GlobalConfigManager._instance) {
      GlobalConfigManager._instance = new GlobalConfigManager();
    }
    return GlobalConfigManager._instance;
  }

  // 获取配置
  getConfig(): GlobalConfig {
    return { ...this._config };
  }

  // 更新配置
  updateConfig(updates: Partial<GlobalConfig>): void {
    const oldConfig = { ...this._config };
    this._config = this._deepMerge(this._config, updates);
    
    this._applyConfig();
    this._saveToStorage();
    this._notifyListeners();
  }

  // 重置配置
  resetConfig(): void {
    this._config = this._getDefaultConfig();
    this._applyConfig();
    this._saveToStorage();
    this._notifyListeners();
  }

  // 监听配置变化
  subscribe(listener: (config: GlobalConfig) => void): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  // 获取组件默认配置
  getComponentDefault<T extends keyof GlobalConfig['componentDefaults']>(
    key: T
  ): GlobalConfig['componentDefaults'][T] {
    return this._config.componentDefaults[key];
  }

  // 设置组件默认配置
  setComponentDefault<T extends keyof GlobalConfig['componentDefaults']>(
    key: T,
    value: GlobalConfig['componentDefaults'][T]
  ): void {
    this._config.componentDefaults[key] = value;
    this._saveToStorage();
    this._notifyListeners();
  }

  // 获取功能开关状态
  isFeatureEnabled(feature: keyof GlobalConfig['features']): boolean {
    return this._config.features[feature];
  }

  // 切换功能开关
  toggleFeature(feature: keyof GlobalConfig['features']): void {
    this._config.features[feature] = !this._config.features[feature];
    this._applyFeatureConfig(feature);
    this._saveToStorage();
    this._notifyListeners();
  }

  // 获取默认配置
  private _getDefaultConfig(): GlobalConfig {
    return {
      componentDefaults: {
        size: 'md',
        variant: 'filled',
        color: 'primary'
      },
      locale: 'zh-CN',
      theme: {
        mode: 'light',
        primaryColor: '#1890ff',
        borderRadius: 'rounded',
        compactMode: false
      },
      features: {
        animations: true,
        sounds: false,
        hapticFeedback: false,
        accessibility: true
      },
      performance: {
        lazyLoading: true,
        virtualScrolling: false,
        batchUpdates: true
      },
      debug: {
        enabled: false,
        logLevel: 'warn',
        showBoundingBoxes: false
      }
    };
  }

  // 应用配置
  private _applyConfig(): void {
    this._applyThemeConfig();
    this._applyFeatureConfigs();
    this._applyPerformanceConfig();
    this._applyDebugConfig();
  }

  // 应用主题配置
  private _applyThemeConfig(): void {
    const { theme } = this._config;
    const root = document.documentElement;
    
    // 主题模式
    root.setAttribute('data-theme', theme.mode === 'auto' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      theme.mode
    );
    
    // 主色调
    root.style.setProperty('--ma-color-primary', theme.primaryColor);
    
    // 圆角样式
    root.setAttribute('data-border-radius', theme.borderRadius);
    
    // 紧凑模式
    root.setAttribute('data-compact', theme.compactMode.toString());
  }

  // 应用功能配置
  private _applyFeatureConfigs(): void {
    Object.entries(this._config.features).forEach(([feature, enabled]) => {
      this._applyFeatureConfig(feature as keyof GlobalConfig['features']);
    });
  }

  // 应用单个功能配置
  private _applyFeatureConfig(feature: keyof GlobalConfig['features']): void {
    const enabled = this._config.features[feature];
    const root = document.documentElement;
    
    switch (feature) {
      case 'animations':
        root.setAttribute('data-animations', enabled.toString());
        if (!enabled) {
          root.style.setProperty('--ma-duration-fast', '0ms');
          root.style.setProperty('--ma-duration-normal', '0ms');
          root.style.setProperty('--ma-duration-slow', '0ms');
        }
        break;
        
      case 'accessibility':
        root.setAttribute('data-accessibility', enabled.toString());
        break;
        
      case 'sounds':
        root.setAttribute('data-sounds', enabled.toString());
        break;
        
      case 'hapticFeedback':
        root.setAttribute('data-haptic', enabled.toString());
        break;
    }
  }

  // 应用性能配置
  private _applyPerformanceConfig(): void {
    const { performance } = this._config;
    const root = document.documentElement;
    
    root.setAttribute('data-lazy-loading', performance.lazyLoading.toString());
    root.setAttribute('data-virtual-scrolling', performance.virtualScrolling.toString());
    root.setAttribute('data-batch-updates', performance.batchUpdates.toString());
  }

  // 应用调试配置
  private _applyDebugConfig(): void {
    const { debug } = this._config;
    const root = document.documentElement;
    
    root.setAttribute('data-debug', debug.enabled.toString());
    root.setAttribute('data-debug-level', debug.logLevel);
    root.setAttribute('data-debug-boxes', debug.showBoundingBoxes.toString());
    
    // 调试边框样式
    if (debug.showBoundingBoxes) {
      this._addDebugStyles();
    } else {
      this._removeDebugStyles();
    }
  }

  // 添加调试样式
  private _addDebugStyles(): void {
    const existingStyle = document.getElementById('maui-debug-styles');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'maui-debug-styles';
    style.textContent = `
      [data-debug-boxes="true"] * {
        outline: 1px solid rgba(255, 0, 0, 0.3) !important;
      }
      [data-debug-boxes="true"] *:hover {
        outline: 2px solid rgba(255, 0, 0, 0.8) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 移除调试样式
  private _removeDebugStyles(): void {
    const style = document.getElementById('maui-debug-styles');
    if (style) {
      style.remove();
    }
  }

  // 深度合并对象
  private _deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // 通知监听器
  private _notifyListeners(): void {
    this._listeners.forEach(listener => {
      try {
        listener(this.getConfig());
      } catch (error) {
        console.error('Global config listener error:', error);
      }
    });
  }

  // 保存到本地存储
  private _saveToStorage(): void {
    try {
      localStorage.setItem('maui-global-config', JSON.stringify(this._config));
    } catch (error) {
      console.warn('Failed to save global config:', error);
    }
  }

  // 从本地存储加载
  private _loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('maui-global-config');
      if (stored) {
        const config = JSON.parse(stored);
        this._config = this._deepMerge(this._config, config);
      }
    } catch (error) {
      console.warn('Failed to load global config:', error);
    }
  }
}

// 导出单例实例
export const globalConfig = GlobalConfigManager.getInstance();

// 便捷函数
export function updateGlobalConfig(updates: Partial<GlobalConfig>): void {
  globalConfig.updateConfig(updates);
}

export function getComponentDefault<T extends keyof GlobalConfig['componentDefaults']>(
  key: T
): GlobalConfig['componentDefaults'][T] {
  return globalConfig.getComponentDefault(key);
}

export function isFeatureEnabled(feature: keyof GlobalConfig['features']): boolean {
  return globalConfig.isFeatureEnabled(feature);
}

export function subscribeGlobalConfig(listener: (config: GlobalConfig) => void): () => void {
  return globalConfig.subscribe(listener);
}