<script setup>
import NavHeader from '../NavHeader.vue'
import NavChip from 'src/components/NavChip.vue'
</script>

<template>
  <nav-header>
    <template #default>
      <nav-chip path="/finance" icon="mdi-piggy-bank" label="Finance"/>
      <slot></slot>
    </template>
    <template #buttons>
      <q-btn round size="md" dense flat color="primary" icon="mdi-home" :to="'/'"/>
    </template>
  </nav-header>
</template>
