<script setup>
import { computed } from 'vue'
import { useDeck } from '../composables/useDeck'

const props = defineProps({
  index: { type: Number, required: true },
  wm: { type: String, default: null },
  center: { type: Boolean, default: false },
})

const { current } = useDeck()
const active = computed(() => current.value === props.index)
</script>

<template>
  <section class="slide" :class="{ active, center }" :data-wm="wm">
    <slot />
  </section>
</template>
