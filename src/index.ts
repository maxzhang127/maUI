import "./index.scss";
import "./component/entry";
import "./demo/demoEntry";
import buttonContent from './demo/button/button.html';
import inputContent from './demo/input/input.html';
const root = document.getElementById("main-container");
if (root) {
    root.innerHTML = buttonContent + inputContent;
}