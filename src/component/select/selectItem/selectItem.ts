import { ComponentBase, insertTemplate, ComponentOption } from "../../componentBase";
import content from "./selectItem.html";

interface SelectItemOption extends ComponentOption {
    value: string;
    label: string | null;
    disabled: boolean;
    selected: boolean;
}

export class MaSelectItem extends ComponentBase<SelectItemOption> {
    static get observedAttributes(): string[] {
        return ['value', 'label', 'disabled', 'selected'];
    }

    public constructor() {
        const defaultOptions: SelectItemOption = {
            value: "",
            label: null,
            disabled: false,
            selected: false
        };

        super(defaultOptions, {
            templateId: "ma-select-item",
            observedAttributes: MaSelectItem.observedAttributes
        });
    }

    protected _initComponent(): void {
        this._updateContent();
        this._updateStates();
    }

    protected _onOptionChange<K extends keyof SelectItemOption>(
        key: K, 
        oldValue: SelectItemOption[K], 
        newValue: SelectItemOption[K]
    ): void {
        switch (key) {
            case 'label':
                this._updateContent();
                break;
            case 'disabled':
            case 'selected':
                this._updateStates();
                break;
        }
    }

    // 公共方法
    public getValue(): string {
        return this.getOption('value');
    }

    public setValue(value: string): void {
        this.setOption('value', value);
    }

    public select(): void {
        this.setOption('selected', true);
    }

    public deselect(): void {
        this.setOption('selected', false);
    }

    private _updateContent(): void {
        const { label } = this.options;
        const contentElement = this.querySelector('[part="content"]');
        
        if (contentElement) {
            if (label) {
                contentElement.textContent = label;
            } else {
                // 如果没有label，使用slot内容
                const slot = contentElement.querySelector('slot');
                if (!slot) {
                    const slotElement = document.createElement('slot');
                    contentElement.appendChild(slotElement);
                }
            }
        }
    }

    private _updateStates(): void {
        const { disabled, selected } = this.options;
        
        this.classList.toggle('ma-select-item--disabled', disabled);
        this.classList.toggle('ma-select-item--selected', selected);
        
        this.setAttribute('aria-disabled', disabled.toString());
        this.setAttribute('aria-selected', selected.toString());
    }
}

customElements.define('ma-select-item', MaSelectItem);
insertTemplate(content);