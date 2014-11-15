let localDB = (() => {
    let db,
        state = 'close',
        containsData = false,
        items;

    let _isOpen = () => {
        if (state === 'open') {
            return true;
        }
        else {
            return false;
        }
    }

    let _init = () => {

        return new Promise((resolve, reject) => {
            if (window.indexedDB) {
                let request = window.indexedDB.open("github", 3);

                request.onerror = (event) => {
                    console.log('Error when open IndexedDB.');
                    state = 'close';

                    reject('Error when open IndexedDB.');
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    state = 'open';

                    _count().then((count) => {
                        if (count === 0) {
                            containsData = false;
                            resolve();
                        }
                        else {
                            containsData = true;
                            _getAll().then((_items) => {
                                items = _items;
                                resolve();
                            });
                        }
                    });
                };

                request.onupgradeneeded = (event) => {
                    let newVersion = event.target.result;

                    if (!newVersion.objectStoreNames.contains('repositories')) {
                        newVersion.createObjectStore('repositories', { keyPath: 'id' });
                    }

                    resolve();
                };
            }
        });
    };

    let _insert = (repository) => {
        let now = new Date(),
            transaction = db.transaction(['repositories'], 'readwrite'),
            store = transaction.objectStore('repositories'),
            request;

        repository.inserted_at = now.toISOString();
        repository.changed_at = now.toISOString();

        request = store.add(repository);

        request.onsuccess = (event) => {
            //console.log('Repository "' + repository.name + '" added in local database.');
        };

        request.onerror = (event) => {
            //console.log('Error when added repository "' + repository.name + '" in local database.');
        };
    };

    let _remove = function (repository) {
        let transaction = db.transaction(['repositories'], 'readwrite'),
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

    let _count = () => {
        let transaction = db.transaction(['repositories']),
            store = transaction.objectStore('repositories'),
            count = store.count();

        return new Promise((resolve, reject) => {
            count.onsuccess = (event) => {
                resolve(count.result);
            };

            count.onerror = (event) => {
                resolve(0);
            };
        });
    };

    let _hasData = () => {
        return containsData;
    };

    let _getAll = (repository) => {
        let transaction = db.transaction(['repositories']),
            store = transaction.objectStore('repositories'),
            _items = [];

        return new Promise((resolve, reject) => {
            store.openCursor().onsuccess = (event) => {
                let item = event.target.result;
                if (item) {
                    _items.push(item.value);
                    item.continue();
                }
                else {
                    resolve(_items);
                }
            };
        });
    };

    let _getItems = () => {
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