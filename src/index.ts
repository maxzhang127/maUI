import "./index.scss";
import "./component/entry";
import content from './demo/button.html';
const root = document.getElementById("main-container");
if (root) {
    root.innerHTML = content;
}