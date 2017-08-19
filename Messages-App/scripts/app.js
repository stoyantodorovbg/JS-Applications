/**
 * Created by Stoyan on 17.8.2017 г..
 */
const handlers = {};
const util = {};

$(() => {
    util.getPartials = function (page) {
        return {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            page: `./templates/${page}.hbs`
        }
    };
    
    util.getUser = function (ctx) {
        ctx.username = localStorage.getItem('username');
    };

    util.formatDate = function (dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    };

    const app = Sammy('#app', function () {
        this.use('Handlebars', 'hbs');

        //HOME
        this.get('index.html', handlers.home);

        //LOGIN FORM
        this.get('#/login', handlers.getLoginForm);

        //LOGIN POST
        this.post('#/login', handlers.login);

        //REGISTER
        this.get('#/register', handlers.getRegisterForm);

        //REGISTER POST

        this.post('#/register', handlers.register);

        //LOGOUT
        this.get('#/logout', handlers.logout);

        //VIEW MESSAGES
        this.get('#/messages', handlers.viewMessages);

        //VIEW ARCHIVE OF MESSAGES
        this.get('#/archive', handlers.showArchive);

        //SEND MESSAGE FORM
        this.get('#/send', handlers.sendMessageForm);

        //SEND MESSAGE POST
        this.post('#/send', handlers.sendMessagePost);


    }).run();
});