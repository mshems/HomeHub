import { ref, readonly, type Ref } from 'vue'

export function useSwipeNavigation(contentEl: Ref<HTMLElement | undefined>) {
  const isAnimating = ref(false)

  const animateAndNavigate = async (direction: 'left' | 'right', navigateFn: () => void) => {
    if (isAnimating.value || !contentEl.value) return
    isAnimating.value = true

    // Add transition class
    contentEl.value.style.transition = 'transform 150ms ease-in-out'

    // Slide out current content
    contentEl.value.style.transform =
      direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)'

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Execute navigation
    navigateFn()

    // Slide in new content from opposite direction
    setTimeout(() => {
      if (!contentEl.value) return

      // Position new content off screen
      contentEl.value.style.transition = 'none'
      contentEl.value.style.transform =
        direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)'

      // Animate to center
      setTimeout(() => {
        if (!contentEl.value) return
        contentEl.value.style.transition = 'transform 150ms ease-in-out'
        contentEl.value.style.transform = 'translateX(0)'

        setTimeout(() => {
          if (contentEl.value) {
            contentEl.value.style.transition = ''
          }
          isAnimating.value = false
        }, 150)
      }, 10)
    }, 50)
  }

  return {
    isAnimating: readonly(isAnimating),
    animateAndNavigate
  }
}
