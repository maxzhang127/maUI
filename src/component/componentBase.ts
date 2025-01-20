export interface IOption {
    [key: string]: string | boolean | null;
}

export class ComponentBase<T extends IOption> extends HTMLElement {
    private _option: IOption;
    protected _shadow: ShadowRoot;

    public constructor(option: T, templateId: string, mode: "open" | "closed" = "open") {
        super();
        this._shadow = this.attachShadow({ mode });
        this._option = option;
        const template = document.getElementById(templateId) as HTMLTemplateElement;
        if (template === null) {
            throw new Error("Template not found.");
        }
        this._shadow.appendChild(template.content.cloneNode(true));
    }

    protected get option(): T {
        return this._option as T;
    }

    public connectedCallback() {
        this._initAttribute();
    }

    private _initAttribute() {
        for (const name in this._option) {
            const attr = this.getAttribute(name);
            if (typeof this._option[name] === "boolean") {
                this._option[name] = attr !== null;
            } else {
                if (this._option[name] === null) {
                    this._option[name] = attr;
                } else {
                    this._option[name] = attr ?? this._option[name];
                }
            }
        }
    }

    protected _dispatchEvent(name: string, detail: any) {
        this.dispatchEvent(new CustomEvent(name, { detail }));
    }
}

export function insertTemplate(template: string) {
    let container = document.querySelector<HTMLDivElement>("#maui-template");
    if (container === null) {
        const tmp = document.createElement("div");
        tmp.id = "maui-template";
        document.body.appendChild(tmp);
        container = tmp;
    }
    container.innerHTML += template;
}