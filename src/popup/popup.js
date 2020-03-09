document.getElementById('go').onclick = function() {
  window.open(chrome.extension.getURL('index.html'));
};
