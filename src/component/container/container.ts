import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import "./container.scss";
import content from "./container.html";
import { MaRow } from "../row/row";

class ContainerOption implements IOption {
    [key: string]: string | boolean | null;

    public type: "grid" | "flex" | null;

    public constructor() {
        this.type = null;
    }
}

class MaContainer extends ComponentBase<ContainerOption> {
    public constructor() {
        super(new ContainerOption(), "ma-container");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {
        this._initType();
    }

    private _initType() {
        if (this.option.type === "grid") {
            this.style.display = "grid";
            this._initGrid();
        }

        if (this.option.type === "flex") {
            this.style.display = "flex";
        }

        if (this.option.type === null) {
            console.error("Type is required.");
        }
    }

    private _initGrid() {
        let innerHTML = "";
        const rows = this.querySelectorAll<MaRow>("ma-row");
        const gridTemplateRows = Array.from(rows).map((row) => {
            innerHTML += row.innerHTML;
            return row.getAttribute("height") ?? "auto";
        }).join(" ");
        this.style.gridTemplateRows = gridTemplateRows;
        this.style.gridTemplateColumns = "1fr ".repeat(rows[0].colCount).trim();
        this.innerHTML = innerHTML;
    }
}

customElements.define('ma-container', MaContainer);
insertTemplate(content);
