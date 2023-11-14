<script setup>
import SettingsDialog from 'src/components/SettingsDialog.vue'

import { useRouter } from 'vue-router'
import { useSettingsStore } from 'src/stores/settings'

const router = useRouter()
const settings = useSettingsStore()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar>
      <q-toolbar-title class="title">
        <div class="cursor-pointer" @click="router.push('/')">
          <q-chip icon="mdi-home" color="primary" text-color="white" class="text-bold q-ma-none" label="Home"/>
        </div>
      </q-toolbar-title>
      <div class="row items-center no-wrap q-gutter-xs">
        <template v-if="!settings.user.authorized">
          <q-btn class="gt-sm" size="md" dense flat color="primary" icon-right="mdi-login" @click="router.push('/login')" label="Log In"/>
          <q-btn class="gt-xs lt-md" dense size="md" flat color="primary" icon-right="mdi-login" @click="router.push('/login')"/>
        </template>
        <q-btn round size="md" dense flat color="primary" icon="mdi-cog" @click="settings.showMenu = true"/>
      </div>
    </q-toolbar>
    <q-page-container>
      <router-view />
      <settings-dialog v-model="settings.showMenu"/>
    </q-page-container>
  </q-layout>
</template>
