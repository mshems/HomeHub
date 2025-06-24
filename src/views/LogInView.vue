<script setup lang="ts">
import { CircleAlert, LoaderCircle } from 'lucide-vue-next'
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
const pending = ref(false)
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

  pending.value = true
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
    .finally(() => {
      pending.value = false
    })
}
</script>
<template>
  <div class="container flex h-full flex-col items-center justify-center py-8">
    <Card
      v-if="error"
      class="bg-negative text-negative-foreground mb-4 flex items-center gap-2 p-4"
    >
      <CircleAlert />
      {{ error }}
    </Card>
    <Card>
      <CardHeader>
        <h1 class="font-title text-center text-3xl font-semibold">Log in</h1>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onLogin" class="flex w-full max-w-md flex-col gap-3">
          <Input placeholder="email" v-model="email" />
          <Input
            placeholder="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
          />
          <Button :disabled="pending" type="submit">
            <LoaderCircle v-if="pending" class="mr-2 h-4 w-4 animate-spin" />
            Log In
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
