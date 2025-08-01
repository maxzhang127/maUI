import { ComponentBase, insertTemplate, ComponentOption } from "../componentBase";
import "./container.scss";
import content from "./container.html";

interface ContainerOption extends ComponentOption {
    type: "grid" | "flex" | null;
}

class MaContainer extends ComponentBase<ContainerOption> {
    static get observedAttributes(): string[] {
        return ['type'];
    }

    public constructor() {
        const defaultOptions: ContainerOption = {
            type: null
        };

        super(defaultOptions, {
            templateId: "ma-container",
            observedAttributes: MaContainer.observedAttributes
        });
    }

    protected _initComponent(): void {
        this._updateContainerType();
    }

    protected _onOptionChange<K extends keyof ContainerOption>(
        key: K, 
        oldValue: ContainerOption[K], 
        newValue: ContainerOption[K]
    ): void {
        if (key === 'type') {
            this._updateContainerType();
        }
    }

    private _updateContainerType(): void {
        const { type } = this.options;
        this.classList.remove('ma-container--grid', 'ma-container--flex');
        if (type) {
            this.classList.add(`ma-container--${type}`);
        }
    }

    public override connectedCallback() {
        super.connectedCallback();
        this._init();
    }

    private _init() {
        // 初始化逻辑
    }
}

customElements.define('ma-container', MaContainer);
insertTemplate(content);
