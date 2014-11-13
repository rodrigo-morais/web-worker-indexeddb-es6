define(["exports", "javascript/indexedDB"], function (exports, _javascriptIndexedDB) {
  "use strict";

  var localDB = _javascriptIndexedDB.default;


  var main = (function () {
    "use strict";

    var _showData = function () {
      localDB.init().then(function () {
        if (localDB.hasData()) {
          _findByLocal();
          _updateLocalData();
        } else {
          _findByServer();
        }
      }, function (error) {
        _findByServer();
      });
    };

    var _showRepos = function (repos) {
      var repoList = document.querySelector(".repos");

      repos.forEach(function (repo) {
        var repoElement = document.createElement("li"), linkRepo = document.createElement("a");

        linkRepo.appendChild(document.createTextNode(repo.name));
        linkRepo.href = repo.url;
        linkRepo.target = "_blank";

        repoElement.appendChild(linkRepo);
        repoElement.appendChild(document.createTextNode(" - " + repo.description));

        repoList.appendChild(repoElement);
      });
    };

    var _clearResposList = function () {
      var repoList = document.querySelector(".repos");

      repoList.innerHTML = "";
    };

    var _saveLocal = function (repos) {
      repos.forEach(function (repo) {
        localDB.insert(repo);
      });
    };

    var _findByServer = function () {
      if (window.Worker) {
        var worker = new Worker("javascript/worker/worker.js");

        worker.addEventListener("message", function (e) {
          var repos = e.data;

          if (e.data.length > 0) {
            _showRepos(repos);
            _saveLocal(repos);
            worker.postMessage({ cmd: "load" });
          }
        }, false);

        worker.postMessage({ cmd: "load" });
      }
    };

    var _findByLocal = function () {
      _showRepos(localDB.getItems());
    };

    var _insertRepoLocal = function (repo) {
      localDB.insert(repo);
    };

    var _removetRepoLocal = function (repo) {
      localDB.remove(repo);
    };

    var _updateLocalData = function () {
      if (window.Worker) {
        var worker = new Worker("javascript/worker/worker.js");

        worker.addEventListener("message", function (e) {
          var repos = e.data;

          repos.forEach(function (repo) {
            if (repo.action === "insert") {
              _insertRepoLocal(repo.repo);
            } else {
              _removetRepoLocal(repo.repo);
            }
          });

          _clearResposList();
          _findByLocal();
        }, false);

        worker.postMessage({ cmd: "update", repos: localDB.getItems() });
      }
    };

    var _load = function () {
      _showData();
    };

    return {
      load: _load
    };
  })();

  main.load();
});