import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import content from "./button.html";
import "./button.scss";

class ButtonOption implements IOption {
    [key: string]: string | boolean | null;

    public color: "primary" | "secondary" | "success" | "warning" | "danger";
    public disable: boolean | null;
    public size: "small" | "medium" | "large";

    public constructor() {
        this.color = "primary";
        this.disable = false;
        this.size = "medium";
    }
}

class MaButton extends ComponentBase<ButtonOption> {
    public constructor() {
        super(new ButtonOption(), "max-button");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {
        const button = this._shadow.querySelector<HTMLElement>(`[part="button"]`);
        if (button === null) {
            throw new Error("Label element not found.");
        }
        button.addEventListener("click", () => {
            this._dispatchEvent("click", null);
        });
    }
}

customElements.define('ma-button', MaButton);
insertTemplate(content);