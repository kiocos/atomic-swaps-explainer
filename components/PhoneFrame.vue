<script setup lang="ts">
/**
 * A phone outline with a screen to put things in.
 *
 * Exists so the walkthrough can show the wallet half of a swap without a real
 * screenshot: a screenshot of somebody's wallet would date instantly, carry a
 * real address, and be unreadable from the back of the room. This is the same
 * shape at slide scale, and it is unmistakably *a phone*, which is the only
 * thing the audience needs to read off it.
 */
withDefaults(defineProps<{ width?: number; height?: number }>(), { width: 224, height: 400 })
</script>

<template>
  <div
    class="relative shrink-0 border-2 border-white/25 rounded-[1.6rem] bg-[#0b0b0d] p-2 shadow-[0_0_50px_rgba(0,0,0,.55)]"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <!-- speaker slot -->
    <div class="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
    <div class="h-full w-full overflow-hidden rounded-[1.1rem] pt-5">
      <slot />
    </div>
  </div>
</template>
