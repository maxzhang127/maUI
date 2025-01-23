import { ComponentBase, insertTemplate, IOption } from "../componentBase";
import template from "./input.html";
import "./input.scss";
class InputOption implements IOption {
    [key: string]: string | boolean | null;

    public value: string | null;
    public label: string | null;
    public color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    public size: "small" | "default" | "large";
    public defaultValue: string | null;
    public placeholder: string | null;
    public readonly: boolean;
    public disabled: boolean;
    public required: boolean;

    public constructor() {
        this.value = "";
        this.label = "输入框";
        this.color = "default";
        this.size = "default";
        this.defaultValue = "默认值";
        this.placeholder = "";
        this.readonly = false;
        this.disabled = false;
        this.required = false;
    }
}

export class Input extends ComponentBase<InputOption> {
    public constructor() {
        super(new InputOption(), "ma-input");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._attachEvent();
        this._initLabel();
        this._initInput();
    }

    private _initLabel() {
        if (this.option.label === null) {
            return;
        }
        const label = this._shadow.querySelector<HTMLLabelElement>("[part=label]");
        if (label === null) {
            throw new Error("Label element not found.");
        }
        label.innerText = this.option.label;
        label.style.color = this.option.color;
        label.style.fontSize = this.option.size;
        if (this.option.required) {
            label.classList.add("required");
        }

        if (this.option.placeholder) {
            label.part.add("little-label");
        }
        else {
            label.part.add("big-label");
        }
    }

    private _initInput() {
        const input = this._shadow.querySelector<HTMLInputElement>("[part=input]");
        if (input === null) {
            throw new Error("Input element not found.");
        }
        if (this.option.value) {
            input.value = this.option.value;
            input.classList.add("has-value");
        }
        if (this.option.placeholder) {
            input.placeholder = this.option.placeholder;
        }
        input.readOnly = this.option.readonly;
        input.disabled = this.option.disabled;
    }

    private _attachEvent() {
        const input = this._shadow.querySelector<HTMLInputElement>("[part=input]");
        const label = this._shadow.querySelector<HTMLLabelElement>("[part=label]");
        if (label === null) {
            throw new Error("Label element not found.");
        }
        if (input === null) {
            throw new Error("Input element not found.");
        }

        input.addEventListener("input", (event) => {
            event.stopPropagation();
            this._updateHasValue(input, label);
            this._dispatchEvent("input", input.value);
        });

        input.addEventListener("change", () => {
            this._updateHasValue(input, label);
            this._dispatchEvent("change", input.value);
        });

        input.addEventListener("focus", () => {
            label.part.add("little-label");
            label.part.remove("big-label");
        });

        input.addEventListener("blur", () => {
            if (input.value === "" && !this.option.placeholder) {
                label.part.remove("little-label");
                label.part.add("big-label");
            }
        });
    }

    private _updateHasValue(input: HTMLInputElement, label: HTMLLabelElement) {
        this.option.value = input.value;
        if (this.option.value === "" && !this.option.placeholder) {
            label.part.remove("little-label");
            label.part.add("big-label");
        } else {
            label.part.add("little-label");
            label.part.remove("big-label");
        }
    }
}

customElements.define("ma-input", Input);
insertTemplate(template);
