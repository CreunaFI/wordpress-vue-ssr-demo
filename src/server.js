import Vue from 'vue';
import App from './App.vue';

let text = process.argv[3];
let component = process.argv[2];

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

let app = new Vue(
    {
        template: `<${component} v-bind:context="${entities.encode(text)}"></${component}>`,
        components: {
            'ssr-demo-app': App,
        },
    }
);

const renderer = require('vue-server-renderer').createRenderer();

renderer.renderToString(app).then(html => {
    console.log(html);
});