//(function (root) {
//    'use strict';
//
//    const STORAGE_KEY = 'posts';
//
//    let runtime = root.blog.runtime;
//    let router = root.blog.router;
//
//    let storageService = new root.blog.services.StorageService(STORAGE_KEY);
//    let LocalStorageAdapter = root.blog.adapters.LocalStorageAdapter;
//
//    let addPostFormView = new root.blog.views.AddPostFormView();
//    let postView = new root.blog.views.PostView();
//
//    let PostModel = root.blog.models.Post;
//    let PostListModel = root.blog.models.PostList;
//
//    //powyżej wyciagamy potrzebne klasy i instancje
//
//    class AppController {
//        constructor() {
//            storageService.setAdapter(LocalStorageAdapter);    //wstrzykujemy storage service do instancji serwisu
//            this.postListModel = new PostListModel();
//
//            this.renderAllPosts();
//
//            runtime.on('new-post', (formData) => {  //runtime on - zakładamy słuchacza (jeśli zostało wywołane zdarzenie przez jakikolwiek widok); w controllerze callback z danymi z inputa
//                storageService.createOne(formData, (err, post) => { //przy sukcesie zwróci post wzbogacony o id, zapisuje do LocalStorage
//                    if (err) {
//                        console.error(err);
//                        return;
//                    }
//                    this.createPost(post); //wywołanie lokalnej metody z kontrolera, post z id
//                })
//            });
//
//        }
//
//        createPost(post) {
//            let postModel = post;
//            if(!(post instanceof PostModel)) {
//                postModel = new PostModel(post);
//            }
//            this.postListModel.addPostModel(postModel); //do postlistModel (model przechowujacy liste postów) dodajemy nowy post
//            postView.render(postModel); //wywołujemy renderowanie tego posta przez widok
//        }
//
//
//        renderAllPosts() {      //implementacja metody render all post, czyli wyświetlanie wszytkich postów na starcie
//           postView.removeAll(); //usunie na widoku wszystkie posty
//            storageService.readAll((err, postList) => {     //wywołanie metody wyczytania wszytkich postów
//                if (err) {
//                    console.error(err);
//                    return;
//                }
//                postList.forEach(this.createPost, this); //dla każdego posta sczytanego ze storage wywołyjmey funkcję renderującą
//            });
//        }
//    }
//
//    root.blog.controllers.AppController = AppController;
//
//
//}(window));

(function (root) {
    'use strict';

    const STORAGE_KEY = 'posts';

    let runtime = root.blog.runtime;
    let router = root.blog.router;

    let storageService = new root.blog.services.StorageService(STORAGE_KEY);
    let addPostFormView = new root.blog.views.AddPostFormView();
    let postView = new root.blog.views.PostView();

    let PostModel = root.blog.models.Post;
    let PostListModel = root.blog.models.PostList;
    let LocalStorageAdapter = root.blog.adapters.LocalStorageAdapter;

    class AppController {
        constructor() {
            storageService.setAdapter(LocalStorageAdapter);

            this.postListModel = new PostListModel();

            this.renderAllPosts();

            runtime.on('new-post', (formData) => {
                storageService.createOne(formData, (err, post) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    this.createPost(post);
                });
            });

            runtime.on('edit-post', (formData) => {
                storageService.updateOne(formData, (err) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    this.renderAllPosts();
                });
            });

            runtime.on('delete-post', (formData) => {
                storageService.deleteOne(formData, (err) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    this.renderAllPosts();
                });
            });

            router
                .on({
                    '/posts/:id': (params) => {
                        const postModel = this.postListModel.getPostModelById(Number(params.id));
                        addPostFormView.loadDataToForm(postModel);
                    }
                })
                .resolve();
        }

        createPost(post) {
            let postModel = post;
            if(!(post instanceof PostModel)) {
                postModel = new PostModel(post);
            }
            this.postListModel.addPostModel(postModel);
            postView.render(postModel);
        }

        renderAllPosts() {
            postView.removeAll();
            storageService.readAll((err, postList) => {
                if(err) {
                    console.error(err);
                    return;
                }
                postList.forEach(this.createPost, this);
            });
        }
    }

    root.blog.controllers.AppController = AppController;
}(window));

