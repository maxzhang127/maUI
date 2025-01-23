import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import "./select.scss";
import content from "./select.html";

class SelectOption implements IOption {
    [key: string]: string | boolean | null;

    public value: string | null;
    public label: string | null;
    public selectionMode: "single" | "multiple";
    public disabled: boolean;

    public constructor() {
        this.value = "";
        this.label = "选择";
        this.selectionMode = "single";
        this.disabled = false;
    }
}

export class MaSelect extends ComponentBase<SelectOption> {

    public constructor() {
        super(new SelectOption(), "ma-select");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {
        const select = this._shadow.querySelector<HTMLSelectElement>(`[part="select"]`);
        if (select === null) {
            throw new Error("Select element not found.");
        }
        select.addEventListener("change", () => {
            this._dispatchEvent("change", select.value);
        });
    }
}

customElements.define('ma-select', MaSelect);
insertTemplate(content);

