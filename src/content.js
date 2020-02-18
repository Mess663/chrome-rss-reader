// chrome.runtime.onConnect.addListener(function(port) {
//   // eslint-disable-next-line eqeqeq
//   if (port.name == 'test-connect') {
//     port.onMessage.addListener(function() {
//       // eslint-disable-next-line prefer-spread
//       const allCommands = Array.apply(
//         null,
//         document.querySelectorAll('.UFICommentBody')
//       );
//       const commands = [];
//       allCommands.forEach(e => {
//         commands.push(e.innerText);
//       });

//       commentHtml(commands);
//     });
//   }
// });

// function commentHtml(list) {
//   let content = '';
//   const d = document.createElement('table');

//   list.forEach(item => {
//     content += `
//       <tr>
//         <th>${item}</th>
//       </tr>
//     `;
//   });

//   d.innerHTML = content;
//   d.style =
//     'font-size: 12px;display:block;background-color: #fff;position: fixed;top: 50px;left: 50px;width: 500px;height: 300px;z-index: 9999;overflow-y: scroll;';
//   document.documentElement.appendChild(d);

//   const close = document.createElement('div');
//   close.innerHTML = 'X';
//   close.style =
//     'color: red;background-color: #fff;position: fixed;top: 0px;left: 0px;width: 50px;height: 50px;z-index: 9999;';
//   close.onclick = function() {
//     d.remove();
//     close.remove();
//   };
//   document.documentElement.appendChild(close);
// }
