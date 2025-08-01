import { ComponentBase, insertTemplate, ComponentOption } from "../componentBase";
import styles from "./col.scss?raw";
import content from "./col.html";

interface ColOption extends ComponentOption {
    span: number;
    offset: number;
    xs: number | null;
    sm: number | null;
    md: number | null;
    lg: number | null;
    xl: number | null;
}

class MaCol extends ComponentBase<ColOption> {
    static get observedAttributes(): string[] {
        return ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl'];
    }

    public constructor() {
        const defaultOptions: ColOption = {
            span: 24,
            offset: 0,
            xs: null,
            sm: null,
            md: null,
            lg: null,
            xl: null
        };

        super(defaultOptions, {
            templateId: "ma-col",
            observedAttributes: MaCol.observedAttributes,
            styles: styles
        });
    }

    protected _initComponent(): void {
        this._init();
        this._updateColStyles();
    }

    protected _onOptionChange<K extends keyof ColOption>(
        key: K, 
        oldValue: ColOption[K], 
        newValue: ColOption[K]
    ): void {
        this._updateColStyles();
    }

    private _updateColStyles(): void {
        const { span, offset, xs, sm, md, lg, xl } = this.options;
        
        // 清除旧的类名
        this.className = this.className.replace(/ma-col-\S+/g, '');
        
        // 添加基础span类
        this.classList.add(`ma-col-${span}`);
        
        // 添加offset类
        if (offset > 0) {
            this.classList.add(`ma-col-offset-${offset}`);
        }
        
        // 添加响应式类
        const breakpoints = { xs, sm, md, lg, xl };
        Object.entries(breakpoints).forEach(([bp, value]) => {
            if (value !== null && value > 0) {
                this.classList.add(`ma-col-${bp}-${value}`);
            }
        });
    }

    private _init() {
        // 初始化逻辑
    }
}

customElements.define("ma-col", MaCol);
insertTemplate(content);