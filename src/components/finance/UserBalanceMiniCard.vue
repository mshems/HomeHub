<script setup lang="ts">
import BalanceMiniCard from './BalanceMiniCard.vue'
import { unref, type MaybeRef } from 'vue'

import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import type { IUser } from '@/lib/models'

defineProps<{
  balance: MaybeRef<number>
  user: MaybeRef<IUser>
}>()
</script>
<template>
  <BalanceMiniCard :balance="balance">
    <Avatar size="sm" class="bg-primary">
      <AvatarFallback class="font-title text-primary-foreground font-semibold">{{
        unref(user).name[0]
      }}</AvatarFallback>
    </Avatar>
  </BalanceMiniCard>
</template>
