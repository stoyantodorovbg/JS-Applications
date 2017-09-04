let catalogService = (() => {
    function loadCatalog() {
        // Request catalog from db
        return requester.get('appdata', 'posts', 'kinvey');
    }

    function loadComments() {
        // Request comments from db
        return requester.get('appdata', 'comments', 'kinvey');
    }

    function loadTeamDetails(teamId) {
        return requester.get('appdata', 'teams/' + teamId, 'kinvey');
    }

    function edit(teamId, name, description) {
        let teamData = {
            name: name,
            comment: description,
            author: sessionStorage.getItem('username')
        };

        return requester.update('appdata', 'teams/' + teamId, 'kinvey', teamData);
    }

    function createPost(author, url, title, image, comment) {
        let postData = {
            author: author,
            url: url,
            title: title,
            image: image,
            comment: comment
        };

        return requester.post('appdata', 'posts', 'kinvey', postData);
    }

    function createComment(author, content) {
        let postData = {
            author: author,
           content: content
        };

        return requester.post('appdata', 'comments', 'kinvey', postData);
    }

    return {
        loadCatalog,
        loadComments,
        loadTeamDetails,
        edit,
        createPost,
        createComment
    }
})();