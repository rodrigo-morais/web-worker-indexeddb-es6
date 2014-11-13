var localDB = (function () {
    var db,
        state = 'close',
        containsData = false,
        items;

    var _isOpen = function () {
        if (state === 'open') {
            return true;
        }
        else {
            return false;
        }
    }

    var _init = function () {
        var deferred = Q.defer();

        if (window.indexedDB) {
            var request = window.indexedDB.open("github", 3);

            request.onerror = function (event) {
                console.log('Error when open IndexedDB.');
                state = 'close';

                deferred.resolve();
            };

            request.onsuccess = function (event) {
                db = event.target.result;
                state = 'open';

                _count().then(function (count) {
                    if (count === 0) {
                        containsData = false;
                        deferred.resolve();
                    }
                    else {
                        containsData = true;
                        _getAll().then(function (_items) {
                            items = _items;
                            deferred.resolve();
                        });
                    }
                });
            };

            request.onupgradeneeded = function (event) {
                var newVersion = event.target.result;

                if (!newVersion.objectStoreNames.contains('repositories')) {
                    newVersion.createObjectStore('repositories', { keyPath: 'id' });
                }
            };

            return deferred.promise;
        }
    };

    var _insert = function (repository) {
        var now = new Date(),
            transaction = db.transaction(['repositories'], 'readwrite'),
            store = transaction.objectStore('repositories'),
            request;

        repository.inserted_at = now.toISOString();
        repository.changed_at = now.toISOString();

        request = store.add(repository);

        request.onsuccess = function (event) {
            //console.log('Repository "' + repository.name + '" added in local database.');
        };

        request.onerror = function (event) {
            //console.log('Error when added repository "' + repository.name + '" in local database.');
        };
    };

    var _remove = function (repository) {
        var transaction = db.transaction(['repositories'], 'readwrite'),
            store = transaction.objectStore('repositories'),
            request;

        request = store.delete(repository.id);

        request.onsuccess = function (event) {
            //console.log('Repository "' + repository.name + '" removed in local database.');
        };

        request.onerror = function (event) {
            //console.log('Error when removed repository "' + repository.name + '" in local database.');
        };
    };

    var _count = function () {
        var transaction = db.transaction(['repositories']),
            store = transaction.objectStore('repositories'),
            count = store.count(),
            deferred = Q.defer();

        count.onsuccess = function (event) {
            deferred.resolve(count.result);
        };

        count.onerror = function (event) {
            deferred.resolve(0);
        };

        return deferred.promise;
    };

    var _hasData = function () {
        return containsData;
    };

    var _getAll = function (repository) {
        var transaction = db.transaction(['repositories']),
            store = transaction.objectStore('repositories'),
            deferred = Q.defer(),
            _items = [];

        store.openCursor().onsuccess = function (event) {
            var item = event.target.result;
            if (item) {
                _items.push(item.value);
                item.continue();
            }
            else {
                deferred.resolve(_items);
            }
        };

        return deferred.promise;

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

export default localDB;