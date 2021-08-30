(function () {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsSendButton = document.querySelector('#wsSendButton');

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  let ws;

  wsButton.onclick = function () {
    wsSendButton.disabled = false;     
    ws = new WebSocket(`ws://${location.host}`);
//チャンネルに接続
    ws.onopen = function () {
      showMessage('WebSocket connection established');
    };
//接続したチャンネルにメッセージがpubされたらメッセージを取得   
    ws.onmessage = function (message) {
      let data = JSON.parse(message.data)
      showMessage(JSON.stringify(data.message));
    };
//チャンネルの接続解除
    ws.onclose = function (event) {
      showMessage('Connection closed.' + event);
      ws = null;
    };
//エラー（例外）
    ws.onerror = function (event) {
      showMessage('Connection error.' + event);
    };
  };
// メッセージを送る
  wsSendButton.onclick = function () {
//接続が確認できない場合     
    if (!ws) {
      showMessage('No WebSocket connection');
      return;
    }
// テキストフィールドのvalueをdom操作して取得「「
    const msg = document.querySelector('#msgInput').value;
// サーバーにメッセージを送信
    ws.send(msg);
  };
})();
