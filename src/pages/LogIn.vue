<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user'

const router = useRouter()
const user = useUserStore()
const email = ref('')
const password = ref('')

const error = ref(null)
const errorEmail = ref(false)
const errorPassword = ref(false)
const showPassword = ref(false)

const login = () => {
  error.value = null
  errorEmail.value = false
  errorPassword.value = false

  if (!email.value) {
    errorEmail.value = true
    return
  }
  if (!password.value) {
    errorPassword.value = true
    return
  }
  user.login(email.value, password.value)
    .then(() => router.push('/'))
    .catch((err) => {
      const code = err.code
      switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          error.value = 'Invalid email or password'
          break
        default:
          error.value = 'Could not log in'
      }
    })
}

</script>
<template>
  <q-page padding class="column items-center justify-center">
    <q-card>
      <q-form @submit.prevent="login">
        <q-card-section>
          <h1 style="font-size: 2rem;" class="q-my-none">Log In</h1>
          <q-separator/>
          <q-banner v-if="error" rounded class="q-mt-md text-white bg-primary">
            {{ error }}
          </q-banner>
        </q-card-section>
        <q-card-section class="q-py-none q-gutter-sm">
          <q-input
            outlined
            color="primary"
            v-model="email"
            label="Email"
            type="email"
            :error="errorEmail"
            error-message="Please enter your email"
          />
          <q-input
            outlined
            color="primary"
            v-model="password"
            label="Password"
            :type="!showPassword ? 'password' : 'text'"
            :error="errorPassword"
            error-message="Please enter your password"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="center" class="row q-px-md q-pb-md">
          <q-btn unelevated no-caps class="col" label="Sign In" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
