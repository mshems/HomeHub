import { boot } from 'quasar/wrappers'

import { getDatabase } from 'firebase/database'
import { initializeApp } from 'firebase/app'
import { VueFire } from 'vuefire'

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
const db = getDatabase(firebaseApp)

export default boot(({ app }) => {
  app.use(VueFire, {
    firebaseApp
  })
})

export { firebaseApp, db }
