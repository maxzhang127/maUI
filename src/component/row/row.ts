import { ComponentBase, insertTemplate, ComponentOption } from "../componentBase";
import "./row.scss";
import content from "./row.html";

interface RowOption extends ComponentOption {
    gutter: number;
    justify: "start" | "end" | "center" | "space-around" | "space-between";
    align: "top" | "middle" | "bottom";
}

export class MaRow extends ComponentBase<RowOption> {
    private _colCount: number = 0;
    private _cols: string[] = [];

    static get observedAttributes(): string[] {
        return ['gutter', 'justify', 'align'];
    }

    public constructor() {
        const defaultOptions: RowOption = {
            gutter: 0,
            justify: "start",
            align: "top"
        };

        super(defaultOptions, {
            templateId: "ma-row",
            observedAttributes: MaRow.observedAttributes
        });
    }

    protected _initComponent(): void {
        this._init();
        this._updateRowStyles();
    }

    protected _onOptionChange<K extends keyof RowOption>(
        key: K, 
        oldValue: RowOption[K], 
        newValue: RowOption[K]
    ): void {
        this._updateRowStyles();
    }

    private _updateRowStyles(): void {
        const { gutter, justify, align } = this.options;
        
        this.classList.remove(
            'ma-row--start', 'ma-row--end', 'ma-row--center', 'ma-row--space-around', 'ma-row--space-between',
            'ma-row--top', 'ma-row--middle', 'ma-row--bottom'
        );
        
        this.classList.add(`ma-row--${justify}`, `ma-row--${align}`);
        
        if (gutter > 0) {
            this.style.setProperty('--ma-row-gutter', `${gutter}px`);
        }
    }

    private _init() {
        // 计算列数
        this._updateColCount();
    }

    private _updateColCount(): void {
        const cols = this.querySelectorAll("ma-col");
        this._colCount = cols.length;
        this._cols = [];
        cols.forEach((col) => {
            this._cols.push(col.getAttribute("span") ?? "1");
        });
    }

    public get colCount() {
        return this._colCount;
    }

    public get cols() {
        return this._cols;
    }
}

customElements.define("ma-row", MaRow);
insertTemplate(content);