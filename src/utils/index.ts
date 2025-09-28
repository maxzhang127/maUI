// 工具函数集合

// 生成唯一ID
export function generateId(prefix: string = 'ma'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// 类名合并工具
export function classNames(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 深度合并对象
export function deepMerge<T extends PlainObject>(target: T, source: Partial<T>): T {
  const result: PlainObject = { ...target };

  (Object.keys(source) as (keyof T)[]).forEach((key) => {
    const sourceValue = source[key];

    if (isPlainObject(sourceValue)) {
      const targetValue = target[key];
      const base: PlainObject = isPlainObject(targetValue) ? targetValue : {};
      result[key as string] = deepMerge(base, sourceValue as Partial<PlainObject>);
    } else if (sourceValue !== undefined) {
      result[key as string] = sourceValue;
    }
  });

  return result as T;
}

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
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