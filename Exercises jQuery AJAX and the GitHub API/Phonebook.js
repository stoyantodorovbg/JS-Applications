/**
 * Created by Stoyan on 3.8.2017 г..
 */
function attachEvents() {
    $('#btnLoad').on('click', loadContacts);
    $('#btnCreate').on('click', createContact);
    
    function deleteContact(key) {
        let deleteRequest = {
            method: 'DELETE',
            url: `https://phonebook-nakov.firebaseio.com/phonebook/${key}.json`,
            success: loadContacts
        };
        $.ajax(deleteRequest);
    }

    function createContact() {
        let contactJson = {
            person: $('#person').val(),
            phone: $('#phone').val(),
        };

        let postRequest = {
            method: 'POST',
            url: 'https://phonebook-nakov.firebaseio.com/phonebook.json',
            data: JSON.stringify(contactJson),
            success: loadContacts
        };

        $.ajax(postRequest);

        $('#person').val('');
        $('#phone').val('');

    }
    
    function loadContacts() {
        let getRequest = {
            method: 'GET',
            url: 'https://phonebook-nakov.firebaseio.com/phonebook.json',
            success: showContacts,
            error: showContactsError
        };
        $.ajax(getRequest);
    }
    
    function showContacts(data) {
        $('#phonebook').empty();
        for (let key in data) {
        let btnDelete = $('<button>[Delete]</button>').on('click', deleteContact.bind(this, key));
        let li = $(`<li>${data[key].person}: ${data[key].phone}</li>`);
        li.append(btnDelete);
            $('#phonebook').append(li);
        }
    }
    
    function showContactsError() {
        $('#phonebook').text('Error');
    }
}