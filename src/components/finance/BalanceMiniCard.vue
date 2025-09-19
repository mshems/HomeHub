<script setup lang="ts">
import { unref, type MaybeRef } from 'vue'

import { Card, CardContent } from '@/components/ui/card'
import { formatBalance } from '@/lib/balance'
import { cn } from '@/lib/utils'
import { useBalanceVariants } from '@/lib/variants'

defineProps<{
  balance: MaybeRef<number>
}>()
</script>

<template>
  <Card :class="cn(useBalanceVariants({ amount: unref(balance), text: true, bg: true }))">
    <CardContent class="flex flex-row items-center gap-3 px-5 py-3">
      <slot></slot>
      <div class="text-right font-medium">{{ formatBalance(unref(balance), true) }}</div>
    </CardContent>
  </Card>
</template>
