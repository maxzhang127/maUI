import { ComponentBase, insertTemplate, ComponentOption } from "../componentBase";
import "./block.scss";
import content from "./block.html";

interface BlockOption extends ComponentOption {
    padding: string | null;
    margin: string | null;
    background: string | null;
    borderRadius: string | null;
}

class MaBlock extends ComponentBase<BlockOption> {
    static get observedAttributes(): string[] {
        return ['padding', 'margin', 'background', 'border-radius'];
    }

    public constructor() {
        const defaultOptions: BlockOption = {
            padding: null,
            margin: null,
            background: null,
            borderRadius: null
        };

        super(defaultOptions, {
            templateId: "ma-block",
            observedAttributes: MaBlock.observedAttributes
        });
    }

    protected _initComponent(): void {
        this._init();
        this._updateBlockStyles();
    }

    protected _onOptionChange<K extends keyof BlockOption>(
        key: K, 
        oldValue: BlockOption[K], 
        newValue: BlockOption[K]
    ): void {
        this._updateBlockStyles();
    }

    private _updateBlockStyles(): void {
        const { padding, margin, background, borderRadius } = this.options;
        
        if (padding) {
            this.style.padding = padding;
        }
        
        if (margin) {
            this.style.margin = margin;
        }
        
        if (background) {
            this.style.backgroundColor = background;
        }
        
        if (borderRadius) {
            this.style.borderRadius = borderRadius;
        }
    }

    private _init() {
        // ...any initialization logic...
    }
}

customElements.define("ma-block", MaBlock);
insertTemplate(content);

