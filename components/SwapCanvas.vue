<script setup lang="ts">
import { computed } from 'vue'
/**
 * The one canvas for Part 3. It is never replaced — both Part 3 diagram slides
 * render this same component and simply advance `step`, so the audience keeps
 * one picture in their head for the whole walkthrough.
 *
 *   1  browser holds a preimage and a key pair
 *   2  it sends the preimage hash and a public key
 *   3  back comes their key, a deadline, the rules, an address
 *   4  the app rebuilds that address and it matches
 *   5  you fund the Bitcoin lockup
 *   6  Boltz funds the Liquid lockup
 *   7  both deadlines exist — yours outlasts theirs
 *   8  you claim the Liquid lockup; the preimage becomes public
 *   9  Boltz reads it and claims the Bitcoin lockup
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 0 })

/**
 * The preimage shows up on the lockup it just opened, then slides across to the
 * one it opens next — the same gesture as the travelling key on slide 5, so the
 * audience reads a motion they have already been taught.
 *
 * Percentages across the chain row: the padlocks sit near 19% and 81%, and the
 * key parks just left of each one.
 */
const keyAt = computed(() => (props.step >= 9 ? 'left' : props.step >= 8 ? 'right' : null))
const keyLeft = computed(() => (keyAt.value === 'left' ? '12%' : '74%'))
</script>

<template>
  <div class="select-none">
    <!-- browser · boltz -->
    <div class="grid grid-cols-[1fr_14rem_1fr] items-stretch gap-0">
      <div class="pane-gold px-6 py-4">
        <div class="flex items-center gap-2.5">
          <div class="i-ph-browser-duotone text-2xl text-gold" />
          <span class="eyebrow !text-sm text-gold">your browser</span>
        </div>
        <div class="mt-3 h-9 flex flex-wrap items-center gap-2">
          <span v-if="step >= 1" class="chip-gold !text-sm"><span class="i-ph-key-fill" /> preimage</span>
          <span v-if="step >= 1" class="chip-gold !text-sm"><span class="i-ph-fingerprint-bold" /> key pair</span>
        </div>
        <div class="mt-1 h-8">
          <span v-if="step >= 4" class="chip-green !text-sm"><span class="i-ph-check-circle-fill" /> address verified</span>
        </div>
      </div>

      <!-- the two messages -->
      <div class="flex flex-col justify-center gap-6 px-3">
        <div class="transition-opacity duration-500" :class="step >= 2 ? 'opacity-100' : 'opacity-0'">
          <div class="text-center text-xs leading-tight text-gold">hash + public key</div>
          <div class="relative mt-1.5 h-px bg-gold/70 origin-left transition-transform duration-700"
               :class="step >= 2 ? 'scale-x-100' : 'scale-x-0'">
            <div class="i-ph-caret-right-fill absolute -right-1 -top-[0.4rem] text-xs text-gold" />
          </div>
        </div>
        <div class="transition-opacity duration-500" :class="step >= 3 ? 'opacity-100' : 'opacity-0'">
          <div class="text-center text-xs leading-tight text-purple">their key · deadline<br>rules · address</div>
          <div class="relative mt-1.5 h-px bg-purple/70 origin-right transition-transform duration-700"
               :class="step >= 3 ? 'scale-x-100' : 'scale-x-0'">
            <div class="i-ph-caret-left-fill absolute -left-1 -top-[0.4rem] text-xs text-purple" />
          </div>
        </div>
      </div>

      <div class="pane-purple px-6 py-4">
        <div class="flex items-center gap-2.5">
          <div class="i-ph-hard-drives-duotone text-2xl text-purple" />
          <span class="eyebrow !text-sm text-purple">boltz</span>
        </div>
        <div class="mt-3 h-9 flex items-center">
          <span v-if="step >= 3" class="chip-purple !text-sm"><span class="i-ph-hash-bold" /> holds the hash only</span>
        </div>
        <div class="mt-1 h-8" />
      </div>
    </div>

    <!-- funding arrows -->
    <div class="grid grid-cols-[1fr_14rem_1fr] h-10 items-center">
      <div class="flex justify-center">
        <div v-if="step >= 5" class="i-ph-arrow-down-bold text-xl text-gold animate-pulse" />
      </div>
      <div />
      <div class="flex justify-center">
        <div v-if="step >= 6" class="i-ph-arrow-down-bold text-xl text-purple animate-pulse" />
      </div>
    </div>

    <!-- bitcoin · liquid -->
    <div class="relative grid grid-cols-[1fr_14rem_1fr] items-start">
      <Lockup
        chain="bitcoin"
        title="Bitcoin"
        sub="your lockup"
        :state="step >= 9 ? 'open' : step >= 5 ? 'locked' : 'empty'"
        :dim="step < 5"
      >
        <div v-if="step >= 7" class="mt-3 flex items-center justify-center gap-2.5">
          <div class="i-ph-clock-duotone text-lg text-orange" />
          <div class="h-2 w-28 rounded-full bg-orange/70" />
          <span class="text-xs text-muted">yours</span>
        </div>
      </Lockup>

      <!-- caption only; the key itself travels, absolutely positioned below -->
      <div class="flex flex-col items-center justify-start pt-11">
        <div class="h-10 text-center text-xs leading-tight text-gold transition-opacity duration-500"
             :class="step >= 8 ? 'opacity-100' : 'opacity-0'">
          preimage<br >now public
        </div>
      </div>

      <Lockup
        chain="liquid"
        title="Liquid"
        sub="their lockup"
        :state="step >= 8 ? 'open' : step >= 6 ? 'locked' : 'empty'"
        :dim="step < 6"
      >
        <div v-if="step >= 7" class="mt-3 flex items-center justify-center gap-2.5">
          <div class="i-ph-clock-duotone text-lg text-teal" />
          <div class="h-2 w-16 rounded-full bg-teal/70" />
          <span class="text-xs text-muted">theirs</span>
        </div>
      </Lockup>

      <!-- The preimage, travelling from the lockup it just opened to the one it
           opens next. Same grammar as the key on slide 5: absolutely positioned so
           moving it cannot shift the boxes, and parked beside each padlock rather
           than over it, so the state change stays visible. -->
      <Transition name="reveal">
        <div
          v-if="keyAt"
          class="pointer-events-none absolute top-26 z-10 -translate-x-1/2 transition-[left] duration-700 ease-in-out"
          :style="{ left: keyLeft }"
        >
          <div class="i-ph-key-fill text-4xl text-gold drop-shadow-[0_0_14px_rgba(232,203,43,.9)]" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.reveal-enter-active { transition: opacity .35s ease, transform .35s cubic-bezier(.2, .9, .3, 1.2); }
.reveal-enter-from { opacity: 0; transform: translate(-50%, .5rem) scale(.6); }
</style>
