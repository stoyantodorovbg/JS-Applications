/**
 * Created by Stoyan on 2.8.2017 г..
 */
function attachEvents() {
    $('#refresh').on('click', refresh);
    $('#submit').on('click', submit);

    function submit() {
        let messageJson = {
            author: $('#author').val(),
            content: $('#content').val(),
            timestamp:  Date.now()
        };

        let getRequest = {
            method: 'POST',
            url: 'https://messenger-85d4c.firebaseio.com/.json',
            data: JSON.stringify(messageJson),
            success: refresh,
        };
        $.ajax(getRequest);
    }


    function refresh() {
       let getRequest = {
           method: 'GET',
           url: 'https://messenger-85d4c.firebaseio.com/.json',
           success: showMessages,
           error: showMessagesError
       };
       $.ajax(getRequest);
    }

    function showMessages(data) {
        let sortedMessages = [];

        for (let message in data) {
            sortedMessages.push(data[message]);
        }
        sortedMessages.sort((a, b) => a.timestamp > b.timestamp);
        let result = '';
        for (let i = 0; i < sortedMessages.length; i++) {
            result += `${sortedMessages[i].author}: ${sortedMessages[i].content}\n`
        }

        $('#messages').text(result)

    }

    function showMessagesError() {
        $('#messages').text(Error);
    }
}