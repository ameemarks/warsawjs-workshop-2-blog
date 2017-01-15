/**
 * Created by ania on 1/15/17.
 */

//IIFE w ES6 jest robione samoistnie pod spodem, przez import/export
//
(function (root) {
    'use strict';

    const rootUrl = '/';
    const useHash = false;

    root.blog = {
        runtime: new EventEmitter(),
        controllers: {},
        models: {},
        services: {},
        adapters: {},
        router: new Navigo(rootUrl, useHash),
        views: {},
        utils: {}
    };
}(window));

//window.blog.runtime - dostęp do komunikatów

