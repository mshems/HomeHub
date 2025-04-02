<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

defineProps({
  page: {
    type: String,
    required: true
  },
  items: {
    type: Object,
    required: true
  },
  noDashboard: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <Breadcrumb class="font-title font-medium">
    <BreadcrumbList>
      <template v-if="!noDashboard">
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <RouterLink to="/"> Dashboard </RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </template>
      <template v-for="[k, v] in Object.entries(items)" :key="k">
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <RouterLink :to="v"> {{ k }} </RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </template>
      <BreadcrumbItem>
        <BreadcrumbPage>{{ page }}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
