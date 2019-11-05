// 11
import { r1 } from '../utils/tool';

console.log(r1());
const a = 12;
console.log(a);
document.getElementById('go').onclick = function() {
  console.log(chrome.extension.getURL('index.html'));
  window.open(chrome.extension.getURL('index.html'));
};
