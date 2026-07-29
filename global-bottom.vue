<script setup lang="ts">
import { useNav } from '@slidev/client'

/**
 * Slide counter, bottom-right on every slide.
 *
 * `currentPage` / `total` come from the router rather than being hard-coded, so
 * inserting a slide never leaves a stale denominator behind — this deck has been
 * renumbered several times.
 *
 * To drop it from the cover, add `currentLayout !== 'cover'` to the v-if, the way
 * global-top.vue does for the logo.
 */
const { currentPage, total } = useNav()
</script>

<template>
  <div class="slidev-global-pageno">{{ currentPage }}/{{ total }}</div>
</template>

<style>
/*
  Bottom-right rather than bottom-left: Slidev's own nav bar lives bottom-left in
  presenter mode and would sit on top of it. Matched to the logo's inset in
  global-top.vue so the two corners line up, and kept dim enough not to compete
  with the slide.
*/
.slidev-global-pageno {
  position: absolute;
  right: 3.4rem;
  bottom: 2rem;
  z-index: 20;
  pointer-events: none;
  user-select: none;
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: var(--b-muted);
  opacity: 0.55;
}
</style>
