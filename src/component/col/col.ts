import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import "./col.scss";
import content from "./col.html";

class ColOption implements IOption {
    [key: string]: string | boolean | null;
}

class MaCol extends ComponentBase<ColOption> {
    public constructor() {
        super(new ColOption(), "ma-col");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {

    }
}

customElements.define("ma-col", MaCol);
insertTemplate(content);