"use strict";

importScripts("repositories.js");

$(function (data) {
  "use strict";

  var _load = function () {
    var page = 0, per_page = 100, time = 2000;

    setInterval(function () {
      page = page + 1;

      repositories.find(page, per_page).then(function (repos) {
        if (repos.length === 0 || page >= 7) {
          self.close();
        } else {
          self.postMessage(repos);
        }
      });
    }, time);
  };

  var _insertRepos = function (repos, localRepos, reposChanged) {
    repos.forEach(function (repo) {
      var repoReturn = localRepos.filter(function (localRepo) {
        return localRepo.id === repo.id;
      });

      if (repoReturn.length === 0) {
        reposChanged.push({
          action: "insert",
          repo: repo
        });
      }
    });
  };

  var _removeRepos = function (repos, localRepos, reposChanged) {
    localRepos.forEach(function (localRepo) {
      var repoReturn = repos.filter(function (repo) {
        return localRepo.id === repo.id;
      });

      if (repoReturn.length === 0) {
        reposChanged.push({
          action: "remove",
          repo: localRepo
        });
      }
    });
  };

  var _update = function (localRepos) {
    repositories.findAll().then(function (repos) {
      var reposChanged = [];

      _insertRepos(repos, localRepos, reposChanged);

      _removeRepos(repos, localRepos, reposChanged);

      self.postMessage(reposChanged);
    });
  };

  if (data.cmd === "load") {
    _load();
  } else if (data.cmd === "update") {
    _update(data.repos);
  }
});