
function sendMessage() {
    const messageInput = document.getElementById('message-input_general');
    const message = messageInput.value.trim();

    if (message !== '') {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                'messageType' : "classic",
                'owner': username,
                'message': message,
                'time' : new Date().toLocaleTimeString()
            }));
            messageInput.value = '';
        } else {
            console.warn('La connexion WebSocket n\'est pas encore établie.');
        }
    }
}

function handleKeyPressGeneral(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
