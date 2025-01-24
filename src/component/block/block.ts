import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import "./block.scss";
import content from "./block.html";


class BlockOption implements IOption {
    [key: string]: string | boolean | null;
}


class MaBlock extends ComponentBase<BlockOption> {
    public constructor() {
        super(new BlockOption(), "ma-block");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {
        // ...any initialization logic...
    }
}

customElements.define("ma-block", MaBlock);
insertTemplate(content);

