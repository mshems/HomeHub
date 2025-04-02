import App from './App.vue'
import './assets/main.css'
import router from './router'
import { initializeApp } from 'firebase/app'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'

const firebaseConfig = {
  apiKey: 'AIzaSyABgoAbmQ4jtBjz-ggA9be-YSbNKmsqmao',
  authDomain: 'homebase-c96a6.firebaseapp.com',
  projectId: 'homebase-c96a6',
  storageBucket: 'homebase-c96a6.appspot.com',
  messagingSenderId: '723510981377',
  appId: '1:723510981377:web:c3fa0ef320ee7aeb202100',
  databaseURL: 'https://homebase-c96a6-default-rtdb.firebaseio.com'
}

const firebaseApp = initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()]
})
app.mount('#app')
