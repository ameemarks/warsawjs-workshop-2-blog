(function (root) {
    'use strict';

    let runtime = root.blog.runtime;        //event Emiter
    let removeHTMLTags = root.blog.utils.removeHTMLTags;        //oczyszczanie danych, które przekazuje użytkownik poprzez zabezpieczenie cross site scripting

    class AddPostFormView {
        constructor() {
            this.$addButton = document.querySelector('#js-display-form-add-post');  //z $ wprost pobrane z DOM
            this.$addPostForm = document.querySelector('#js-post-add-form');


            this.$title = this.$addPostForm.querySelector('#js-post-title');
            this.$body = this.$addPostForm.querySelector('#js-post-body');
            this.$id = this.$addPostForm.querySelector('#js-post-id');

            this.$submitBtn = this.$addPostForm.querySelector('#js-post-submit');
            this.$deleteBtn = this.$addPostForm.querySelector('#js-post-delete');
            this.$formTitle = this.$addPostForm.querySelector('h1');

            this.$addButton.addEventListener('click', this.toggleDisplayForm.bind(this));
            this.$addPostForm.addEventListener('submit', this.onSubmit.bind(this));
            this.$deleteBtn.addEventListener('click', this.onDelete.bind(this));
        }

        toggleDisplayForm() {   //metoda wywoływana po kliknięciu na button
            this.$addPostForm.classList.toggle('hide');
            this.loadDataToForm({ id: '', title: '', body: '' });
            this.clearUrlHash();
        }

        getFormData() { //metoda, która pobiera dane z formularza
            let title = removeHTMLTags(this.$title.value);  //value inputa przepuszczamy przez funckję czyszczącą z tagów html
            let body = removeHTMLTags(this.$body.value);
            let id = Number(this.$id.value);

            return { id, title, body }; //prosty obiekt z oczyszczonymi danymi
        }

        loadDataToForm(post) {
            this.$title.value = post.title;
            this.$body.value = post.body;
            this.$id.value = post.id;
            if(post.id) {   //jeśli mamy zapisane id, tzn., że post jest utworzony
                this.$addPostForm.classList.remove('hide'); //operacje na buttonie submit
                this.$deleteBtn.classList.remove('hide');
                this.$submitBtn.value = 'Zapisz post';
                this.$formTitle.innerHTML = 'Zmień post';
            } else {
                this.$submitBtn.value = 'Dodaj nowy post';
                this.$formTitle.innerHTML = 'Dodaj post';
                this.$deleteBtn.classList.add('hide');
            }
        }

        onSubmit(evt) {
            evt.preventDefault();       //nie chcemy przeładowania strony

            const formData = this.getFormData();    //zapamiętujemy wcześniej pobrane dane

            if(formData.id) {   //sprawdzamy, czy jest w trakcie edycji posta
                runtime.emit('edit-post', formData);    //generujemy customowy event (o nazwie edit post, dowolny string) i przekazujemy sczytane dane z formularza; metoda biblioteki event emiter
            } else {    //jak nie ma id, to generujemy
                runtime.emit('new-post', formData);     //obsługę tych zdarzeń robimy w controllerze, ale nie przypinamy do interface DOM
            }

            this.toggleDisplayForm();   //ukrywamy formularz
            this.clearInputs();         //czyścimy inputy
            this.clearUrlHash();        //czyścimy hash url
        }

        onDelete() {
            const formData = this.getFormData();
            runtime.emit('delete-post', formData);
            this.toggleDisplayForm();
            this.clearInputs();
            this.clearUrlHash();
        }

        clearInputs() {
            this.$title.value = this.$body.value = this.$id.value = ''; //czyszczenie inputów
        }

        clearUrlHash() {
            history.pushState("", document.title, window.location.pathname + window.location.search); //czyszczenie url z hasha
        }
    }

    root.blog.views.AddPostFormView = AddPostFormView;
}(window));
