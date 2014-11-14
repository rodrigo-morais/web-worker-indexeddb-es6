import localDB from 'javascript/indexedDB';

let main = (function () {
    'use strict';

    let _showData = () => {
        localDB.init().then(() => {
            if (localDB.hasData()) {
                _findByLocal();
                _updateLocalData();
            }
            else {
                _findByServer();
            }
        }, (error) => {
            _findByServer();
        });
    };

    let _showRepos = (repos) => {
        let repoList = document.querySelector(".repos");

        repos.forEach((repo) => {
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

    let _clearResposList = () => {
        let repoList = document.querySelector(".repos");

        repoList.innerHTML = "";
    };

    let _saveLocal = (repos) => {
        repos.forEach((repo) => {
            localDB.insert(repo);
        });
    };

    let _findByServer = () => {
        if (window.Worker) {
            let worker = new Worker('javascript/worker/worker.js');

            worker.addEventListener('message', (e) => {
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

    let _findByLocal = () => {
        _showRepos(localDB.getItems());
    };

    let _insertRepoLocal = (repo) => {
        localDB.insert(repo);
    };

    let _removetRepoLocal = (repo) => {
        localDB.remove(repo);
    };

    let _updateLocalData = () => {
        if (window.Worker) {
            let worker = new Worker('javascript/worker/worker.js');

            worker.addEventListener('message', (e) => {
                let repos = e.data;
                
                repos.forEach((repo) => {
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

    let _load = () => {
        _showData();
    };

    return {
        load: _load
    };
})();

main.load();