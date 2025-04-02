<script setup lang="ts">
import { User, LogIn } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/composables/auth'

const router = useRouter()

const { logout, authorized, user } = useAuth()
const onLogOut = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <template v-if="!authorized">
    <Button variant="ghost" size="icon" @click="router.push('/login')">
      <LogIn />
    </Button>
  </template>
  <template v-else>
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon">
          <User />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="mx-8 border-none">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <Avatar size="base">
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div>
              <div>
                {{ user?.name }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ user?.email }}
              </div>
            </div>
          </div>
          <div class="flex justify-center">
            <Button variant="destructive" size="sm" @click="onLogOut">Log out</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </template>
</template>
