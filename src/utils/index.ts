// 工具函数集合

// 生成唯一ID
export function generateId(prefix: string = 'ma'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// 类名合并工具
export function classNames(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// 深度合并对象
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const value = source[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      (result as any)[key] = deepMerge((target as any)[key] || {}, value);
    } else {
      (result as any)[key] = value;
    }
  }
  
  return result;
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 检查是否支持 Web Components
export function supportsWebComponents(): boolean {
  return 'customElements' in window && 
         'attachShadow' in Element.prototype && 
         'getRootNode' in Element.prototype;
}

// 样式注入工具
export function injectStyles(styles: string, id?: string): void {
  if (id && document.getElementById(id)) {
    return; // 已经注入过了
  }
  
  const style = document.createElement('style');
  if (id) style.id = id;
  style.textContent = styles;
  document.head.appendChild(style);
}