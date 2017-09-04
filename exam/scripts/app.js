/**
 * Created by Stoyan on 22.8.2017 г..
 */
$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', displayWelcomePage);
        this.get('#/welcomePage', displayWelcomePage);

        // REGISTER POST

        this.post('#/register', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            if (password !== repeatPass) {
                auth.showError('PASSWORDS DO NOT MATCH!');
            } else {
                auth.register(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);
                        auth.showLoading();
                        auth.showInfo('REGISTERED.');
                        displayWelcomePage(ctx);
                    }).catch(auth.handleError);
            }
        });

        // LOGIN POST

        this.post('#/login', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showLoading();
                    auth.showInfo('LOGGED IN!');
                    displayWelcomePage(ctx);
                }).catch(auth.handleError);
        });

        //LOGOUT

        this.get('#/logout', function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showLoading();
                    auth.showInfo('LOGGED OUT!');
                    displayWelcomePage(ctx);
                }).catch(auth.handleError);
        });

        //SHOW CATALOG

        this.get('#/catalog', function (ctx) {
            catalogService.loadCatalog()
                .then(function (posts) {
                    ctx.posts = posts;
                    ctx.hasNoPosts = true;
                    if (ctx.posts.length !== 0) {
                        ctx.hasNoPosts = false;
                    }

                    let count = 1;
                    for (let post of ctx.posts) {
                        post.count = count;
                        count++;
                        post.createdByUser = false;
                        if (post.author === sessionStorage.getItem('username')) {
                            post.createdByUser = true;

                        }
                        post.created = calcTime(post._kmd.ect)
                    }
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        post: './templates/post.hbs',
                    }).then(function () {
                        this.partial('./templates/catalog.hbs');
                    });
                });
        });

        //CREATE GET
        this.get('#/createPost', function (ctx) {
            getHeaderAndFooter(ctx).then(function () {
                this.partial('./templates/submitPost.hbs')
            });
        });

        //CREATE POST
        this.post('#/create', function (ctx) {
            let url = ctx.params.url;
            let title = ctx.params.title;
            let image = ctx.params.image;
            let comment = ctx.params.comment;
            let author = sessionStorage.getItem('username');

            catalogService.createPost(author, url, title, image, comment)
                .then(function (postInfo) {
                    auth.showInfo('Post created.');
                    $('#submitUrl').val('');
                    $('#submitTitle').val('');
                    $('#submitImage').val('');
                    $('#submitComment').val('');
                    displayWelcomePage(ctx)
                }).catch(auth.handleError);
        });

        //EDIT GET
        this.get('#/edit', function (ctx) {
            getHeaderAndFooter(ctx).then(function () {
                this.partial('./templates/editPost.hbs');
            })
        });

        //EDIT POST
        this.post('#/submitEdit', function (ctx) {
            let url = ctx.params.url;
            let title = ctx.params.title;
            let image = ctx.params.image;
            let comment = ctx.params.comment;
            let author = sessionStorage.getItem('username');

            catalogService.edit(author, url, title, image, comment)
                .then(function (postInfo) {
                    auth.showInfo('Post edited.');
                    $('#submitUrl').val('');
                    $('#submitTitle').val('');
                    $('#submitImage').val('');
                    $('#submitComment').val('');
                    displayWelcomePage(ctx)
                }).catch(auth.handleError);
        });

        //MY POSTS GET

        this.get('#/myPosts', function (ctx) {
            catalogService.loadCatalog()
                .then(function (myPosts) {
                    ctx.myPosts = myPosts;
                    ctx.hasNoPosts = true;
                    if (ctx.myPosts.length !== 0) {
                        ctx.hasNoPosts = false;
                    }

                    let count = 1;
                    for (let myPost of ctx.myPosts) {
                        myPost.createdByUser = false;
                        if (myPost.author === sessionStorage.getItem('username')) {
                            myPost.count = count;
                            count++;
                            myPost.createdByUser = true;

                        }
                        myPost.created = calcTime(myPost._kmd.ect)
                    }
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        myPost: './templates/myPost.hbs',
                    }).then(function () {
                        this.partial('./templates/myPosts.hbs');
                    });
                });
        });

        //SHOW COMMENTS
        this.get('#/comments', function (ctx) {
            catalogService.loadComments()
                .then(function (comments) {
                    ctx.comments = comments;
                    ctx.hasNoComments = true;
                    if (ctx.comments.length !== 0) {
                        ctx.hasNoComments = false;
                    }
                    let count = 1;
                    for (let comment of ctx.comments) {
                        comment.count = count;
                        count++;
                        comment.createdByUser = false;
                        if (comment.author === sessionStorage.getItem('username')) {
                            comment.createdByUser = true;

                        }
                        comment.created = calcTime(comment._kmd.ect)
                    }
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        comment: './templates/comment.hbs',
                    }).then(function () {
                        this.partial('./templates/comments.hbs');
                    });
                });
        });

        //POST COMMENT
        this.post('#/submitComment', function (ctx) {
            let content = ctx.params.content;
            let author = sessionStorage.getItem('username');

            catalogService.createComment(author, content)
                .then(function (postInfo) {
                    auth.showInfo('Comment is sent.');
                    $('#commentContent').val('');
                    displayWelcomePage(ctx)
                }).catch(auth.handleError);
        });


        //DELETE
        this.get('#/delete', function (ctx) {

            //requester.remove('appdata', 'posts' + ctx._id, 'kinvey');
            auth.showInfo('Deleted.');
        })

    });



    //WELCOME PAGE
    function displayWelcomePage(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
        ctx.username = sessionStorage.getItem('username');
        getHeaderAndFooter(ctx).then(function () {
            this.partial('./templates/welcomePage.hbs')
        });
    }

    // HEADER AND FOOTER
    function getHeaderAndFooter(ctx) {
        return ctx.loadPartials ({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        });
    }

    function calcTime(dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';
        }
    }


    app.run();
});