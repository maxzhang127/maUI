import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import "./row.scss";
import content from "./row.html";

class RowOption implements IOption {
    [key: string]: string | boolean | null;
}

export class MaRow extends ComponentBase<RowOption> {
    private _colCount: number = 0;
    private _cols: string[] = [];
    public constructor() {
        super(new RowOption(), "ma-row");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {
        const cols = this.querySelectorAll("ma-col");
        const colCount = cols.length;
        this._cols = [];
        cols.forEach((col) => {
            this._cols.push(col.getAttribute("width") ?? "auto");
        });
        this._colCount = colCount;
    }

    public get colCount() {
        return this.querySelectorAll("ma-col")?.length ?? 0;
    }

    public get cols() {
        return this._cols;
    }
}

customElements.define("ma-row", MaRow);
insertTemplate(content);