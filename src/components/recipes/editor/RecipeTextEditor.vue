<script setup lang="ts">
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'

const model = defineModel()
const editor = useEditor({
  extensions: [StarterKit, Highlight, Typography],
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML()
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl border border-border bg-background rounded-md p-4'
    }
  }
})
</script>

<template>
  <editor-content :editor="editor" />
</template>
