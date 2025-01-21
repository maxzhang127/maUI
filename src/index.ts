import "./index.scss";
import "./component/entry";
import "./demo/demoEntry";
import content from './demo/button/button.html';
const root = document.getElementById("main-container");
if (root) {
    root.innerHTML = content;
}