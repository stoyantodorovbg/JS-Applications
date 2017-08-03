/**
 * Created by Stoyan on 2.8.2017 г..
 */
function getInfo() {
    let baseServiceUrl = 'https://judgetests.firebaseio.com/businfo/';
    let validBusStops = ['1287', '1308', '1327', '2334'];

    function takeInfo() {
        let busStopId = $('#stopId').val();
            $.get(baseServiceUrl + busStopId + '.json')
                .then(displayInfo)
                .catch(displayError);
    };
    takeInfo();
    
    function displayInfo(info) {
        $('#buses').empty();
        $('#stopName').text(info.name);
        for (let key in info.buses) {
            $('#buses').append($(`<li>Bus ${key} arrives in ${info.buses[key]} minutes</li>`));
        }
    }
    
    function displayError() {
        $('#stopName').text('Error');
    }
}