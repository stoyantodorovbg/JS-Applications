/**
 * Created by Stoyan on 11.8.2017 г..
 */
function attachEvents() {
    $('#btnLoadTowns').click(showTowns);

    function showTowns() {
        let towns = $('#towns').val().split(', ');
        let source = $('#towns-template').html();
        let template = Handlebars.compile(source);
        let obj = {towns};
        let html = template(obj);
        $('#root').append(html);
    }
}