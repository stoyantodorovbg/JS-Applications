/**
 * Created by Stoyan on 18.8.2017 г..
 */
handlers.home = function () {
    let content = {};
    if (auth.isAuthed()) {
        this.username = localStorage.getItem('username');
        content = util.getPartials('userHome');
    } else {
        content = util.getPartials('home');
    }

    this.loadPartials(content).then(function () {
        this.partial('./templates/common/main.hbs');
    });
};