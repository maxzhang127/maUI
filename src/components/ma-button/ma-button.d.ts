import { ButtonSize, ButtonVariant } from '@/types';
declare class MaButton extends HTMLElement {
    private _shadowRoot;
    private _button;
    private _loadingSpinner;
    static get observedAttributes(): string[];
    constructor();
    private _initializeComponent;
    attributeChangedCallback(_name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    private _updateButton;
    private _handleClick;
    private _handleFocus;
    private _handleBlur;
    focus(): void;
    blur(): void;
    click(): void;
    get size(): ButtonSize;
    set size(value: ButtonSize);
    get variant(): ButtonVariant;
    set variant(value: ButtonVariant);
    get disabled(): boolean;
    set disabled(value: boolean);
    get loading(): boolean;
    set loading(value: boolean);
}
export default MaButton;
//# sourceMappingURL=ma-button.d.ts.map