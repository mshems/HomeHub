<script setup lang="ts">
import Input from './Input.vue'
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <div class="relative w-full items-center">
    <Input class="pl-12" v-bind="attrs" />
    <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
      <slot />
    </span>
  </div>
</template>
