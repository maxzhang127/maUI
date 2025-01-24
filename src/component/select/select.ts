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

class MaSelect extends ComponentBase<SelectOption> {

    public constructor() {
        super(new SelectOption(), "ma-select");
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._initLabel();
        this._init();
    }

    private _init() {
        const slot = this._shadow.querySelector<HTMLSlotElement>('slot');
        if (slot === null) {
            throw new Error("Slot element not found.");
        }

        const assignedElements = slot.assignedElements({ flatten: true });
        const selectItems = assignedElements.filter(el => el.tagName.toLowerCase() === 'ma-select-item');

        if (selectItems.length === 0) {
            throw new Error("No select-item elements found in slot.");
        }

        selectItems.forEach(item => {
            console.log(item);
        });
    }

    private _initLabel() {
        const labelDom = this._shadow.querySelector<HTMLDivElement>("[part=select-label]");
        if (labelDom === null) {
            throw new Error("Label element not found.");
        }
        labelDom.innerText = this.option.label ?? "";
    }
}

customElements.define('ma-select', MaSelect);
insertTemplate(content);

