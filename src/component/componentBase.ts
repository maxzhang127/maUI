export interface ComponentOption {
    [key: string]: string | boolean | number | string[] | null;
}

export interface ComponentConfig {
    templateId: string;
    shadowMode?: "open" | "closed";
    observedAttributes?: string[];
    delegatesFocus?: boolean;
}

export abstract class ComponentBase<T extends ComponentOption> extends HTMLElement {
    private _options: T;
    private _config: ComponentConfig;
    protected _shadow: ShadowRoot;
    private _isConnected = false;
    private _templateCache = new Map<string, HTMLTemplateElement>();

    public constructor(defaultOptions: T, config: ComponentConfig) {
        super();
        
        this._options = { ...defaultOptions };
        this._config = config;
        
        this._shadow = this.attachShadow({ 
            mode: config.shadowMode || "open",
            delegatesFocus: config.delegatesFocus || false
        });
        
        this._initTemplate();
    }

    // 静态方法：获取观察的属性
    static get observedAttributes(): string[] {
        return [];
    }

    // 获取组件选项
    protected get options(): T {
        return this._options;
    }

    // 获取Shadow Root
    protected get shadow(): ShadowRoot {
        return this._shadow;
    }

    // 组件挂载时调用
    public connectedCallback(): void {
        if (!this._isConnected) {
            this._isConnected = true;
            this._syncAttributesToOptions();
            this._initComponent();
            this._setupEventListeners();
        }
    }

    // 组件卸载时调用
    public disconnectedCallback(): void {
        this._isConnected = false;
        this._cleanupEventListeners();
        this._destroyComponent();
    }

    // 属性变化时调用
    public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (this._isConnected && oldValue !== newValue) {
            this._handleAttributeChange(name, oldValue, newValue);
        }
    }

    // 表单关联回调（如果组件支持表单）
    public formAssociatedCallback?(form: HTMLFormElement): void;
    public formDisabledCallback?(disabled: boolean): void;
    public formResetCallback?(): void;
    public formStateRestoreCallback?(state: string, reason: "restore" | "autocomplete"): void;

    // 更新组件选项
    protected updateOptions(newOptions: Partial<T>): void {
        const oldOptions = { ...this._options };
        this._options = { ...this._options, ...newOptions };
        this._onOptionsChange(oldOptions, this._options);
    }

    // 获取单个选项值
    protected getOption<K extends keyof T>(key: K): T[K] {
        return this._options[key];
    }

    // 设置单个选项值
    protected setOption<K extends keyof T>(key: K, value: T[K]): void {
        const oldValue = this._options[key];
        if (oldValue !== value) {
            this._options[key] = value;
            this._onOptionChange(key, oldValue, value);
        }
    }

    // 派发自定义事件 (公开方法以兼容HTMLElement)
    public dispatchEvent(event: Event): boolean;
    public dispatchEvent(eventName: string, detail?: any, options?: CustomEventInit): boolean;
    public dispatchEvent(eventOrName: Event | string, detail?: any, options?: CustomEventInit): boolean {
        if (eventOrName instanceof Event) {
            return super.dispatchEvent(eventOrName);
        }
        
        const event = new CustomEvent(eventOrName, {
            detail,
            bubbles: options?.bubbles ?? true,
            cancelable: options?.cancelable ?? true,
            composed: options?.composed ?? true,
            ...options
        });
        return super.dispatchEvent(event);
    }

    // 便捷的派发自定义事件方法
    protected _dispatchEvent(eventName: string, detail?: any, options?: CustomEventInit): boolean {
        return this.dispatchEvent(eventName, detail, options);
    }

    // 查找Shadow DOM中的元素 (公开方法以兼容HTMLElement)
    public querySelector<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
    public querySelector<E extends Element = Element>(selector: string): E | null;
    public querySelector(selector: string): Element | null {
        return this._shadow.querySelector(selector);
    }

    public querySelectorAll<K extends keyof HTMLElementTagNameMap>(selector: K): NodeListOf<HTMLElementTagNameMap[K]>;
    public querySelectorAll<E extends Element = Element>(selector: string): NodeListOf<E>;
    public querySelectorAll(selector: string): NodeListOf<Element> {
        return this._shadow.querySelectorAll(selector);
    }

    // 抽象方法：子类必须实现
    protected abstract _initComponent(): void;

    // 可选的生命周期方法
    protected _setupEventListeners(): void {}
    protected _cleanupEventListeners(): void {}
    protected _destroyComponent(): void {}
    protected _onOptionsChange(oldOptions: T, newOptions: T): void {}
    protected _onOptionChange<K extends keyof T>(key: K, oldValue: any, newValue: any): void {}

    // 私有方法：初始化模板
    private _initTemplate(): void {
        const template = this._getTemplate();
        if (template) {
            this._shadow.appendChild(template.content.cloneNode(true));
        } else {
            console.warn(`Template "${this._config.templateId}" not found for component`);
        }
    }

    // 私有方法：获取模板（带缓存）
    private _getTemplate(): HTMLTemplateElement | null {
        const templateId = this._config.templateId;
        
        if (this._templateCache.has(templateId)) {
            return this._templateCache.get(templateId)!;
        }

        const template = document.getElementById(templateId) as HTMLTemplateElement;
        if (template) {
            this._templateCache.set(templateId, template);
        }
        
        return template;
    }

    // 私有方法：同步属性到选项
    private _syncAttributesToOptions(): void {
        for (const key in this._options) {
            const attrValue = this.getAttribute(key.toLowerCase());
            if (attrValue !== null) {
                this._parseAttributeValue(key, attrValue);
            }
        }
    }

    // 私有方法：解析属性值
    private _parseAttributeValue(key: string, value: string): any {
        const currentValue = this._options[key];
        
        if (typeof currentValue === "boolean") {
            return value !== "false";
        } else if (typeof currentValue === "number") {
            const numValue = parseFloat(value);
            return !isNaN(numValue) ? numValue : currentValue;
        } else {
            return value;
        }
    }

    // 私有方法：处理属性变化
    private _handleAttributeChange(name: string, oldValue: string | null, newValue: string | null): void {
        const key = name.toLowerCase();
        if (key in this._options) {
            if (newValue !== null) {
                const parsedValue = this._parseAttributeValue(key, newValue);
                const oldOptionValue = this._options[key];
                (this._options as any)[key] = parsedValue;
                this._onOptionChange(key as keyof T, oldOptionValue, parsedValue);
            }
        }
    }
}

// 模板管理器
export class TemplateManager {
    private static _instance: TemplateManager;
    private _container: HTMLElement | null = null;
    private _templates = new Set<string>();

    static getInstance(): TemplateManager {
        if (!TemplateManager._instance) {
            TemplateManager._instance = new TemplateManager();
        }
        return TemplateManager._instance;
    }

    // 插入模板到DOM
    insertTemplate(template: string, templateId?: string): void {
        if (templateId && this._templates.has(templateId)) {
            return; // 避免重复插入
        }

        const container = this._getContainer();
        container.innerHTML += template;

        if (templateId) {
            this._templates.add(templateId);
        }
    }

    // 批量插入模板
    insertTemplates(templates: Array<{ template: string; id?: string }>): void {
        const container = this._getContainer();
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');

        templates.forEach(({ template, id }) => {
            if (id && this._templates.has(id)) {
                return;
            }

            tempDiv.innerHTML = template;
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }

            if (id) {
                this._templates.add(id);
            }
        });

        container.appendChild(fragment);
    }

    // 检查模板是否存在
    hasTemplate(templateId: string): boolean {
        return document.getElementById(templateId) !== null;
    }

    private _getContainer(): HTMLElement {
        if (!this._container) {
            this._container = document.querySelector("#maui-template");
            if (!this._container) {
                this._container = document.createElement("div");
                this._container.id = "maui-template";
                this._container.style.display = "none";
                document.head.appendChild(this._container);
            }
        }
        return this._container;
    }
}

// 向后兼容的函数
export function insertTemplate(template: string): void {
    TemplateManager.getInstance().insertTemplate(template);
}

// 工具类：CSS类名管理
export class CSSClassManager {
    private _element: Element;

    constructor(element: Element) {
        this._element = element;
    }

    // 添加类名
    add(...classNames: string[]): this {
        this._element.classList.add(...classNames);
        return this;
    }

    // 移除类名
    remove(...classNames: string[]): this {
        this._element.classList.remove(...classNames);
        return this;
    }

    // 切换类名
    toggle(className: string, force?: boolean): this {
        this._element.classList.toggle(className, force);
        return this;
    }

    // 条件性添加类名
    addIf(condition: boolean, ...classNames: string[]): this {
        if (condition) {
            this.add(...classNames);
        }
        return this;
    }

    // 条件性移除类名
    removeIf(condition: boolean, ...classNames: string[]): this {
        if (condition) {
            this.remove(...classNames);
        }
        return this;
    }

    // 批量设置类名状态
    setBatch(classMap: Record<string, boolean>): this {
        Object.entries(classMap).forEach(([className, shouldAdd]) => {
            this.toggle(className, shouldAdd);
        });
        return this;
    }
}

// 工具函数：创建CSS类管理器
export function createClassManager(element: Element): CSSClassManager {
    return new CSSClassManager(element);
}

// 工具函数：防抖
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), wait);
    };
}

// 工具函数：节流
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}