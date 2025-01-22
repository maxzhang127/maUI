/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 204:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<template id="ma-button"><button part="button"><slot></slot></button></template>`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ 930:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<template id="ma-input"><div part="input-container"><input part="input" type="text" id="input-field"> <label part="label" for="input-field">Input</label></div></template>`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ 775:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<div class="demo-button"><div class="block"><div class="button-container"><ma-button>Default</ma-button></div></div><div class="container block"><ma-button class="button-block" color="secondary">Secondary</ma-button><ma-button class="button-block" color="success">Success</ma-button><ma-button class="button-block" color="danger">Danger</ma-button><ma-button class="button-block" color="warning">Warning</ma-button></div><div class="container block"><ma-button size="l">Big</ma-button><ma-button size="m">Medium</ma-button><ma-button size="s">Small</ma-button></div><div class="block disabled-button"><div class="button-container"><ma-button disabled="disabled">Disabled button</ma-button></div></div><div class="block container"><div class="button-container"><ma-button radius="5">Radius 5</ma-button></div><div class="button-container"><ma-button radius="10">Radius 10</ma-button></div><div class="button-container"><ma-button radius="15">Radius 15</ma-button></div></div></div>`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ 410:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<ma-input></ma-input><ma-input label="标题"></ma-input>`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ 719:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 829:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 959:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 238:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 901:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const componentBase_1 = __webpack_require__(278);
const button_html_1 = __importDefault(__webpack_require__(204));
__webpack_require__(719);
class ButtonOption {
    constructor() {
        this.color = "primary";
        this.disable = false;
        this.size = "medium";
        this.radius = "0";
    }
}
class MaButton extends componentBase_1.ComponentBase {
    constructor() {
        super(new ButtonOption(), "ma-button");
    }
    connectedCallback() {
        super.connectedCallback();
        this._init();
    }
    _init() {
        const button = this._shadow.querySelector(`[part="button"]`);
        if (button === null) {
            throw new Error("Label element not found.");
        }
        button.addEventListener("click", () => {
            this._dispatchEvent("click", null);
        });
    }
}
customElements.define('ma-button', MaButton);
(0, componentBase_1.insertTemplate)(button_html_1.default);


/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentBase = void 0;
exports.insertTemplate = insertTemplate;
class ComponentBase extends HTMLElement {
    constructor(option, templateId, mode = "open") {
        super();
        this._shadow = this.attachShadow({ mode });
        this._option = option;
        const template = document.getElementById(templateId);
        if (template === null) {
            throw new Error("Template not found.");
        }
        this._shadow.appendChild(template.content.cloneNode(true));
    }
    get option() {
        return this._option;
    }
    connectedCallback() {
        this._initAttribute();
    }
    _initAttribute() {
        for (const name in this._option) {
            const attr = this.getAttribute(name);
            if (typeof this._option[name] === "boolean") {
                this._option[name] = attr !== null;
            }
            else {
                if (this._option[name] === null) {
                    this._option[name] = attr;
                }
                else {
                    this._option[name] = attr !== null && attr !== void 0 ? attr : this._option[name];
                }
            }
        }
    }
    _dispatchEvent(name, detail) {
        this.dispatchEvent(new CustomEvent(name, { detail }));
    }
}
exports.ComponentBase = ComponentBase;
function insertTemplate(template) {
    let container = document.querySelector("#maui-template");
    if (container === null) {
        const tmp = document.createElement("div");
        tmp.id = "maui-template";
        document.body.appendChild(tmp);
        container = tmp;
    }
    container.innerHTML += template;
}


/***/ }),

/***/ 696:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(901);
__webpack_require__(723);


/***/ }),

/***/ 723:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
const componentBase_1 = __webpack_require__(278);
const input_html_1 = __importDefault(__webpack_require__(930));
__webpack_require__(829);
class InputOption {
    constructor() {
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
class Input extends componentBase_1.ComponentBase {
    constructor() {
        super(new InputOption(), "ma-input");
    }
    connectedCallback() {
        super.connectedCallback();
        this._attachEvent();
        this._initLabel();
        this._initInput();
    }
    _initLabel() {
        if (this.option.label === null) {
            return;
        }
        const label = this._shadow.querySelector("[part=label]");
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
    _initInput() {
        const input = this._shadow.querySelector("[part=input]");
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
    _attachEvent() {
        const input = this._shadow.querySelector("[part=input]");
        const label = this._shadow.querySelector("[part=label]");
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
            if (input.value === "") {
                label.part.remove("little-label");
                label.part.add("big-label");
            }
        });
    }
    _updateHasValue(input, label) {
        this.option.value = input.value;
        if (this.option.value === "") {
            label.part.remove("little-label");
            label.part.add("big-label");
        }
        else {
            label.part.add("little-label");
            label.part.remove("big-label");
        }
    }
}
exports.Input = Input;
customElements.define("ma-input", Input);
(0, componentBase_1.insertTemplate)(input_html_1.default);


/***/ }),

/***/ 115:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(959);


/***/ }),

/***/ 156:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(238);
__webpack_require__(696);
__webpack_require__(115);
const button_html_1 = __importDefault(__webpack_require__(775));
const input_html_1 = __importDefault(__webpack_require__(410));
const root = document.getElementById("main-container");
if (root) {
    root.innerHTML = button_html_1.default + input_html_1.default;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(156);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map