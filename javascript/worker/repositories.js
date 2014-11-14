importScripts('jquery.hive.pollen.js');
importScripts('../q.js');

let repositories = (() => {

    'use strict';

    let _find = (_page, _per_page) => {
        let page = _page,
        per_page = _per_page,
        url = 'https://api.github.com/search/repositories?q=language:javascript&page=' + page + '&per_page=' + per_page,
        deferred = Q.defer();
        
        $.ajax.get({
            url: url,
            dataType: 'json',
            success: (repos) => {
                let repositories = [],
                    repository = {},
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
                    repositories.push(repository);
                });

                deferred.resolve(repositories);
            }
        });

        return deferred.promise;
    };

    let _findAll = () => {
        let url = 'https://api.github.com/search/repositories?q=language:javascript',
        deferred = Q.defer();

        $.ajax.get({
            url: url,
            dataType: 'json',
            success: (repos) => {
                let repositories = [],
                    repository = {},
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
                    repositories.push(repository);
                });

                deferred.resolve(repositories);
            }
        });

        return deferred.promise;
    };

    return {
        find: _find,
        findAll: _findAll
    };
})();