/**
 * Created by Stoyan on 2.8.2017 г..
 */
function solve() {
    let currentStopId = 'depot'
    let depart = function () {
        $('#arrive').removeAttr('disabled');
        $('#depart').attr('disabled', 'disabled');

        let getRequest = {
            method: 'GET',
            url: `https://judgetests.firebaseio.com/schedule/${currentStopId}.json `,
            success: dispalayStop,
            error: displayStopError
        };
        $.ajax(getRequest);
    };

    function dispalayStop (data) {
        $('span.info').text(`Next stop ${data.name}`);
    }

    function displayStopError() {
        $('span.info').text('Error');
        $('#arrive').removeAttr('disabled', 'disabled');
        $('#depart').attr('disabled', 'disabled');
    }


    let arrive = function () {
        $('#depart').removeAttr('disabled');
        $('#arrive').attr('disabled', 'disabled');
        let getRequest = {
            method: 'GET',
            url: `https://judgetests.firebaseio.com/schedule/${currentStopId}.json `,
            success: dispalayLastStop,
            error: displayLastStopError
        };
        $.ajax(getRequest);


    };

    function dispalayLastStop (data) {
        $('span.info').text(`Arriving at ${data.name}`);
        currentStopId = data.next;
    }

    function displayLastStopError() {
        $('span.info').text('Error');
        $('#arrive').removeAttr('disabled', 'disabled');
        $('#depart').attr('disabled', 'disabled');
    }

    return {
        depart,
        arrive
    };
}