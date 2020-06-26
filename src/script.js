import Vue from 'vue';

import App from "./App.vue";
let nodes = document.querySelectorAll('.js-vue');
for (let node of nodes) {
    new Vue({
        el: node,
        components: {
            'ssr-demo-app': App,
        },
    });
}