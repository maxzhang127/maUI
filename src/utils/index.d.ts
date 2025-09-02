export declare function generateId(prefix?: string): string;
export declare function classNames(...classes: (string | undefined | null)[]): string;
export declare function deepMerge<T>(target: T, source: Partial<T>): T;
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
export declare function supportsWebComponents(): boolean;
export declare function injectStyles(styles: string, id?: string): void;
//# sourceMappingURL=index.d.ts.map