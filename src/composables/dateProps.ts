import { DateTime } from 'luxon'
import { ref, computed, watch } from 'vue'

interface DateProps {
  m: number
  y: number
}

export const useDateProps = (props: DateProps) => {
  const month = ref(props.m)
  const year = ref(props.y)
  const date = computed(() => DateTime.fromObject({ month: month.value, year: year.value }))
  watch(
    () => ({ ...props }),
    (p) => {
      month.value = p.m
      year.value = p.y
    }
  )
  return { month, year, date }
}
