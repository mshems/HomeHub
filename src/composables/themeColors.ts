import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface ThemeColors {
  positiveColor: Ref<string>
  negativeColor: Ref<string>
  warningColor: Ref<string>
  mutedColor: Ref<string>
  resolvedColor: Ref<string>
}

export const useThemeColors = (element: Ref<HTMLElement | null>): ThemeColors => {
  const positiveColor = ref('hsl(120 100% 25%)')
  const negativeColor = ref('hsl(0 65% 40%)')
  const warningColor = ref('hsl(47 50% 30%)')
  const mutedColor = ref('hsl(240 7% 58%)')
  const resolvedColor = ref('currentColor')

  function readThemeColors() {
    if (!element.value) return
    const styles = getComputedStyle(element.value)
    positiveColor.value =
      styles.getPropertyValue('--color-positive-typography').trim() || positiveColor.value
    negativeColor.value =
      styles.getPropertyValue('--color-negative-typography').trim() || negativeColor.value
    warningColor.value =
      styles.getPropertyValue('--color-warning-foreground').trim() || warningColor.value
    mutedColor.value =
      styles.getPropertyValue('--color-muted-foreground').trim() || mutedColor.value
    resolvedColor.value = styles.color || resolvedColor.value
  }

  let observer: MutationObserver | null = null
  onMounted(() => {
    readThemeColors()
    observer = new MutationObserver(readThemeColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  })
  onUnmounted(() => observer?.disconnect())

  return { positiveColor, negativeColor, warningColor, mutedColor, resolvedColor }
}
