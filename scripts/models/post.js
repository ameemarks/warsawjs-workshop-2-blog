(function (root) {
    'use strict';

    const assert = root.blog.utils.assert;  //importujemy z utils.js

    class PostModel {
        constructor (data) {

            //dobrze, żeby w modelu były nie tylko dane, ale i walidacja, dlatego asercja
            assert(typeof data.id === 'number'); //asercja, wykorzystywana w testach jedn.; pierwszym argumentem musi by prawada, jeśli tak jest, to nic się nie dzieje
            //jeśli dane są niezgodne z modelem, który założyliśmy, to ma wywalić błąd, obsłużyć wyjatek
            assert(typeof data.title === 'string');
            assert(typeof data.body === 'string');

            this.id = data.id;  //pola, które będzie miał obiekt utworzony z tego constructora
            this.title = data.title;
            this.body = data.body;
        }
    }

    root.blog.models.Post = PostModel;

}(window));