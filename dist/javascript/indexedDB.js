define(["exports"], function (exports) {
  "use strict";

  var localDB = (function () {
    var db, state = "close", containsData = false, items;

    var _isOpen = function () {
      if (state === "open") {
        return true;
      } else {
        return false;
      }
    };

    var _init = function () {
      return new Promise(function (resolve, reject) {
        if (window.indexedDB) {
          (function () {
            var request = window.indexedDB.open("github", 3);

            request.onerror = function (event) {
              console.log("Error when open IndexedDB.");
              state = "close";

              reject("Error when open IndexedDB.");
            };

            request.onsuccess = function (event) {
              db = event.target.result;
              state = "open";

              _count().then(function (count) {
                if (count === 0) {
                  containsData = false;
                  resolve();
                } else {
                  containsData = true;
                  _getAll().then(function (_items) {
                    items = _items;
                    resolve();
                  });
                }
              });
            };

            request.onupgradeneeded = function (event) {
              var newVersion = event.target.result;

              if (!newVersion.objectStoreNames.contains("repositories")) {
                newVersion.createObjectStore("repositories", { keyPath: "id" });
              }

              resolve();
            };
          })();
        }
      });
    };

    var _insert = function (repository) {
      var now = new Date(), transaction = db.transaction(["repositories"], "readwrite"), store = transaction.objectStore("repositories"), request;

      repository.inserted_at = now.toISOString();
      repository.changed_at = now.toISOString();

      request = store.add(repository);

      request.onsuccess = function (event) {};

      request.onerror = function (event) {};
    };

    var _remove = function (repository) {
      var transaction = db.transaction(["repositories"], "readwrite"), store = transaction.objectStore("repositories"), request;

      request = store.delete(repository.id);

      request.onsuccess = function (event) {};

      request.onerror = function (event) {};
    };

    var _count = function () {
      var transaction = db.transaction(["repositories"]), store = transaction.objectStore("repositories"), count = store.count();

      return new Promise(function (resolve, reject) {
        count.onsuccess = function (event) {
          resolve(count.result);
        };

        count.onerror = function (event) {
          resolve(0);
        };
      });
    };

    var _hasData = function () {
      return containsData;
    };

    var _getAll = function (repository) {
      var transaction = db.transaction(["repositories"]), store = transaction.objectStore("repositories"), _items = [];

      return new Promise(function (resolve, reject) {
        store.openCursor().onsuccess = function (event) {
          var item = event.target.result;
          if (item) {
            _items.push(item.value);
            item.continue();
          } else {
            resolve(_items);
          }
        };
      });
    };

    var _getItems = function () {
      return items;
    };

    return {
      init: _init,
      isOpen: _isOpen,
      insert: _insert,
      remove: _remove,
      hasData: _hasData,
      getItems: _getItems
    };
  })();

  exports.default = localDB;
});