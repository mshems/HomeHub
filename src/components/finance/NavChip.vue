<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({
  path: String,
  label: String,
  icon: String,
  color: {
    type: String,
    default: 'primary'
  }
})

const route = useRoute()
const router = useRouter()
const routeParts = computed(() => route.path.split('/'))
const pathParts = computed(() => props.path.split('/'))
const match = computed(() => {
  return route.path.startsWith(props.path) && !(routeParts.value.length > (pathParts.value.length + 1))
})

</script>

<template>
  <q-btn
    dense
    rounded
    class="q-ma-none q-mr-xs text-bold text-center q-px-sm text-on-color"
    :icon="icon"
    :color="color"
    no-caps
    size="sm"
    :label="match ? label : ''"
    @click="router.push(path)"
    style="font-size: 0.75rem;"
  />
</template>
<style>
</style>
