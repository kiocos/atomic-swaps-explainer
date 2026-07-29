<script setup lang="ts">
/**
 * A magnifying glass hovering over a timelock bar, showing the one place on it
 * that matters: the expiration boundary, with the solid claim window on the left
 * and the hatched refundable zone on the right.
 *
 * The glass does not perform real geometric magnification — it draws the same
 * boundary at a readable size. True magnification of the bar underneath would
 * mean duplicating it and pinning its transform-origin to a percentage of a
 * flex-sized parent, which is a lot of fragility for a result nobody could tell
 * apart at slide scale. What has to be true is that the two halves are the same
 * two fills as the bar below it, and they are: both come from the caller.
 */
const props = defineProps<{ color: string; rgb: string }>()

/**
 * Its own pitch, not the bar's. The bar hatches at 15px because it is 1400px
 * wide; inside a 36px lens that is under one stripe, so the region would read as
 * a flat block. Finer stripes here keep it recognisably *the hatched zone*,
 * which is the only thing the lens has to convey.
 */
const hatch = `repeating-linear-gradient(-45deg, rgba(${props.rgb}, .55) 0 2px, rgba(${props.rgb}, 0) 2px 6px)`

/**
 * The handle starts *inside* the rim and runs out along the down-right diagonal,
 * so the glass overlaps its top end and the two read as one object. Anchoring it
 * to the bounding box instead leaves a visible gap at the rim, which is what
 * makes a drawn magnifier look like two shapes that happen to be near each other.
 */
const HANDLE = {
  left: '22px',
  top: '25px',
  width: '6px',
  height: '22px',
  transformOrigin: '50% 0',
  transform: 'rotate(-45deg)',
}
</script>

<template>
  <div class="pointer-events-none relative h-9 w-9 lens-float">
    <!-- handle, drawn first so the glass covers where it enters the rim -->
    <div class="absolute rounded-full bg-muted" :style="HANDLE" />

    <!-- Rim and handle are one flat grey — the deck's own muted tone, so the
         magnifier reads as a tool rather than as another coloured element
         competing with the bar it is held over. -->
    <div
      class="absolute inset-0 overflow-hidden border-[3.5px] border-muted rounded-full bg-bg/85"
      style="box-shadow: 0 2px 12px rgba(0,0,0,.6), inset 0 0 10px rgba(0,0,0,.5)"
    >
      <!-- the magnified slice: claim window | expiration | refundable zone -->
      <div class="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2">
        <div class="absolute inset-y-0 left-0 right-1/2" :style="{ backgroundColor: color, opacity: 0.7 }" />
        <div class="absolute inset-y-0 left-1/2 right-0" :style="{ backgroundImage: hatch }" />
        <div class="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2" :style="{ backgroundColor: color }" />
      </div>

      <!-- glare, so it reads as glass rather than a hole -->
      <div
        class="absolute -left-1 -top-1 h-5 w-8 rotate-[-32deg] rounded-full"
        style="background: linear-gradient(to bottom, rgba(255,255,255,.22), rgba(255,255,255,0))"
      />
    </div>
  </div>
</template>

<style scoped>
/* a small hover, so it reads as held over the bar rather than stuck to it */
.lens-float { animation: lens-float 2.6s ease-in-out infinite; }
@keyframes lens-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>
