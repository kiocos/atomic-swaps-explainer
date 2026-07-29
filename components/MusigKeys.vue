<script setup lang="ts">
import { computed } from 'vue'

/**
 * Two keys converging into one — the MuSig2 aggregation, drawn as a tree.
 *
 * The two source keys are on screen from the start and never move; the branches
 * draw themselves and the aggregate lands on top. That order matters: the point
 * of the slide is that the aggregate is *made of* the two below it, so the two
 * have to be established before anything appears above them.
 *
 * The branches are one <svg> with `preserveAspectRatio="none"`, so the fan always
 * lands exactly on the two keys however wide the slide is. Non-uniform scaling
 * would smear the stroke, hence `vector-effect="non-scaling-stroke"`.
 *
 * They are drawn on by clipping the <svg>, not by animating stroke-dashoffset.
 * With non-scaling-stroke the dash pattern is measured in *screen* pixels while
 * the path is authored in viewBox units, so any dasharray that hides the line at
 * one render size leaves a stub at another — and `pathLength`, which would have
 * normalised that, is not honoured when the attribute is set after parse. An inset
 * clip is proportional, so it needs to know nothing about either length.
 *
 * The clip opens upwards, from the two keys towards the aggregate, because that is
 * the direction of the claim: these two make that one.
 *
 * `compact` is the same tree at synthesis size, for the slide that puts it beside
 * the taptree. Every dimension scales together — key sizes, branch height and the
 * negative margins that close the gap between them — so the shape stays the shape
 * the audience already learned and only the scale changes.
 */
const props = withDefaults(
  defineProps<{ merged?: boolean; width?: string; compact?: boolean }>(),
  { merged: true, width: '', compact: false },
)

const size = computed(() => props.compact
  ? { box: 'w-[15rem]', top: 'h-14', agg: 'text-5xl', svg: '-mt-2 -mb-5 h-12', key: 'text-4xl', name: 'text-xs' }
  : { box: 'w-[32rem]', top: 'h-24', agg: 'text-8xl', svg: '-mt-3 -mb-7 h-20', key: 'text-6xl', name: 'text-base' })
</script>

<template>
  <div class="flex flex-col items-center" :class="width || size.box">
    <!-- the aggregate. No caption under it: the branch apex lands there, and the
         slide's own closing line says what it is. -->
    <div
      class="flex items-end transition-all duration-500 delay-[420ms]"
      :class="[size.top, merged ? 'opacity-100 scale-100' : 'opacity-0 scale-75']"
    >
      <MergedKey :size="size.agg" />
    </div>

    <!-- the branches. Negative margins at both ends: the key glyphs do not fill
         their own boxes, so laying the lines flush against those boxes leaves a
         gap that reads as the tree being disconnected. -->
    <svg
      class="w-full transition-[clip-path] duration-500"
      :class="size.svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      :style="{ clipPath: merged ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)' }"
    >
      <path
        v-for="(d, i) in ['M50 0 L16.67 100', 'M50 0 L83.33 100']"
        :key="i"
        :d="d"
        fill="none"
        stroke="#8a97a3"
        stroke-width="1.5"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>

    <!-- the two keys it was made from -->
    <div class="flex w-full items-start justify-between">
      <div class="w-1/3 flex flex-col items-center gap-2">
        <div class="i-ph-key-fill text-gold" :class="size.key" />
        <div class="text-gold" :class="size.name">Alice</div>
      </div>
      <div class="w-1/3 flex flex-col items-center gap-2">
        <div class="i-ph-key-fill text-purple" :class="size.key" />
        <div class="text-purple" :class="size.name">Bob</div>
      </div>
    </div>
  </div>
</template>
