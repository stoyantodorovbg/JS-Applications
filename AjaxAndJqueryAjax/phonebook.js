/**
 * Created by Stoyan on 1.8.2017 г..
 */
$(function () {

    $('#btnLoad').on('click', loadContacts);
    $('#btnCreate').on('click', createContact);

    let baseServiceUrl = "https://phonebook-9f8e9.firebaseio.com/";
    function loadContacts() {
        $('#phonebook').empty();
        $.get(baseServiceUrl + '.json')
            .then(displayContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        for (let key in contacts) {
            let person = contacts[key]['name'];
            let phone = contacts[key]['phone'];
            let li = $(`<li>${person}: ${phone}</li>`);
            li.append($('<button>Delete</button>').click(deleteContact.bind(this, key)));
            $('#phonebook').append(li);
        }
    }

    function displayError(err) {
        $('#phoneboook').append($('<li>Error</li>'));
    }

    function createContact() {
        let newContactJson = JSON.stringify({
            name: $('#person').val(),
            phone: $('#phone').val()
        });
        $.post(baseServiceUrl + '.json', newContactJson)
            .then(loadContacts)
            .catch(displayError);

        $('#person').val('');
        $('#phone').val('');
    }
    
    function deleteContact(key) {
        let request = {
            method: 'DELETE',
            url: baseServiceUrl + '/' + key + '.json'
        };
        $.ajax(request)
            .then(loadContacts)
            .catch(displayError);
    }
    
});
