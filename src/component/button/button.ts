import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import content from "./button.html";

class ButtonOption implements IOption {
    [key: string]: string | boolean | null;

    public color: "primary" | "secondary" | "success" | "warning" | "danger";

    public constructor() {
        this.color = "primary";
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
        const button = this._shadow.querySelector<HTMLElement>(".max-button");
        if (button === null) {
            throw new Error("Label element not found.");
        }
        button.classList.add(this.option.color);
        button.addEventListener("click", () => {
            this._dispatchEvent("click", null);
        });
    }
}

customElements.define('ma-button', MaButton);
insertTemplate(content);