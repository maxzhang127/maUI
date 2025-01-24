import "./component/entry";
import "./demo/demoEntry";
import "./index.scss";
import buttonContent from './demo/button/button.html';
import inputContent from './demo/input/input.html';
import selectContent from './demo/select/select.html';
import content from './demo/demo.html';
const root = document.getElementById("main-container");
if (root) {
    root.innerHTML = content;
}