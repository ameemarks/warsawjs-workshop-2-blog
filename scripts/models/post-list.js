(function (root) {
    'use strict';

    class PostList {        //konwencja: wsystkie funkcje konstruktora, na podstawie którego tworzymy obiekty, z dużej litery;
        // obiekty tworzone z tego konstruktora z małych liter
        constructor() {
            this.posts = [];
        }
        addPostModel(postModel) {
            this.posts.push(postModel);
        }

        getPostModelById(id){   //weż posta z tablicy posts
            return this.posts.find(v => v.id === id);   //jeśli porównanie v.id === id da nam true, to zwróci element z tym id;
                                    //function (v) { return v.id === id}
        }
    }


    root.blog.models.PostList = PostList;      //eksportuję PostList do modelu

}(window));