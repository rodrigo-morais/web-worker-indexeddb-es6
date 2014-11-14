importScripts('repositories.js');

$((data) => {

    'use strict';

    let _load = () => {
        let page = 0,
        per_page = 100,
        time = 2000;

        setInterval(() => {
            page = page + 1;

            repositories.find(page, per_page).then((repos) => {
                if (repos.length === 0 || page >= 7) {
                    self.close();
                }
                else {
                    self.postMessage(repos);
                }
            });
        }, time);
    };

    let _insertRepos = (repos, localRepos, reposChanged) => {
        repos.forEach((repo) => {
            let repoReturn = localRepos.filter((localRepo) => {
                return localRepo.id === repo.id;
            });

            if (repoReturn.length === 0) {
                reposChanged.push({
                    'action': 'insert',
                    'repo': repo
                });
            }
        });
    };

    let _removeRepos = (repos, localRepos, reposChanged) => {
        localRepos.forEach(function (localRepo) {
            let repoReturn = repos.filter((repo) => {
                return localRepo.id === repo.id;
            });

            if (repoReturn.length === 0) {
                reposChanged.push({
                    'action': 'remove',
                    'repo': localRepo
                });
            }
        });
    };

    let _update = (localRepos) => {
        repositories.findAll().then((repos) => {
            let reposChanged = [];

            _insertRepos(repos, localRepos, reposChanged);

            _removeRepos(repos, localRepos, reposChanged);
            
            self.postMessage(reposChanged);
        });
    };
    
    if (data.cmd === 'load') {
        _load();
    }
    else if (data.cmd === 'update') {
        _update(data.repos);
    }

});