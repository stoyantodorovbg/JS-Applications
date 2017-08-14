/**
 * Created by Stoyan on 8.8.2017 г..
 */
function startApp() {
    $('header').find('a').show();
    const adsDiv = $('#ads');
    const templates = {};

    loadTemplates();
    async function loadTemplates() {
        const [adsCatalogTemplate, adBoxTemplate]
        = await Promise.all([
            $.get('./templates/adsCatalog.html'),
            $.get('./templates/adBoxPartial.html')
        ]);

        templates['catalog'] = Handlebars.compile(adsCatalogTemplate);
        Handlebars.registerPartial('adBox', adBoxTemplate)
    }

    (() => {})();

    function showView(view) {
        $('section').hide();

        switch (view) {
            case 'home' :
                $('#viewHome').show();
                break;
            case 'login' :
                $('#viewLogin').show();
                break;
            case 'ads' :
                $('#viewAds').show();
                loadAds();
                break;
            case 'createAd' :
                $('#viewCreateAd').show();
                break;
            case 'editAd' :
                $('#viewEditAd').show();
                break;
            case 'details' :
                $('#viewDetails').show();
                break;
            case 'register' :
                $('#viewRegister').show();
                break;
        }
    }

    function navigateTo(e) {
        $('section').hide();
        let target = $(e.target).attr('data-target');
        $('#' + target).show();
    }

    $('#linkHome').click(() => showView('home'));
    $('#linkListAds').click(() => showView('ads'));
    $('#linkLogin').click(() => showView('login'));
    $('#linkCreateAd').click(() => showView('createAd'));
    $('#linkRegister').click(() => showView('register'));
    $('#linkLogout').click(logout);

    $('#buttonLoginUser').click(login);
    $('#buttonRegisterUser').click(register);
    $('#buttonCreateAd').click(createAd);


    $(document).on({
        ajaxStart: () => $('#loadingBox').show(),
        ajaxStop: () => $('#loadingBox').hide()
    });

    $('#infoBox').click((event) => $(event.target).hide());
    $('#errorBox').click((event) => $(event.target).hide());
    
    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(() => $('#infoBox').fadeOut(), 1000);


    }
    
    function showError(message) {
        $('#errorBox').text(message);
        $('#errorBox').show();
        setTimeout(() => $('#errorBox').fadeOut(), 1000);
        $('#formLoginName').val('');
        $('#formLoginPass').val('');
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }
    
    let requester = (() => {
        const baseUrl = 'https://baas.kinvey.com/';
        const appKey = 'kid_HynWSXOP-';
        const appSecret = 'b76c85783b06418497245994fbbd3eb3';

        function makeAuth(type) {
            if (type === 'basic') {
                return 'Basic ' + btoa(appKey + ':' + appSecret);
            } else {
                return 'Kinvey ' + localStorage.getItem('authtoken')
            }
        }

        function makeRequest(method, module, url, auth) {
            return req = {
                url: baseUrl + module + '/' + appKey + '/' + url,
                method,
                headers: {
                    'Authorization': makeAuth(auth)
                }
            };
        }

        function get(module, url, auth) {
            let req = makeRequest('GET', module, url, auth);
            return $.ajax(req);
        }

        function post(module, url, data, auth) {
            let req = makeRequest('POST', module, url, auth);
            req.data = JSON.stringify(data);
            req.headers['Content-Type'] = 'application/json';
            return $.ajax(req);
        }

        function update(module, url, data, auth) {
            let req = makeRequest('PUT', module, url, auth);
            req.data = JSON.stringify(data);
            req.headers['Content-Type'] = 'application/json';
            return $.ajax(req);
        }

        function remove(module, url, auth) {
            let req = makeRequest('DELETE', module, url, auth);
            return $.ajax(req);
        }
        return {
            get, post, update, remove
        }
    })();

    if (localStorage.getItem('authoken') !== null &&
    localStorage.getItem('username') !== null) {
        userLoggedIn();
    } else {
        userLoggedOut();
    }
    showView('home');

    function userLoggedIn() {
        $('#loggedInUser').text(`Welcome, ${localStorage.getItem('username')}!`);
        $('#loggedInUser').show();
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkLogout').show();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
    }
    function userLoggedOut() {
        $('#loggedInUser').text('').hide();
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkLogout').hide();
        $('#linkListAds').hide();
        $('#linkCreateAd').hide();
    }

    
    function saveSession(data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);
        userLoggedIn();
    }
    
    async function login() {
        let form = $('#formLogin');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let data = await requester.post('user', 'login', {username, password}, 'basic');
            showInfo('Logged in.');
            saveSession(data);
            showView('ads');
        } catch (err) {
            handleError(err);
        }

    }
    
    async function register() {
        let form = $('#formRegister');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let data = await requester.post('user', '', {username, password}, 'basic');
            showInfo('The registration is successful.');
            saveSession(data);
            showView('ads');
        } catch (err) {
            handleError(err);
        }
    }

    async function logout() {
        try {
            let data = await requester.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')});
            showInfo('Logged out.');
            localStorage.clear();
            userLoggedOut();
            showView('home');
        } catch (err) {
            handleError(err);
        }
    }

    async function loadAds() {
        let content = $('#content');
        content.empty();
        let data = await requester.get('appdata', 'Posts');
        data.forEach(d => {
            if(d._acl.creator === localStorage.getItem('id')) {
                d.isAuthor = true;
            }
        });

        let context = {
            data
        };

        let html = templates['catalog'](context);
        content.html(html);
        let editButtons = $(content).find('.ad-box').find('.edit');
        let deleteButtons = $(content).find('.ad-box').find('.delete');
        let detailsButtons = $(content).find('.ad-detailsBtn');

        editButtons.click(openEditAd);
        deleteButtons.click(deleteAd);
        detailsButtons.click(viewDetails);

    }
    
    async function createAd() {
        let form = $('#formCreateAd');
        let title = form.find('input[name="title"]').val();
        let description = form.find('textarea[name="description"]').val();
        let imageUrl = form.find('input[name="image"]').val();
        let price = Number(form.find('input[name="price"]').val());
        let date = new Date().toDateString();
        let publisher = localStorage.getItem('username');

        if(title.length === 0) {
            showError('Title can not be empty.');
            return;
        } else if(Number.isNaN(price)) {
            showError('The product must has a price.');
            return;
        }

        let newAd = {
            title, description, price, imageUrl, date, publisher
        };

        try {
            await requester.post('appdata', 'Posts', newAd);
            showInfo('The ad is created.');
            showView('ads');
        } catch (err) {
            handleError(err)
        }

    }
    
    async function deleteAd() {
        let id = $(this).parent().attr('data-id')
        await requester.remove('appdata', 'Posts/' + id);
        showInfo('The ad is deleted.');
        showView('ads');
    }

    async function openEditAd() {
        let id = $(this).parent().attr('data-id');
        let ad = await requester.get('appdata', `Posts/${id}`, 'kinvey');
        let form = $('#formEditAd');
        form.find('input[name="title"]').val(ad.title);
        form.find('textarea[name="description"]').val(ad.description);
        form.find('input[name="price"]').val(Number(ad.price));
        form.find('input[name="image"]').val(ad.imageUrl);
        let date = ad.date;
        let publisher = ad.publisher;
        form.find('#buttonEditAd').click(() => editAd(id, date, publisher));
        showView('editAd');
    }
    
    async function editAd(id, date, publisher) {
        let form = $('#formEditAd');
        let title = form.find('input[name="title"]').val();
        let description = form.find('textarea[name="description"]').val();
        let price = form.find('input[name="price"]').val();
        let imageUrl = form.find('input[name="image"]').val();

        if(title.length === 0) {
            showError('Title can not be empty.');
            return;
        } else if(Number.isNaN(price)) {
            showError('The product must has a price.');
            return;
        }

        let editedAd = {
            title, description, price, imageUrl, date, publisher
        };

        try {
            await requester.update('appdata', 'Posts/' + id, editedAd);
            showInfo('The ad is edited.');
            showView('ads');
        } catch (err) {
            handleError(err)
        }

    }

    async function viewDetails() {
        let id = $(this).parent().children().attr('data-id');
        let ad = await requester.get('appdata', `Posts/${id}`, 'kinvey');
        showView('details');
        let image = $('img');
        image.remove('#theImg');
        $('#publisherAd').text(`By: ${ad.publisher}`);
        $('#titleAd').text(`Product: ${ad.title}`);
        $('#imageAd').append(`<img id="theImg" src="${ad.imageUrl}" />`);
        $('#descriptionAd').text(`Description: ${ad.description}`);
        $('#priceAd').text(`Price: ${ad.price} lv`);
        $('#dateAd').text(`Publish on: ${ad.date}`);

    }
}