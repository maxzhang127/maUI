import { ComponentBase, insertTemplate, ComponentOption, createClassManager } from "../componentBase";
import content from "./button.html";
import "./button.scss";

interface ButtonOption extends ComponentOption {
    color: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
    variant: "filled" | "outlined" | "text" | "ghost";
    size: "xs" | "sm" | "md" | "lg" | "xl";
    disabled: boolean;
    loading: boolean;
    block: boolean;
    icon: string | null;
    iconPosition: "left" | "right";
    htmlType: "button" | "submit" | "reset";
}

class MaButton extends ComponentBase<ButtonOption> {
    private _classManager: ReturnType<typeof createClassManager> | null = null;
    private _buttonElement: HTMLButtonElement | null = null;

    // 观察的属性
    static get observedAttributes(): string[] {
        return ['color', 'variant', 'size', 'disabled', 'loading', 'block', 'icon', 'icon-position', 'html-type'];
    }

    public constructor() {
        const defaultOptions: ButtonOption = {
            color: "primary",
            variant: "filled",
            size: "md",
            disabled: false,
            loading: false,
            block: false,
            icon: null,
            iconPosition: "left",
            htmlType: "button"
        };

        super(defaultOptions, {
            templateId: "ma-button",
            observedAttributes: MaButton.observedAttributes
        });
    }

    protected _initComponent(): void {
        this._buttonElement = this.querySelector('button[part="button"]');
        if (!this._buttonElement) {
            throw new Error("Button element not found in template");
        }

        this._classManager = createClassManager(this._buttonElement);
        this._setupButton();
        this._updateButtonClasses();
        this._updateButtonContent();
    }

    protected _setupEventListeners(): void {
        if (this._buttonElement) {
            this._buttonElement.addEventListener('click', this._handleClick.bind(this));
        }
    }

    protected _cleanupEventListeners(): void {
        if (this._buttonElement) {
            this._buttonElement.removeEventListener('click', this._handleClick.bind(this));
        }
    }

    protected _onOptionChange<K extends keyof ButtonOption>(
        key: K, 
        oldValue: ButtonOption[K], 
        newValue: ButtonOption[K]
    ): void {
        switch (key) {
            case 'disabled':
            case 'loading':
                this._updateButtonState();
                break;
            case 'color':
            case 'variant':
            case 'size':
            case 'block':
                this._updateButtonClasses();
                break;
            case 'icon':
            case 'iconPosition':
                this._updateButtonContent();
                break;
            case 'htmlType':
                this._updateButtonType();
                break;
        }
    }

    // 公共方法
    public focus(): void {
        this._buttonElement?.focus();
    }

    public blur(): void {
        this._buttonElement?.blur();
    }

    public click(): void {
        if (!this.getOption('disabled') && !this.getOption('loading')) {
            this._buttonElement?.click();
        }
    }

    // 私有方法
    private _setupButton(): void {
        if (!this._buttonElement) return;

        // 设置初始属性
        this._updateButtonType();
        this._updateButtonState();
    }

    private _updateButtonClasses(): void {
        if (!this._classManager) return;

        const { color, variant, size, block } = this.options;

        this._classManager
            .removeIf(true, 
                // 移除所有可能的类名
                'ma-button--primary', 'ma-button--secondary', 'ma-button--success', 
                'ma-button--warning', 'ma-button--danger', 'ma-button--info',
                'ma-button--filled', 'ma-button--outlined', 'ma-button--text', 'ma-button--ghost',
                'ma-button--xs', 'ma-button--sm', 'ma-button--md', 'ma-button--lg', 'ma-button--xl',
                'ma-button--block'
            )
            .setBatch({
                [`ma-button--${color}`]: true,
                [`ma-button--${variant}`]: true,
                [`ma-button--${size}`]: true,
                'ma-button--block': block
            });
    }

    private _updateButtonState(): void {
        if (!this._buttonElement) return;

        const { disabled, loading } = this.options;
        const isDisabled = disabled || loading;

        this._buttonElement.disabled = isDisabled;
        this._buttonElement.setAttribute('aria-disabled', isDisabled.toString());

        this._classManager?.setBatch({
            'ma-button--disabled': disabled,
            'ma-button--loading': loading
        });
    }

    private _updateButtonContent(): void {
        if (!this._buttonElement) return;

        const { icon, iconPosition, loading } = this.options;
        const iconSlot = this._buttonElement.querySelector('.ma-button__icon');
        const textSlot = this._buttonElement.querySelector('.ma-button__text');

        // 处理加载状态
        if (loading) {
            if (iconSlot) {
                iconSlot.innerHTML = '<ma-icon name="loading" spin></ma-icon>';
            }
            return;
        }

        // 处理图标
        if (icon && iconSlot) {
            iconSlot.innerHTML = `<ma-icon name="${icon}"></ma-icon>`;
            (iconSlot as HTMLElement).style.display = '';
            
            // 调整图标位置
            if (iconPosition === 'right' && textSlot && iconSlot) {
                this._buttonElement.insertBefore(textSlot, iconSlot);
            }
        } else if (iconSlot) {
            iconSlot.innerHTML = '';
            (iconSlot as HTMLElement).style.display = 'none';
        }
    }

    private _updateButtonType(): void {
        if (this._buttonElement) {
            this._buttonElement.type = this.getOption('htmlType');
        }
    }

    private _handleClick(event: Event): void {
        const { disabled, loading } = this.options;
        
        if (disabled || loading) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        // 派发自定义点击事件
        const customEvent = this.dispatchEvent('ma-click', {
            originalEvent: event,
            button: this
        });

        // 如果自定义事件被阻止，也阻止默认行为
        if (!customEvent) {
            event.preventDefault();
        }
    }
}

// 注册组件
customElements.define('ma-button', MaButton);

// 插入模板
insertTemplate(content);