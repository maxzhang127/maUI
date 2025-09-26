export declare function generateId(prefix?: string): string;
export declare function classNames(...classes: (string | undefined | null)[]): string;
export declare function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T;
export declare function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (this: ThisParameterType<T>, ...args: Parameters<T>) => void;
export declare function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): (this: ThisParameterType<T>, ...args: Parameters<T>) => void;
export declare function supportsWebComponents(): boolean;
export declare function injectStyles(styles: string, id?: string): void;
//# sourceMappingURL=index.d.ts.map