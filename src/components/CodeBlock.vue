<script setup>
import { computed } from 'vue'
import { highlight } from '../utils/highlight'

const props = defineProps({
  file: { type: String, required: true },
  lang: { type: String, default: 'js' },
  code: { type: String, required: true },
})

const html = computed(() => highlight(props.code))
</script>

<template>
  <div class="code">
    <div class="bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="file">{{ file }}</span>
      <span class="lang">{{ lang }}</span>
    </div>
    <pre><code v-html="html" /></pre>
  </div>
</template>
