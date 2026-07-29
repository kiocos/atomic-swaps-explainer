<script setup lang="ts">
import { computed } from 'vue'

/**
 * A QR-shaped placeholder for the funding address slide.
 *
 * NOT a real QR code — it encodes nothing and will not scan. It exists so the
 * slide looks like the app without putting a scannable address on a projector.
 * The address shown alongside it is invented too (it contains "example").
 *
 * Deterministic: a small LCG rather than Math.random, which Slidev scripts
 * cannot use and which would reshuffle the pattern on every render anyway.
 */
const props = withDefaults(
  defineProps<{ size?: number; modules?: number; logo?: 'bitcoin' | 'liquid' | null }>(),
  { size: 168, modules: 25, logo: null },
)

/** 7x7 finder squares sit in three corners of a real QR; mimic that. */
const isFinder = (r: number, c: number, n: number) => {
  const inBox = (br: number, bc: number) =>
    r >= br && r < br + 7 && c >= bc && c < bc + 7
  return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0)
}

const finderOn = (r: number, c: number, n: number) => {
  const rel = (br: number, bc: number) => [r - br, c - bc]
  let x = -1, y = -1
  if (r < 7 && c < 7) [x, y] = rel(0, 0)
  else if (r < 7 && c >= n - 7) [x, y] = rel(0, n - 7)
  else [x, y] = rel(n - 7, 0)
  const ring = Math.max(Math.abs(x - 3), Math.abs(y - 3))
  return ring === 3 || ring <= 1
}

const cells = computed(() => {
  const n = props.modules
  let seed = 20260728
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const out: { r: number; c: number }[] = []
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const on = isFinder(r, c, n) ? finderOn(r, c, n) : rand() > 0.52
      if (on) out.push({ r, c })
    }
  }
  return out
})
</script>

<template>
  <div class="relative rounded-xl bg-white p-2.5 select-none">
    <svg :width="size" :height="size" :viewBox="`0 0 ${modules} ${modules}`" shape-rendering="crispEdges">
      <rect :width="modules" :height="modules" fill="#fff" />
      <rect v-for="(m, i) in cells" :key="i" :x="m.c" :y="m.r" width="1" height="1" fill="#09141f" />
    </svg>
    <!-- the app overlays the asset mark in the middle of the code -->
    <div v-if="logo" class="absolute inset-0 grid place-items-center">
      <div class="grid place-items-center rounded-full bg-white" :style="{ padding: `${size * 0.03}px` }">
        <ChainIcon :chain="logo" :size="Math.round(size * 0.2)" />
      </div>
    </div>
  </div>
</template>
