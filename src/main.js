// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import VueResource from 'vue-resource'
import Buefy from 'buefy'

Vue.use(VueResource)
Vue.use(Buefy)

import 'buefy/lib/buefy.css'

Vue.http.options.emulateJSON = true;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  data: () => {
    return {
      session: {}
    }
  },
  computed: {
    hasSession() {
      return typeof this.session.token !== 'undefined';
    }
  },
  methods: {
    registerSession(session) {
      this.session = session;

      Vue.http.interceptors.push((request, next) => {
        console.log('Interceptor added', session.token);
        request.headers.set('Authorization', 'Bearer ' + session.token);
        next();
      });
    }
  }
})
