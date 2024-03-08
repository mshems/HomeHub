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
          error.value = 'Could not log in. Please try again'
      }
    })
}

</script>
<template>
  <q-page padding class="column items-center justify-center">
    <q-card>
      <q-form @submit.prevent="login">
        <q-card-section class="text-center">
          <div style="font-size: 2rem;" class="q-py-sm q-my-none title row no-wrap items-center justify-center q-gutter-sm">
            <q-icon name="mdi-home-analytics"/>
            <q-icon name="mdi-pot-steam"/>
            <q-icon name="mdi-piggy-bank"/>
          </div>
          <q-banner v-if="error" rounded class="q-mt-md text-white bg-negative">
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
          <q-btn unelevated class="col" label="Log In" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
    <q-btn flat label="Cancel" color="primary" @click="router.push('/')" class="q-mt-sm"/>
  </q-page>
</template>
