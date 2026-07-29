<script setup lang="ts">
/**
 * One key made out of two — the MuSig2 aggregate.
 *
 * Drawn as the same key glyph twice, stacked in one grid cell and each clipped to
 * half of a diagonal. The diagonal runs roughly across the key's own axis, so the
 * bow comes out in one party's colour and the blade in the other's: it reads as
 * *fused*, which a left/right split down the middle does not.
 *
 * Deliberately not a gradient. UnoCSS renders `i-ph-*` as a mask over
 * `background-color: currentColor`, and overriding that with a background-image is
 * a bet on which mode presetIcons picked for this particular icon. Clipping two
 * painted copies works whatever mode it chose.
 *
 * Colours are the deck's actor code, not decoration: gold is you, purple is the
 * counterparty. Whoever appears in the two halves must be the two parties whose
 * keys were aggregated.
 */
withDefaults(defineProps<{ size?: string; glow?: boolean }>(), {
  size: 'text-2xl',
  glow: true,
})

const GOLD_HALF = 'polygon(0 0, 100% 100%, 0 100%)'
const PURPLE_HALF = 'polygon(0 0, 100% 0, 100% 100%)'
</script>

<template>
  <div
    class="inline-grid place-items-center"
    :class="size"
    :style="glow ? { filter: 'drop-shadow(0 0 9px rgba(232,203,43,.28))' } : undefined"
  >
    <div class="i-ph-key-fill col-start-1 row-start-1 text-gold" :style="{ clipPath: GOLD_HALF }" />
    <div class="i-ph-key-fill col-start-1 row-start-1 text-purple" :style="{ clipPath: PURPLE_HALF }" />
  </div>
</template>
