<script setup>
import SlideShell from './SlideShell.vue'
import CodeBlock from './CodeBlock.vue'

// Slide « concept » réutilisable : explication à gauche, code à droite.
defineProps({
  index: { type: Number, required: true },
  concept: { type: Object, required: true },
})
</script>

<template>
  <SlideShell :index="index" :wm="concept.wm">
    <div class="kicker">{{ concept.kicker }}</div>
    <h2 v-html="concept.titleHtml" />
    <div class="split">
      <div>
        <ul class="clean tight">
          <li v-for="(b, i) in concept.bullets" :key="i">
            <span class="ic">{{ b.ic }}</span>
            <span v-html="b.html" />
          </li>
        </ul>
      </div>
      <CodeBlock :file="concept.file" :lang="concept.lang" :code="concept.code" />
    </div>
  </SlideShell>
</template>
