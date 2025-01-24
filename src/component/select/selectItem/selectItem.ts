import { ComponentBase, insertTemplate, IOption } from "../../componentBase";
import content from "./selectItem.html";

class SelectItemOption implements IOption {
    [key: string]: string | boolean | null;

    public key: string | null;

    public constructor() {
        this.key = null;
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
        if (this.option.key === null) {
            console.error("Key is required.");
        }
    }
}

customElements.define('ma-select-item', MaSelect);
insertTemplate(content);