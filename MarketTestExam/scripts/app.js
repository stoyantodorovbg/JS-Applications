/**
 * Created by Stoyan on 5.9.2017 г..
 */
$(() => {
    const app = Sammy('#app', function () {
        this.use('Handlebars', 'hbs');
        this.get('index.html', displayHome);
        this.get('#/home', displayHome);

        //LOGIN FORM

        this.get('#/login', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/login.hbs');
            });
        });

        // LOGIN POST

        this.post('#/loginPost', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.loading('PLEASE WAIT!');
                    auth.showInfo('LOGGED IN!');
                    displayHome(ctx);
                }).catch(auth.handleError);
        });

        //LOGOUT

        this.get('#/logout', function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.loading('PLEASE WAIT!');
                    auth.showInfo('LOGGED OUT!');
                    displayHome(ctx);
                }).catch(auth.handleError);
        });

        //REGISTER FORM

        this.get('#/register', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/register.hbs');
            });
        });

        // REGISTER POST

        this.post('#/registerPost', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let name = ctx.params.name;

            auth.register(username, password, name)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.loading('PLEASE WAIT!');
                    auth.showInfo('REGISTERED.');
                    displayHome(ctx);
                }).catch(auth.handleError);
        });

        //PRODUCTS OF THE CATALOG

        this.get('#/showProducts', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            marketService.loadCatalog()
                .then(function (products) {
                    ctx.products = products;
                    for (let product of ctx.products) {
                        product.price = parseFloat(product.price).toFixed(2);
                    }
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        products: './templates/product.hbs'
                    }).then(function () {
                        this.partial('./templates/shop.hbs')
                            .then(function () {
                                let btn = $('button.purchase')
                                btn.click(function () {
                                    let productId = $(this).attr('data-id');
                                    purchase(productId);
                                });
                            });
                    });
                });
        });
        
        // PRODUCTS OF THE CART
        
        this.get('#/cart', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            marketService.loadCart()
                .then(function (user) {
                    ctx.products = user.cart;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        products: './templates/productInTheCart.hbs'
                    }).then(function () {
                        this.partial('./templates/cart.hbs')
                            .then(function () {
                                let btn = $('button.purchase')
                                btn.click(function () {
                                    let productId = $(this).attr('data-id');
                                    purchase(productId);
                                });
                            });
                    });
                }).catch(auth.handleError);
        });

        // PURCHASE

        function purchase(productId) {
            marketService.getProduct(productId)

                .then(function (product) {
                    marketService.getUser()
                        .then(function (userInfo) {
                            let cart;
                            if(userInfo.cart === undefined) {
                                cart = {};
                            } else {
                                cart = userInfo.cart;
                            }
                            // HAS ALREADY PURCHASE THAT PRODUCT
                            if (cart.hasOwnProperty(productId)) {
                                let quantity = Number(cart[productId].quantity) + 1;
                                cart[productId] = {
                                    quantity: quantity,
                                    product: {
                                        name: product.name,
                                        description: product.description,
                                        price: Number(product.price) * quantity
                                    }
                                }
                            } else {
                                cart[productId] = {
                                    quantity: 1,
                                    product: {
                                        name: product.name,
                                        description: product.description,
                                        price: Number(product.price)
                                    }
                                }
                            }

                            userInfo.cart = cart;
                            marketService.updateUser(userInfo);
                            auth.loading('PLEASE WAIT!');
                            auth.showInfo('THE PRODUCT IS ADDED IN THE CART.');
                        }).catch(auth.handleError);
                }).catch(auth.handleError);
        }

        // HOME

        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registered: './templates/homeFromUser.hbs'
            }).then(function () {
                this.partial('./templates/home.hbs')
            });
        }

    });

    app.run();
});
