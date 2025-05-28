<script setup lang="ts">
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent, type Content } from '@tiptap/vue-3'
import { watch } from 'vue'

const props = defineProps<{ readonly?: boolean }>()
const model = defineModel<string>()
const editor = useEditor({
  extensions: [StarterKit, Highlight, Typography],
  editable: !props.readonly,
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML()
  },
  editorProps: {
    attributes: {
      class: `${!props.readonly ? 'border-2 border-border bg-input' : ''} content rounded-md font-sans p-4 max-w-full text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
    }
  },
  content: model.value
})

watch(
  () => model.value,
  (newValue) => {
    if (editor && editor.value?.getHTML() !== newValue) {
      editor?.value?.commands.setContent(newValue as Content)
    }
  },
  { immediate: true }
)
</script>

<template>
  <editor-content :editor="editor" class="max-w-full!" />
</template>

<style lang="scss">
.content {
  font-family: 'Inter', sans-serif;

  p {
    line-height: 1.75rem;
  }

  h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
    font-weight: 600;
  }
  h2 {
    font-size: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  h3 {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  h4 {
    font-size: 1rem;
  }
  h5 {
    font-size: 0.875rem;
  }
  h6 {
    font-size: 0.875rem;
  }
  li {
    margin-block: 0.3rem;
  }
  li p {
    padding-left: 1ch;
  }
  ul {
    list-style: disc;
    margin-left: 2ch;
  }
  ol {
    list-style: decimal;
    margin-left: 2ch;
  }
}

.ProseMirror:focus {
  outline: none;
}
</style>
