<script setup>
import { FLAVORS } from '../data/flavors'
</script>

<template>
  <div class="flavors">
    <div
      v-for="f in FLAVORS"
      :key="f.name"
      class="fl"
      :style="{ '--c': f.c, '--a': f.a }"
    >
      <span class="sw" />
      <div class="ft">
        <b>{{ f.name }}</b>
        <span>{{ f.notes }}</span>
        <em>{{ f.c }}</em>
      </div>
    </div>
  </div>
</template>
