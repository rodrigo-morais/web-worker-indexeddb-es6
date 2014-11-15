importScripts('jquery.hive.pollen.js');

let repositories = (() => {

    'use strict';

    let _find = (_page, _per_page) => {
        let page = _page,
        per_page = _per_page,
        url = 'https://api.github.com/search/repositories?q=language:javascript&page=' + page + '&per_page=' + per_page,
        repositories_return = [];
        
        return new Promise((resolve, reject) => {
            $.ajax.get({
                url: url,
                dataType: 'json',
                success: (repos) => {
                    let repository = {},
                    items = repos.items || [];
                
                    items.forEach((repo) => {
                        repository = {
                            id: repo.id,
                            name: repo.name,
                            created_at: repo.created_at,
                            description: repo.description,
                            url: repo.html_url,
                            language: repo.language,
                            pushed_at: repo.pushed_at,
                            updated_at: repo.updated_at
                        };
                        repositories_return.push(repository);
                    });
                    resolve(repositories_return);
                }
            });
        });
    };

    let _findAll = () => {
        let url = 'https://api.github.com/search/repositories?q=language:javascript',
        repositories_return = [];

        return new Promise((resolve, reject) => {
            $.ajax.get({
                url: url,
                dataType: 'json',
                success: (repos) => {
                    let repository = {},
                    items = repos.items || [];


                    items.forEach((repo) => {
                        repository = {
                            id: repo.id,
                            name: repo.name,
                            created_at: repo.created_at,
                            description: repo.description,
                            url: repo.html_url,
                            language: repo.language,
                            pushed_at: repo.pushed_at,
                            updated_at: repo.updated_at
                        };
                        repositories_return.push(repository);
                    });
                    resolve(repositories_return);
                }
            });
        });
    };

    return {
        find: _find,
        findAll: _findAll
    };
})();