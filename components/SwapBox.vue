<script setup lang="ts">
import { watch } from 'vue'
import { useNav } from '@slidev/client'

/** Shared across every rendered copy of this component — see onTapEnd. */
let armedFor: number | null = null

/**
 * Mock of the boltz-web-app "Create Swap" panel, BTC → L-BTC.
 *
 * Deliberately a rebuild rather than a screenshot: it scales cleanly on a
 * projector, and it can reveal itself click by click. Values are invented.
 *
 *   step 1        amounts filled in
 *   step 2        destination address entered, button becomes active
 *   pressStep     the press — transient, see below
 *
 * The press is the last step, but *which* number that is depends on how many
 * annotations the slide runs alongside the panel, so it is a prop rather than a
 * constant. It was hard-coded to 4 while there were three annotations.
 */
const props = withDefaults(
  defineProps<{ step?: number; advanceOnTap?: boolean; pressStep?: number }>(),
  { step: 0, advanceOnTap: false, pressStep: 4 },
)

const { nextSlide, currentSlideNo } = useNav()

/**
 * The press step is not a resting state. Advancing onto it plays the cursor tap, and the
 * end of that animation carries us to the next slide — so a single press reads
 * as "click the button, and here is what came back".
 *
 * `armedFor` is deliberately at MODULE scope, not per-instance. Slidev renders
 * neighbouring slides for its transitions, so this component exists more than
 * once at a time; a per-instance flag armed twice and advanced twice, running
 * away through the deck. One shared token, consumed by whichever copy finishes
 * its animation first.
 *
 * It is armed only on a forward step *onto* pressStep, so navigating *back* into
 * this slide replays the animation without dragging the presenter forwards again.
 */
const fire = () => {
  if (armedFor === null)
    return
  const target = armedFor
  armedFor = null
  // only advance if we are still on the slide the tap was armed for
  if (currentSlideNo.value === target)
    nextSlide()
}

watch(
  () => props.step,
  (val, old) => {
    if (!props.advanceOnTap || val !== props.pressStep || old !== props.pressStep - 1)
      return
    armedFor = currentSlideNo.value
    // fallback: if the animation never reports finishing — reduced-motion
    // settings, a backgrounded tab — do not strand the presenter mid-slide
    setTimeout(fire, 1400)
  },
)

const onTapEnd = () => fire()
</script>

<template>
  <div class="w-[23rem] rounded-2xl border border-white/10 bg-[#12253a]/70 px-5 py-4 select-none">
    <div class="flex items-center justify-center relative">
      <div class="text-lg font-bold text-white">Create Swap</div>
      <div class="i-ph-gear-six-fill absolute right-0 text-lg text-muted/70" />
    </div>

    <!-- send -->
    <div class="mt-3 rounded-xl border border-white/10 px-3 py-2.5">
      <div class="flex items-center justify-between">
        <span class="eyebrow !text-[0.6rem]">send</span>
        <div class="flex gap-1.5">
          <span class="rounded-full border border-white/15 px-2 py-0.5 text-[0.55rem] text-muted">MIN</span>
          <span class="rounded-full border border-white/15 px-2 py-0.5 text-[0.55rem] text-muted">MAX</span>
        </div>
      </div>
      <div class="mt-1.5 flex items-center justify-between">
        <div class="flex items-center gap-2 rounded-full border border-white/12 py-1 pl-1 pr-2.5">
          <ChainIcon chain="bitcoin" :size="22" />
          <span class="text-sm font-bold text-white">BTC</span>
          <div class="i-ph-caret-down-bold text-[0.6rem] text-muted" />
        </div>
        <div class="text-right">
          <div class="text-xl font-light leading-none" :class="step >= 1 ? 'text-white' : 'text-muted/40'">
            {{ step >= 1 ? '1 000 000' : '0' }}
          </div>
          <div class="text-[0.6rem] text-muted/70">≈ {{ step >= 1 ? '1,043.20' : '0.00' }} USD</div>
        </div>
      </div>
    </div>

    <div class="relative h-0">
      <div class="absolute left-1/2 -top-2.5 grid h-6 w-6 -translate-x-1/2 place-items-center
                  rounded-lg border border-white/12 bg-[#0d1b2a]">
        <div class="i-ph-arrow-down-bold text-[0.6rem] text-muted" />
      </div>
    </div>

    <!-- receive -->
    <div class="mt-2 rounded-xl border border-white/10 px-3 py-2.5">
      <span class="eyebrow !text-[0.6rem]">receive</span>
      <div class="mt-1.5 flex items-center justify-between">
        <div class="flex items-center gap-2 rounded-full border border-white/12 py-1 pl-1 pr-2.5">
          <ChainIcon chain="liquid" :size="22" />
          <span class="text-sm font-bold text-white">LBTC</span>
          <div class="i-ph-caret-down-bold text-[0.6rem] text-muted" />
        </div>
        <div class="text-right">
          <div class="text-xl font-light leading-none" :class="step >= 1 ? 'text-white' : 'text-muted/40'">
            {{ step >= 1 ? '996 200' : '0' }}
          </div>
          <div class="text-[0.6rem] text-muted/70">≈ {{ step >= 1 ? '1,039.24' : '0.00' }} USD</div>
        </div>
      </div>
    </div>

    <div class="mt-2.5 flex items-center justify-between">
      <div class="flex rounded-full border border-white/10 text-[0.65rem]">
        <span class="px-3 py-1 text-muted">BTC</span>
        <span class="rounded-full bg-white/8 px-3 py-1 font-semibold text-gold">sats</span>
      </div>
      <span class="text-[0.65rem] text-muted">Swap Fees: ≈ 0.37 USD</span>
    </div>

    <!-- destination -->
    <div class="mt-2.5 rounded-xl border px-3 py-2.5 text-center text-[0.7rem]"
         :class="step >= 2 ? 'border-white/12 text-body' : 'border-white/10 text-muted/60'">
      <span v-if="step >= 2" class="font-mono">lq1qq2example…8w3e5nk4dq</span>
      <span v-else>Enter LBTC address to receive funds</span>
    </div>

    <div class="relative mt-2.5">
      <div class="rounded-xl px-3 py-2.5 text-center text-sm font-bold transition-all duration-150"
           :class="[
             step >= 2 ? 'bg-gold text-[#09141f]' : 'bg-white/8 text-muted/60',
             step >= pressStep ? 'scale-[0.97] brightness-90' : '',
           ]">
        {{ step >= 2 ? 'Create Swap' : 'Invalid LBTC address' }}
      </div>

      <!-- the press: a ring radiating past the button edge, and a cursor tapping -->
      <template v-if="step >= pressStep">
        <span class="ripple pointer-events-none absolute left-1/2 top-1/2 rounded-full ring-2 ring-gold" />
        <div class="tap pointer-events-none absolute left-1/2 top-1/2" @animationend="onTapEnd">
          <div class="i-ph-cursor-fill text-2xl text-white drop-shadow-[0_2px_5px_rgba(0,0,0,.7)]" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ripple {
  transform: translate(-50%, -50%);
  animation: ripple .75s ease-out forwards;
}
@keyframes ripple {
  0% { width: 0; height: 0; opacity: .95; }
  100% { width: 9rem; height: 9rem; opacity: 0; }
}

.tap { animation: tap .8s cubic-bezier(.2, .8, .3, 1) forwards; }
@keyframes tap {
  0%   { transform: translate(1.4rem, 1.6rem) scale(1); opacity: 0; }
  30%  { transform: translate(.15rem, .25rem) scale(1); opacity: 1; }
  50%  { transform: translate(.15rem, .25rem) scale(.78); opacity: 1; }
  70%  { transform: translate(.15rem, .25rem) scale(1); opacity: 1; }
  100% { transform: translate(.15rem, .25rem) scale(1); opacity: 1; }
}
</style>
