import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import toastr from 'toastr'
import Croppa from 'vue-croppa'
import moment from 'moment'

Vue.use(Croppa)

import './assets/style.css'

axios.defaults.headers.common['authorization'] = 'bearer ' + localStorage.getItem('access_token')

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  
  if (error.response.status == 401) {
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('locationSearch')
    localStorage.removeItem('dependenceSearch')
    localStorage.removeItem('responsibleSearch')
    localStorage.removeItem('permissions')
    router.push({ name: 'login' })
  }

  if (error.response.status == 403) {
    toastr.error('No tiene permisos para esta acción')
    //router.push({ name: 'dashboard.index' })
  }

  if (error.response.status == 404) {
    toastr.error('No se encontraron coincidencias')
    //router.push({ name: 'dashboard.index' })
  }

  return Promise.reject(error);
});

let production = false

if (production) {
  axios.defaults.baseURL = 'api'
  Vue.prototype.$serverFiles = ''
} else {
  axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
  Vue.prototype.$serverFiles = 'http://localhost:8000'
}

require('toastr/build/toastr.min.css')

moment.locale('es')

Vue.prototype.$http = axios
Vue.prototype.$toastr = toastr
Vue.prototype.$moment = moment

Vue.component('pagination', require('laravel-vue-pagination'));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
