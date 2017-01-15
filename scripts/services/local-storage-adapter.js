(function (root) {
    'use strict';

    let post_key = 'posts';

    class LocalStorageAdapter {
        constructor(key) {
            post_key = key;
        }

        createOne(data, callback) {

        }

        readAll(callback) {
            fetchLocalStorage(callback); //pobiera wszystkie posty
        }

        readOneById(id, callback) {

        }

        updateOne(data, callback) {

        }

        deleteOne(data, callback) {

        }
    }

    function fetchLocalStorage(callback) {
        try {
            let posts = root.localStorage.getItem(post_key); //pobiera klucz z localStorage
            callback(null, posts); //najpierw błąd - nie ma błędu, potem sukces
        }
        catch(err){
            callback(err);
        }
    }

    function fetchLocalStoragePromise() {
        return new Promise ((resolve, reject) => {
                try {
                    let posts = root.localStorage.getItem(post_key);
                    resolve(posts);
                }
                catch(err){
                    reject(err);
                }
            })
    }

    function saveLocalStorage(data, callback) {
        try {
            root.localStorage.setItem(post_key, JSON.stringify(data)); //serializacja do json: data to tablica js, która jest zamieniana na obiekt
            callback(null, data);
        }
        catch(err) {
            callback(err);
        }
    }

    function createOneInLocalStorage (data, callback) { //umieści pojedynczego posta w local storage
        fetchLocalStorage((err, posts) => { //pobieram wsystkie posty, funkcja callbackowa z parametrami err i posts
            if (err) {
                callback(err); //spropagowane wyżej, do tego, kto wywołał callback
                return;
            }

            let newData;

            //tworzenie nowego posta w localStorage
            try {
                const id = posts.map(v => v.id).sort().pop() + 1;  //uzyskujemy najwyższe id obiektu w tablicy obiektów
                //data.id = id;
                newData = Object.assign(data, { id }); //kopiuję properties z obiekty data i dorzucam id
                posts.push(newData);
            }
            catch (err){
                callback(err);
                return;
            }

            saveLocalStorage(posts, (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, newData);
            })
        });
    }

    root.blog.adapters.LocalStorageAdapter = LocalStorageAdapter;
}(window));