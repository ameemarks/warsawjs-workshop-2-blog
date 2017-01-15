(function (root) {
    'use strict';

    let runtime = root.blog.runtime;
    let removeHTMLTags = root.blog.utils.removeHTMLTags;

    class AddPostFormView {
        constructor() {
            this.$addButton = document.querySelector('#js-display-form-add-post');
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

        toggleDisplayForm() {
            this.$addPostForm.classList.toggle('hide');
            this.loadDataToForm({ id: '', title: '', body: '' });
            this.clearUrlHash();
        }

        getFormData() {
            let title = removeHTMLTags(this.$title.value);
            let body = removeHTMLTags(this.$body.value);
            let id = Number(this.$id.value);

            return { id, title, body };
        }

        loadDataToForm(post) {
            this.$title.value = post.title;
            this.$body.value = post.body;
            this.$id.value = post.id;
            if(post.id) {
                this.$addPostForm.classList.remove('hide');
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
            evt.preventDefault();

            const formData = this.getFormData();

            if(formData.id) {
                runtime.emit('edit-post', formData);
            } else {
                runtime.emit('new-post', formData);
            }

            this.toggleDisplayForm();
            this.clearInputs();
            this.clearUrlHash();
        }

        onDelete() {
            const formData = this.getFormData();
            runtime.emit('delete-post', formData);
            this.toggleDisplayForm();
            this.clearInputs();
            this.clearUrlHash();
        }

        clearInputs() {
            this.$title.value = this.$body.value = '';
        }

        clearUrlHash() {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    }

    root.blog.views.AddPostFormView = AddPostFormView;
}(window));
