
function sendMessageSession() {
    const messageInput = document.getElementById('message-input_session');
    const message = messageInput.value.trim();

    if (message !== '') {
        if (socket.readyState === WebSocket.OPEN) {
            // console.log(message);
            socket.send(JSON.stringify({ action: 'sendMessageSession', text: message }));
            messageInput.value = '';
        } else {
            console.warn('La connexion WebSocket n\'est pas encore établie.');
        }
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessageSession();
    }
}
