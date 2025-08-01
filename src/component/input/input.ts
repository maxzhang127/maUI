import { ComponentBase, insertTemplate, ComponentOption } from "../componentBase";
import template from "./input.html";
import styles from "./input.scss?raw";

interface InputOption extends ComponentOption {
    value: string;
    label: string | null;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    size: "small" | "default" | "large";
    defaultValue: string | null;
    placeholder: string | null;
    readonly: boolean;
    disabled: boolean;
    required: boolean;
    type: "text" | "password" | "email" | "number" | "tel" | "url";
}

class MaInput extends ComponentBase<InputOption> {
    private _inputElement: HTMLInputElement | null = null;
    private _labelElement: HTMLLabelElement | null = null;

    static get observedAttributes(): string[] {
        return ['value', 'label', 'color', 'size', 'placeholder', 'readonly', 'disabled', 'required', 'type'];
    }

    public constructor() {
        const defaultOptions: InputOption = {
            value: "",
            label: "输入框",
            color: "default",
            size: "default",
            defaultValue: null,
            placeholder: null,
            readonly: false,
            disabled: false,
            required: false,
            type: "text"
        };

        super(defaultOptions, {
            templateId: "ma-input",
            observedAttributes: MaInput.observedAttributes,
            styles: styles
        });
    }

    protected _initComponent(): void {
        this._inputElement = this.querySelector<HTMLInputElement>("input");
        this._labelElement = this.querySelector<HTMLLabelElement>("label");
        
        if (!this._inputElement) {
            throw new Error("Input element not found in template");
        }
        if (!this._labelElement) {
            throw new Error("Label element not found in template");
        }

        this._initLabel();
        this._initInput();
    }

    protected _setupEventListeners(): void {
        if (!this._inputElement || !this._labelElement) return;

        this._inputElement.addEventListener("input", this._handleInput.bind(this));
        this._inputElement.addEventListener("change", this._handleChange.bind(this));
        this._inputElement.addEventListener("focus", this._handleFocus.bind(this));
        this._inputElement.addEventListener("blur", this._handleBlur.bind(this));
    }

    protected _onOptionChange<K extends keyof InputOption>(
        key: K, 
        oldValue: InputOption[K], 
        newValue: InputOption[K]
    ): void {
        switch (key) {
            case 'value':
                this._updateInputValue();
                break;
            case 'label':
                this._updateLabel();
                break;
            case 'placeholder':
                this._updatePlaceholder();
                break;
            case 'disabled':
            case 'readonly':
                this._updateInputState();
                break;
            case 'required':
                this._updateRequired();
                break;
            case 'type':
                this._updateInputType();
                break;
        }
    }

    // 公共方法
    public focus(): void {
        this._inputElement?.focus();
    }

    public blur(): void {
        this._inputElement?.blur();
    }

    public getValue(): string {
        return this._inputElement?.value || '';
    }

    public setValue(value: string): void {
        this.setOption('value', value);
    }

    private _initLabel(): void {
        if (!this._labelElement) return;
        
        const { label, required } = this.options;
        
        if (label) {
            this._labelElement.textContent = label;
        }
        
        if (required) {
            this._labelElement.classList.add("required");
        }
        
        this._updateLabelPosition();
    }

    private _initInput(): void {
        if (!this._inputElement) return;
        
        const { value, placeholder, readonly, disabled, type } = this.options;
        
        this._inputElement.value = value;
        this._inputElement.type = type;
        this._inputElement.readOnly = readonly;
        this._inputElement.disabled = disabled;
        
        if (placeholder) {
            this._inputElement.placeholder = placeholder;
        }
        
        this._updateInputState();
        this._updateLabelPosition();
    }

    private _updateInputValue(): void {
        if (this._inputElement) {
            this._inputElement.value = this.getOption('value');
            this._updateLabelPosition();
        }
    }

    private _updateLabel(): void {
        if (this._labelElement) {
            const label = this.getOption('label');
            this._labelElement.textContent = label || '';
        }
    }

    private _updatePlaceholder(): void {
        if (this._inputElement) {
            const placeholder = this.getOption('placeholder');
            if (placeholder) {
                this._inputElement.placeholder = placeholder;
            } else {
                this._inputElement.removeAttribute('placeholder');
            }
            this._updateLabelPosition();
        }
    }

    private _updateInputState(): void {
        if (this._inputElement) {
            this._inputElement.readOnly = this.getOption('readonly');
            this._inputElement.disabled = this.getOption('disabled');
        }
    }

    private _updateRequired(): void {
        if (this._labelElement) {
            const required = this.getOption('required');
            this._labelElement.classList.toggle('required', required);
        }
    }

    private _updateInputType(): void {
        if (this._inputElement) {
            this._inputElement.type = this.getOption('type');
        }
    }

    private _updateLabelPosition(): void {
        if (!this._labelElement) return;
        
        const hasValue = this._inputElement?.value !== '';
        const hasPlaceholder = this.getOption('placeholder') !== null;
        
        if (hasValue || hasPlaceholder) {
            this._labelElement.classList.add("little-label");
            this._labelElement.classList.remove("big-label");
        } else {
            this._labelElement.classList.remove("little-label");
            this._labelElement.classList.add("big-label");
        }
    }

    private _handleInput(event: Event): void {
        event.stopPropagation();
        const value = (event.target as HTMLInputElement).value;
        this.setOption('value', value);
        this._updateLabelPosition();
        this._dispatchEvent("ma-input", { value, originalEvent: event });
    }

    private _handleChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.setOption('value', value);
        this._updateLabelPosition();
        this._dispatchEvent("ma-change", { value, originalEvent: event });
    }

    private _handleFocus(): void {
        this._labelElement?.classList.add("little-label");
        this._labelElement?.classList.remove("big-label");
        this._dispatchEvent("ma-focus", { value: this.getOption('value') });
    }

    private _handleBlur(): void {
        this._updateLabelPosition();
        this._dispatchEvent("ma-blur", { value: this.getOption('value') });
    }
}

customElements.define("ma-input", MaInput);
insertTemplate(template);
