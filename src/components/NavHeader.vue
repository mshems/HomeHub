<script setup>
import { useQuasar } from 'quasar'

import { useSettingsStore } from 'src/stores/settings'
import { useUserStore } from 'src/stores/user'

const $q = useQuasar()
const user = useUserStore()
const settings = useSettingsStore()
</script>

<template>
  <q-toolbar class="q-px-sm">
    <q-toolbar-title class="title row items-center">
      <slot />
    </q-toolbar-title>
    <div class="row items-center no-wrap q-gutter-xs">
      <slot name="buttons" />
      <q-btn
        size="md"
        dense
        flat
        color="muted"
        icon="mdi-compare"
        @click="$q.dark.toggle()"
      />
      <q-btn
        size="md"
        dense
        flat
        color="muted"
        icon="mdi-cog"
        @click="settings.showMenu = true"
      />
    </div>
  </q-toolbar>
  <q-banner
    avatar="mdi-alert"
    rounded
    class="bg-red-5 q-mx-sm"
    v-if="!user.authorized"
  >
    <template #avatar>
      <q-icon
        name="mdi-alert-rhombus"
        color="white"
      />
    </template>
    <div class="text-bold text-white">
      Log in to view
    </div>
  </q-banner>
</template>
