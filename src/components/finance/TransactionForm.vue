<script setup>
import { computed, onMounted, ref } from 'vue'
import MoneyInput from 'src/components/finance/inputs/MoneyInput.vue'
import TimestampInput from './inputs/TimestampInput.vue'
import { useRtdb } from 'src/composables/rtdb'

const emit = defineEmits(['update:form'])
const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const moneyInput = ref(null)

const { categories, users } = useRtdb()
const categoryOptions = computed(() => categories.value ? Object.entries(categories.value).map(([k, v]) => k) : [])
const userOptions = computed(() => users.value ? Object.entries(users.value).map(([id, user]) => ({ label: user.name, value: id })) : [])

const formDefault = ref({})
const setDefault = (val) => {
  formDefault.value = val
}
const reset = () => {
  emit('update:form', { ...formDefault.value })
}

onMounted(() => {
  formDefault.value = { ...props.form }
})

defineExpose({ reset, setDefault })
</script>

<template>
  <timestamp-input
    filled
    label="Date"
    :timestamp="form.timestamp"
    @update:timestamp="val => emit('update:form', {...form, timestamp: val})"
  />

  <q-input
    filled
    label="Label"
    :model-value="form.name"
    @update:model-value="val => emit('update:form', {...form, name: val})"
    required
  >
    <template #prepend>
      <q-icon name="mdi-label"/>
    </template>
  </q-input>

  <q-select
    filled
    label="Category"
    required
    :model-value="form.category"
    :loading="categories === undefined"
    :options="categoryOptions"
    @update:model-value="val => emit('update:form', {...form, category: val})"
    popup-content-class="bg-grey-3"
  >
    <template #prepend><q-icon name="mdi-tag"/></template>
    <template #selected-item="{opt}">
      <div v-if="opt">
        <q-icon
          class="q-mr-sm"
          :color="(categories !== undefined) ? categories[opt].color : 'grey-5'"
          :name="(categories !== undefined) ? categories[opt].icon : 'mdi-question'"
        />
        <span class="text-capitalize">{{ opt }}</span>
      </div>
    </template>
    <template #option="{opt}">
      <q-item
        clickable
        :active="form.category === opt"
        @click="emit('update:form', {...form, category: opt})"
        v-close-popup
      >
        <q-item-section avatar>
          <q-icon
            :color="(categories !== undefined) ? categories[opt].color : 'grey-5'"
            :name="(categories !== undefined) ? categories[opt].icon : 'mdi-question'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize">{{ opt }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>

  <MoneyInput
    filled
    ref="moneyInput"
    label="Amount"
    :amount="form.amount"
    :credit="form.category === 'income'"
    @update:amount="val => emit('update:form', {...form, amount: val})"
  >
  </MoneyInput>

  <q-select
    filled
    required
    label="User"
    :loading="users === undefined"
    emit-value
    map-options
    :options="userOptions"
    :model-value="form.paid_by"
    @update:model-value="val => emit('update:form', {...form, paid_by: val})"
    popup-content-class="bg-grey-3"
  >
    <template #prepend>
      <q-icon name="mdi-account"/>
    </template>
  </q-select>

  <q-input
    filled
    type="textarea"
    label="Notes"
    :model-value="form.notes"
    @update:model-value="val => emit('update:form', {...form, notes: val})"
  >
    <template #prepend>
      <q-icon name="mdi-note"/>
    </template>
  </q-input>
</template>
