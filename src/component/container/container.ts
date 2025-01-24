import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import "./container.scss";
import content from "./container.html";

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
        }

        if (this.option.type === "flex") {
            this.style.display = "flex";
        }

        if (this.option.type === null) {
            console.error("Type is required.");
        }
    }
}

customElements.define('ma-container', MaContainer);
insertTemplate(content);
