<script setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'

const emit = defineEmits(['update:timestamp'])
const props = defineProps({
  timestamp: {
    type: Number,
    required: true
  }
})

const inner = computed({
  get () {
    return DateTime.fromSeconds(parseInt(props.timestamp)).toFormat('yyyy-MM-dd')
  },
  set (val) {
    emit('update:timestamp', DateTime.fromFormat(val, 'yyyy-MM-dd').toSeconds())
  }
})

</script>

<template>
  <q-input
    type="date"
    v-model="inner"
  >
    <template #prepend>
      <q-icon name="mdi-calendar" />
    </template>
  </q-input>
</template>
