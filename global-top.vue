<script setup lang="ts">
import { useNav } from '@slidev/client'

// Hidden on two kinds of slide:
//   cover   — it already carries the full circle logo in the middle
//   section — the chapter dividers are deliberately bare
const { currentLayout } = useNav()
</script>

<template>
  <div v-if="currentLayout !== 'cover' && currentLayout !== 'section'" class="slidev-global-logo">
    <img src="/brand/boltz-logo.svg" alt="Boltz">
  </div>
</template>

<style>
/*
  Rendered above every content slide. pointer-events-none so it can never swallow
  a click on the slide beneath.

  Top-right, roughly on the title's baseline: the bottom of the slide is occupied
  on the canvas-heavy slides (Part 3 runs the full height), and bottom-left is
  Slidev's own nav bar and page counter. Top-right is free on every slide.
*/
.slidev-global-logo {
  position: absolute;
  top: 2.9rem;
  right: 3.4rem;
  z-index: 20;
  pointer-events: none;
  user-select: none;
}
.slidev-global-logo img {
  height: 1.05rem;
  width: auto;
  opacity: 0.85;
}
</style>
