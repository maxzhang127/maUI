import { iconImports, fallbackIcons } from './icon-imports';

export interface IconDescriptor {
  name: string;
  set: string;
  src?: string;
}

export interface IconSetConfig {
  baseUrl?: string;
  icons: Record<string, string>;
}

export interface IconRegistry {
  [setName: string]: IconSetConfig;
}

class IconStore {
  private static instance: IconStore;
  private registry: IconRegistry = {};
  private cache = new Map<string, string>();
  private fetchPromises = new Map<string, Promise<string>>();

  private constructor() {
    this.initializeDefaultIcons();
  }

  static getInstance(): IconStore {
    if (!IconStore.instance) {
      IconStore.instance = new IconStore();
    }
    return IconStore.instance;
  }

  private initializeDefaultIcons(): void {
    // 尝试从文件系统加载图标，失败时使用降级方案
    Object.keys(iconImports).forEach(setName => {
      const icons = iconImports[setName];
      const fallbackSet = fallbackIcons[setName] || {};

      this.registry[setName] = {
        icons: {
          ...fallbackSet, // 先设置降级图标
          ...icons, // 然后覆盖为文件系统图标（如果可用）
        },
      };
    });

    // 确保至少有基本的图标集
    if (!this.registry.system) {
      this.registry.system = {
        icons: fallbackIcons.system || {},
      };
    }

    if (!this.registry.outlined) {
      this.registry.outlined = {
        icons: fallbackIcons.outlined || {},
      };
    }

    if (!this.registry.filled) {
      this.registry.filled = {
        icons: fallbackIcons.filled || {},
      };
    }

    console.log(
      '📦 IconStore initialized with icon sets:',
      Object.keys(this.registry)
    );
    console.log(
      '📊 Icon counts:',
      Object.fromEntries(
        Object.entries(this.registry).map(([setName, set]) => [
          setName,
          Object.keys(set.icons).length,
        ])
      )
    );
  }

  getIcon(name: string, set: string = 'system'): string | null {
    const cacheKey = `${set}:${name}`;

    if (this.cache.has(cacheKey)) {
      const cachedIcon = this.cache.get(cacheKey);
      if (cachedIcon) {
        return cachedIcon;
      }
    }

    const iconSet = this.registry[set];
    if (!iconSet || !iconSet.icons[name]) {
      return null;
    }

    const iconSvg = iconSet.icons[name];
    this.cache.set(cacheKey, iconSvg);
    return iconSvg;
  }

  async loadExternalIcon(src: string): Promise<string> {
    const cacheKey = `external:${src}`;

    if (this.cache.has(cacheKey)) {
      const cachedIcon = this.cache.get(cacheKey);
      if (cachedIcon) {
        return cachedIcon;
      }
    }

    if (this.fetchPromises.has(cacheKey)) {
      const fetchPromise = this.fetchPromises.get(cacheKey);
      if (fetchPromise) {
        return fetchPromise;
      }
    }

    const fetchPromise = this.fetchIcon(src);
    this.fetchPromises.set(cacheKey, fetchPromise);

    try {
      const svgContent = await fetchPromise;
      this.cache.set(cacheKey, svgContent);
      this.fetchPromises.delete(cacheKey);
      return svgContent;
    } catch (error) {
      this.fetchPromises.delete(cacheKey);
      throw error;
    }
  }

  private async fetchIcon(src: string): Promise<string> {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to load icon from ${src}: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('svg')) {
      throw new Error(`Icon source is not SVG: ${src}`);
    }

    return response.text();
  }

  registerIconSet(setName: string, config: IconSetConfig): void {
    this.registry[setName] = config;
  }

  hasIcon(name: string, set: string = 'system'): boolean {
    const iconSet = this.registry[set];
    return iconSet ? name in iconSet.icons : false;
  }

  clearCache(): void {
    this.cache.clear();
    this.fetchPromises.clear();
  }

  getAvailableSets(): string[] {
    return Object.keys(this.registry);
  }

  getIconsInSet(set: string): string[] {
    const iconSet = this.registry[set];
    return iconSet ? Object.keys(iconSet.icons) : [];
  }
}

export const iconStore = IconStore.getInstance();
