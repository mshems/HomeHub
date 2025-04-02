<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import Input from '@/components/ui/input/Input.vue'
import { useAuth } from '@/composables/auth'

const router = useRouter()
const route = useRoute()

const error = ref<string | null>(null)

const email = ref('')
const errorEmail = ref(false)

const password = ref('')
const showPassword = ref(false)
const errorPassword = ref(false)

const { login } = useAuth()

const onLogin = () => {
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

  login(email.value, password.value)
    .then(() => router.push((route.query.redirect as string | undefined) || '/'))
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
  <div class="container flex h-full flex-col items-center justify-center py-8">
    <Card>
      <CardHeader>
        <h1 class="text-center font-title text-3xl font-semibold">Log in</h1>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onLogin" class="flex w-full max-w-md flex-col gap-3">
          <Input placeholder="email" v-model="email" />
          <Input
            placeholder="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
          />
          <Button type="submit">Log In</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
