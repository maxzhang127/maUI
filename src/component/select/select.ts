import { ComponentBase, insertTemplate, ComponentOption } from "../componentBase";
import styles from "./select.scss?raw";
import content from "./select.html";

interface SelectOption extends ComponentOption {
    value: string | string[];
    label: string | null;
    placeholder: string | null;
    selectionMode: "single" | "multiple";
    disabled: boolean;
    clearable: boolean;
    searchable: boolean;
    size: "small" | "default" | "large";
}

class MaSelect extends ComponentBase<SelectOption> {
    private _isOpen = false;
    private _selectedItems: HTMLElement[] = [];

    static get observedAttributes(): string[] {
        return ['value', 'label', 'placeholder', 'selection-mode', 'disabled', 'clearable', 'searchable', 'size'];
    }

    public constructor() {
        const defaultOptions: SelectOption = {
            value: "",
            label: null,
            placeholder: "请选择",
            selectionMode: "single",
            disabled: false,
            clearable: false,
            searchable: false,
            size: "default"
        };

        super(defaultOptions, {
            templateId: "ma-select",
            observedAttributes: MaSelect.observedAttributes,
            styles: styles
        });
    }

    protected _initComponent(): void {
        this._initLabel();
        this._initDropdown();
    }

    protected _setupEventListeners(): void {
        const selector = this.querySelector('.select-label');
        if (selector) {
            selector.addEventListener('click', this._toggleDropdown.bind(this));
        }

        // 监听slot变化
        const slot = this.querySelector('slot');
        if (slot) {
            slot.addEventListener('slotchange', this._handleSlotChange.bind(this));
        }

        // 点击外部关闭下拉框
        document.addEventListener('click', this._handleOutsideClick.bind(this));
    }

    protected _cleanupEventListeners(): void {
        document.removeEventListener('click', this._handleOutsideClick.bind(this));
    }

    protected _onOptionChange<K extends keyof SelectOption>(
        key: K, 
        oldValue: SelectOption[K], 
        newValue: SelectOption[K]
    ): void {
        switch (key) {
            case 'label':
            case 'placeholder':
                this._updateLabel();
                break;
            case 'disabled':
                this._updateDisabledState();
                break;
            case 'value':
                this._updateSelection();
                break;
        }
    }

    // 公共方法
    public open(): void {
        if (!this.getOption('disabled')) {
            this._isOpen = true;
            this._updateDropdownState();
        }
    }

    public close(): void {
        this._isOpen = false;
        this._updateDropdownState();
    }

    public toggle(): void {
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public getValue(): string | string[] {
        return this.getOption('value');
    }

    public setValue(value: string | string[]): void {
        this.setOption('value', value);
    }

    private _initLabel(): void {
        this._updateLabel();
    }

    private _initDropdown(): void {
        this._updateDropdownState();
        this._handleSlotChange();
    }

    private _updateLabel(): void {
        const labelDom = this.querySelector<HTMLDivElement>(".select-label");
        if (!labelDom) return;

        const { label, placeholder, value } = this.options;
        
        if (Array.isArray(value) && value.length > 0) {
            labelDom.textContent = value.join(', ');
        } else if (typeof value === 'string' && value) {
            labelDom.textContent = value;
        } else if (label) {
            labelDom.textContent = label;
        } else {
            labelDom.textContent = placeholder || '请选择';
        }
    }

    private _updateDisabledState(): void {
        const disabled = this.getOption('disabled');
        this.classList.toggle('ma-select--disabled', disabled);
    }

    private _updateSelection(): void {
        const value = this.getOption('value');
        
        // 更新选中状态
        const items = this.querySelectorAll('ma-select-item');
        items.forEach(item => {
            const itemValue = item.getAttribute('value') || '';
            const isSelected = Array.isArray(value) 
                ? value.includes(itemValue)
                : value === itemValue;
            
            item.classList.toggle('selected', isSelected);
        });

        this._updateLabel();
        this._dispatchEvent('ma-change', { value });
    }

    private _updateDropdownState(): void {
        this.classList.toggle('ma-select--open', this._isOpen);
        
        if (this._isOpen) {
            this._dispatchEvent('ma-open');
        } else {
            this._dispatchEvent('ma-close');
        }
    }

    private _toggleDropdown(): void {
        if (this.getOption('disabled')) return;
        this.toggle();
    }

    private _handleSlotChange(): void {
        const slot = this.querySelector<HTMLSlotElement>('slot');
        if (!slot) return;

        const assignedElements = slot.assignedElements({ flatten: true });
        const selectItems = assignedElements.filter(el => el.tagName.toLowerCase() === 'ma-select-item');

        // 为每个选项添加点击事件
        selectItems.forEach(item => {
            item.addEventListener('click', () => this._handleItemClick(item as HTMLElement));
        });

        this._updateSelection();
    }

    private _handleItemClick(item: HTMLElement): void {
        const itemValue = item.getAttribute('value') || '';
        const { selectionMode, value } = this.options;

        if (selectionMode === 'multiple') {
            const currentValue = Array.isArray(value) ? [...value] : [];
            const index = currentValue.indexOf(itemValue);
            
            if (index > -1) {
                currentValue.splice(index, 1);
            } else {
                currentValue.push(itemValue);
            }
            
            this.setValue(currentValue);
        } else {
            this.setValue(itemValue);
            this.close();
        }
    }

    private _handleOutsideClick(event: Event): void {
        if (!this.contains(event.target as Node)) {
            this.close();
        }
    }
}

customElements.define('ma-select', MaSelect);
insertTemplate(content);

