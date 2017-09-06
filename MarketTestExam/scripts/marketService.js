let marketService = (() => {
    function loadCatalog() {
        // Request teams from db
        return requester.get('appdata', 'products', 'kinvey');
    }

    function loadCart() {
        let endPoint = sessionStorage.getItem('userId')
        return requester.get('user', endPoint, 'kinvey');
    }
    
    function getUser() {
        let endPoint = sessionStorage.getItem('userId')
        return requester.get('user', endPoint, 'kinvey')
    }

    function getProduct(productId) {
        return requester.get('appdata', 'products/' + productId, 'kinvey')
    }
    
    function updateUser(userInfo) {
        let endPoint = sessionStorage.getItem('userId')
        return requester.update('user', endPoint, 'kinvey', userInfo )
    }
    
    return {
        loadCatalog,
        loadCart,
        getUser,
        getProduct,
        updateUser
    }
})();