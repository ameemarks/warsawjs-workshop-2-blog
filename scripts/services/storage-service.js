(function (root) {
    'use strict';

    class StorageService {
        constructor(key) {
            this.key = key;
        }

        setAdapter(adapter) {
            this._adapter = new adapter(this.key);
        }

        createOne(data, callback) {
            this._adapter.createOne(data, callback);
        }

        readAll(callback) {
            this._adapter.readAll(callback);
        }

        readOneById(id, callback) {
            this._adapter.readOneById(id, callback);
        }

        updateOne(data, callback) {
            this._adapter.updateOne(data, callback);
        }

        deleteOne(data, callback) {
            this._adapter.deleteOne(data, callback);
        }
    }

    root.blog.services.StorageService = StorageService;
}(window));