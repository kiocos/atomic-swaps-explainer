<script setup lang="ts">
/**
 * The slide title *is* the progress indicator through the acronym: the whole
 * expansion stays on screen, and the part the slide is about is lit up.
 *
 * "Lock" is lit on every slide, alongside whichever of Hash or Time is active.
 * The thing being taught is never the bare word — it is "hash lock" or "time
 * lock", two-word terms — so lighting only the first word named half of it. With
 * Time dimmed between them, "Hash … Lock" still reads as one term.
 *
 * Renders a real <h1>, so the deck's heading styles and the gold underline rule
 * in style.css both still apply. Spans carry their own right margin rather than
 * relying on whitespace between them — Vue's compiler condenses whitespace-only
 * text nodes that contain a newline, which silently welds the words together.
 */
defineProps<{ active: 'hash' | 'time' | 'lock' | 'contract' }>()

const dim = 'text-white/22'
</script>

<template>
  <h1>
    <span :class="active === 'hash' ? 'text-gold' : dim" class="mr-4">Hash</span>
    <span :class="active === 'time' ? 'text-gold' : dim" class="mr-4">Time</span>
    <span class="mr-4 text-gold">Lock</span>
    <span :class="active === 'contract' ? 'text-gold' : dim">Contract</span>
  </h1>
</template>
