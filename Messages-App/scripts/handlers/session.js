/**
 * Created by Stoyan on 18.8.2017 г..
 */
handlers.getLoginForm = function () {
    this.loadPartials(util.getPartials('login')).then(function () {
        this.partial('./templates/common/main.hbs');
    });
};

handlers.login = function (ctx) {
    let {username, password} = this.params;
    auth.login(username, password).then((userInfo) => {
        auth.saveSession(userInfo);
        notifications.showInfo('LOGIN SUCCESSFUL.')
        ctx.redirect('#');
    });
};

handlers.getRegisterForm = function () {
    this.loadPartials(util.getPartials('register')).then(function () {
        this.partial('./templates/common/main.hbs');
    });
};

handlers.register = function (ctx) {
    let {username, password, name} = this.params;
    auth.register(username, password, name).then((userInfo) => {
        auth.saveSession(userInfo);
        notifications.showInfo('Registration successful.');
        ctx.redirect('#');
    });
};

handlers.logout = function (ctx) {
    auth.logout().then(() => {
        localStorage.clear();
        notifications.showInfo('LOGOUT SUCCESSFUL.');
        ctx.redirect('#');
    });
};