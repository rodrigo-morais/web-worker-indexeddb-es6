"use strict";

importScripts("jquery.hive.pollen.js");

var repositories = (function () {
  "use strict";

  var _find = function (_page, _per_page) {
    var page = _page, per_page = _per_page, url = "https://api.github.com/search/repositories?q=language:javascript&page=" + page + "&per_page=" + per_page, repositories_return = [];

    return new Promise(function (resolve, reject) {
      $.ajax.get({
        url: url,
        dataType: "json",
        success: function (repos) {
          var repository = {}, items = repos.items || [];

          items.forEach(function (repo) {
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

  var _findAll = function () {
    var url = "https://api.github.com/search/repositories?q=language:javascript", repositories_return = [];

    return new Promise(function (resolve, reject) {
      $.ajax.get({
        url: url,
        dataType: "json",
        success: function (repos) {
          var repository = {}, items = repos.items || [];


          items.forEach(function (repo) {
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