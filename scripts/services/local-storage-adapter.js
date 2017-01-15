//(function (root) {
//    'use strict';
//
//    let post_key = 'posts';
//
//    class LocalStorageAdapter {
//        constructor(key) {
//            post_key = key;
//        }
//
//        createOne(data, callback) {
//
//        }
//
//        readAll(callback) {
//            fetchLocalStorage(callback); //pobiera wszystkie posty
//        }
//
//        readOneById(id, callback) {
//
//        }
//
//        updateOne(data, callback) {
//
//        }
//
//        deleteOne(data, callback) {
//
//        }
//    }
//
//    function fetchLocalStorage(callback) {
//        try {
//            let posts = root.localStorage.getItem(post_key || []); //pobiera klucz z localStorage
//            callback(null, posts); //najpierw błąd - nie ma błędu, potem sukces
//        }
//        catch(err){
//            callback(err);
//        }
//    }
//
//    function fetchLocalStoragePromise() {
//        return new Promise ((resolve, reject) => {
//                try {
//                    let posts = root.localStorage.getItem(post_key);
//                    resolve(posts);
//                }
//                catch(err){
//                    reject(err);
//                }
//            })
//    }
//
//    function saveLocalStorage(data, callback) {
//        try {
//            root.localStorage.setItem(post_key, JSON.stringify(data)); //serializacja do json: data to tablica js, która jest zamieniana na obiekt
//            callback(null, data);
//        }
//        catch(err) {
//            callback(err);
//        }
//    }
//
//    function createOneInLocalStorage (data, callback) { //umieści pojedynczego posta w local storage
//        fetchLocalStorage((err, posts) => { //pobieram wsystkie posty, funkcja callbackowa z parametrami err i posts
//            if (err) {
//                callback(err); //spropagowane wyżej, do tego, kto wywołał callback
//                return;
//            }
//
//            let newData;
//
//            //tworzenie nowego posta w localStorage
//            try {
//                const id = posts.map(v => v.id).sort().pop() + 1;  //uzyskujemy najwyższe id obiektu w tablicy obiektów
//                //data.id = id;
//                newData = Object.assign(data, { id }); //kopiuję properties z obiekty data i dorzucam id
//                posts.push(newData);
//            }
//            catch (err){
//                callback(err);
//                return;
//            }
//
//            saveLocalStorage(posts, (err) => {
//                if (err) {
//                    callback(err);
//                    return;
//                }
//
//                callback(null, newData);
//            })
//        });
//    }
//
//    root.blog.adapters.LocalStorageAdapter = LocalStorageAdapter;
//}(window));

(function (root) {
    'use strict';

    // Jeśli będziemy wykorzystać REST API to ta funkcja się przyda.
    // let makeRequest = root.blog.utils.makeRequest;

    let randomInteger = root.blog.utils.randomInteger;
    let instanceCnt = 0;
    let POST_KEY = 'posts';

    class LocalStorageAdapter {
        constructor(key) {
            // check if one instance becouse of usage closure
            instanceCnt++;
            if(instanceCnt > 1) {
                throw new Error('Only one instance of LocalStorageAdapter is allowed!');
            }
            POST_KEY = key;
        }

        createOne(data, callback) {
            createOneInLocalStorage(data, callback);
        }

        readAll(callback) { //pobiera wszystkie posty
            fetchLocalStorage(callback);
        }

        readOneById(id, callback) {
            readOneByIdFromLocalStorage(id, callback);
        }

        updateOne(data, callback) {
            updateOneInLocalStorage(data, callback);
        }

        deleteOne(data, callback) {
            deleteOneFromLocalStorage(data, callback);
        }
    }

    // dostęp do localStorage jest synchroniczny ale API fetch i save
    // celowo zostało oparte na callback w celach edukacyjnych

    function fetchLocalStorage(callback) {
        try {
            let posts = root.localStorage.getItem(POST_KEY);    //pobiera klucz z localStorage
            posts = JSON.parse(posts);
            callback(null, posts || []);     //najpierw błąd - nie ma błędu, potem sukces
        } catch (err) {
            callback(err);
        }
    }

    function saveLocalStorage(data, callback) {
        try {
            root.localStorage.setItem(POST_KEY, JSON.stringify(data));  //serializacja do json: data to tablica js, która jest zamieniana na obiekt
            callback(null, data);
        } catch(err) {
            callback(err);
        }
    }

    function createOneInLocalStorage(data, callback) {  //umieści pojedynczego posta w local storage
        fetchLocalStorage((err, posts) => { //pobieram wsystkie posty, funkcja callbackowa z parametrami err i posts
            if(err) {
                callback(err);      //spropagowane wyżej, do tego, kto wywołał callback
                return;
            }

            let newData;

            //tworzenie nowego posta w localStorage
            try {
                const id = randomInteger(posts.map(v => v.id));     //uzyskujemy najwyższe id obiektu w tablicy obiektów
//                //data.id = id;
                newData = Object.assign(data, { id });
                posts.push(newData);
            } catch(err) {
                callback(err);
                return;
            }

            saveLocalStorage(posts, (err) => {
                if(err) {
                    callback(err);
                    return;
                }
                callback(null, newData);
            });
        });
    }

    function readOneByIdFromLocalStorage(id, callback) {
        fetchLocalStorage((err, posts) => {
            if(err) {
                callback(err);
                return;
            }
            const post = posts.find(v => v.id === id);
            if(post) {
                callback(null, post);
                return;
            }
            callback(new Error(`Nie znaleziono posta o id = ${id}`));
        });
    }

    function updateOneInLocalStorage(data, callback) {
        if(!data || !data.id) {
            callback(new Error('Brak id posta!'));
            return;
        }

        fetchLocalStorage((err, posts) => {
            if(err) {
                callback(err);
                return;
            }
            const idx = posts.findIndex(v => v.id === data.id);
            if(idx > -1) {
                posts[idx] = data;

                saveLocalStorage(posts, (err) => {
                    if(err) {
                        callback(err);
                        return;
                    }
                    callback(null, data);
                });
            } else {
                callback(new Error(`Nie znaleziono posta o id = ${data.id}`));
            }
        });
    }

    function deleteOneFromLocalStorage(data, callback) {
        if(!data || !data.id) {
            callback(new Error('Brak id posta!'));
            return;
        }

        fetchLocalStorage((err, posts) => {
            if(err) {
                callback(err);
                return;
            }
            const newPosts = posts.filter(v => v.id !== data.id);

            if(posts.length === newPosts.length + 1) {
                saveLocalStorage(newPosts, (err) => {
                    if(err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
            } else {
                callback(new Error(`Nie usunięto posta o id = ${data.id}`));
            }
        });
    }

    root.blog.adapters.LocalStorageAdapter = LocalStorageAdapter;
}(window));
