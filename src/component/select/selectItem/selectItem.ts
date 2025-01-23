import { ComponentBase, insertTemplate, IOption } from "../../componentBase";
import content from "./selectItem.html";

class SelectItemOption implements IOption {
    [key: string]: string | boolean | null;

    public key: string | null;

    public constructor() {
        this.key = "";
    }
}

export class MaSelect extends ComponentBase<SelectItemOption> {

    public constructor() {
        super(new SelectItemOption(), "ma-select-item");
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

customElements.define('ma-select-item', MaSelect);
insertTemplate(content);