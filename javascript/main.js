import localDB from 'javascript/indexedDB';

let main = (function () {
    'use strict';

    let _showData = function () {
        localDB.init().then(function () {
            if (localDB.hasData()) {
                _findByLocal();
                _updateLocalData();
            }
            else {
                _findByServer();
            }
        }, function (error) {
            _findByServer();
        });
    };

    let _showRepos = function (repos) {
        let repoList = document.querySelector(".repos");

        repos.forEach(function (repo) {
            let repoElement = document.createElement('li'),
                linkRepo = document.createElement('a');

            linkRepo.appendChild(document.createTextNode(repo.name));
            linkRepo.href = repo.url;
            linkRepo.target = '_blank';

            repoElement.appendChild(linkRepo);
            repoElement.appendChild(document.createTextNode(' - ' + repo.description));

            repoList.appendChild(repoElement);
        });
    };

    let _clearResposList = function () {
        let repoList = document.querySelector(".repos");

        repoList.innerHTML = "";
    };

    let _saveLocal = function (repos) {
        repos.forEach(function (repo) {
            localDB.insert(repo);
        });
    };

    let _findByServer = function () {
        if (window.Worker) {
            let worker = new Worker('javascript/worker/worker.js');

            worker.addEventListener('message', function (e) {
                let repos = e.data;

                if (e.data.length > 0) {
                    _showRepos(repos);
                    _saveLocal(repos);
                    worker.postMessage({'cmd': 'load'});
                }

            }, false);

            worker.postMessage({ 'cmd': 'load' });
        }
    };

    let _findByLocal = function () {
        _showRepos(localDB.getItems());
    };

    let _insertRepoLocal = function (repo) {
        localDB.insert(repo);
    };

    let _removetRepoLocal = function (repo) {
        localDB.remove(repo);
    };

    let _updateLocalData = function () {
        if (window.Worker) {
            let worker = new Worker('javascript/worker/worker.js');

            worker.addEventListener('message', function (e) {
                let repos = e.data;
                
                repos.forEach(function (repo) {
                    if (repo.action === 'insert') {
                        _insertRepoLocal(repo.repo);
                    }
                    else {
                        _removetRepoLocal(repo.repo);
                    }
                });

                _clearResposList();
                _findByLocal();

            }, false);

            worker.postMessage({ 'cmd': 'update', 'repos': localDB.getItems() });
        }
    };

    let _load = function () {
        console.log('main');
        _showData();
    };

    return {
        load: _load
    };
})();

main.load();