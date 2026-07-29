<script setup lang="ts">
/**
 * One side of a swap: a chain, and the state of the output locked on it.
 * Used across Part 1 (generic Alice/Bob) and Part 3 (Bitcoin/Liquid) so the
 * same visual grammar carries through the whole deck.
 */
withDefaults(
  defineProps<{
    /** Accent colour + icon. */
    chain?: 'bitcoin' | 'liquid' | 'a' | 'b'
    /** Big label, e.g. "Ledger A" or "Bitcoin". */
    title?: string
    /** Small label under the title, e.g. "Alice's lockup". */
    sub?: string
    /** empty = nothing locked yet. */
    state?: 'empty' | 'locked' | 'open' | 'refunded'
    /** Caption under the padlock. */
    note?: string
    /**
     * Who this lockup pays out to. It is what makes the two boxes a *swap*
     * rather than two unrelated locks, so Part 1 shows it from the start.
     * `beneficiaryAccent` is a text-colour class, so the name is tinted like the
     * person it refers to rather than like the chain it sits on.
     */
    beneficiary?: string
    beneficiaryAccent?: string
    /**
     * Drop the chain mark from the header. `LedgerPair` sets this: there the
     * asset's own mark travels in and out of the box, and two of the same logo
     * on one lockup makes it ambiguous which one is the money.
     */
    showMark?: boolean
    dim?: boolean
    /** Shorter, for slides that stack other content above or below. */
    compact?: boolean
    /**
     * Always render the note row, even when empty. Keeps the box a fixed height
     * across clicks so a caption appearing does not resize it — required by
     * LedgerPair, where the two boxes must not move between slides.
     */
    reserveNote?: boolean
  }>(),
  {
    chain: 'a', state: 'empty', dim: false, compact: false, reserveNote: false,
    beneficiary: '', beneficiaryAccent: 'text-white', showMark: true,
  },
)

/**
 * bitcoin/liquid carry the official brand marks (see ChainIcon.vue) and are what
 * both halves of the deck actually use. a/b are the older unbranded ledgers, kept
 * for any diagram that wants to stay abstract. Colours: orange is Bitcoin, teal
 * is Liquid, purple is the counterparty (Boltz in the practice half).
 */
const skin = {
  bitcoin: { accent: 'text-orange', ring: 'border-orange/45', glow: 'rgba(247,147,26,.13)', mark: 'bitcoin' },
  liquid: { accent: 'text-teal', ring: 'border-teal/45', glow: 'rgba(93,178,165,.15)', mark: 'liquid' },
  a: { accent: 'text-orange', ring: 'border-orange/45', glow: 'rgba(247,147,26,.13)', mark: null },
  b: { accent: 'text-purple', ring: 'border-purple/45', glow: 'rgba(160,110,220,.15)', mark: null },
} as const

const marks = {
  empty: { icon: '', cls: '', label: '' },
  locked: { icon: 'i-ph-lock-simple-fill', cls: 'text-gold', label: 'locked' },
  open: { icon: 'i-ph-lock-simple-open-fill', cls: 'text-green', label: 'claimed' },
  refunded: { icon: 'i-ph-arrow-u-up-left-bold', cls: 'text-cyan', label: 'refunded' },
} as const
</script>

<template>
  <div
    class="relative rounded-2xl border bg-white/3 text-center transition-all duration-500"
    :class="[skin[chain].ring, compact ? 'px-4 py-3' : 'px-7 py-6', dim ? 'opacity-35 saturate-50' : 'opacity-100']"
    :style="{ boxShadow: dim ? 'none' : `inset 0 0 70px ${skin[chain].glow}` }"
  >
    <div class="flex items-center justify-center gap-2">
      <template v-if="showMark">
        <ChainIcon v-if="skin[chain].mark" :chain="skin[chain].mark" :size="compact ? 20 : 26" />
        <div v-else :class="[skin[chain].accent, compact ? 'text-xl' : 'text-2xl']" class="i-ph-stack-simple-bold" />
      </template>
      <div class="text-white font-semibold leading-none" :class="compact ? 'text-lg' : 'text-xl'">{{ title }}</div>
    </div>
    <div v-if="sub" class="text-muted" :class="compact ? 'mt-1 text-xs' : 'mt-1.5 text-sm'">{{ sub }}</div>

    <div class="flex flex-col items-center justify-center" :class="compact ? 'mt-2 h-15' : 'mt-5 h-24'">
      <Transition name="pop" mode="out-in">
        <div :key="state" class="flex flex-col items-center">
          <div v-if="state !== 'empty'" :class="[marks[state].icon, marks[state].cls, compact ? 'text-4xl' : 'text-6xl']" />
          <div v-else class="rounded-xl border-2 border-dashed border-white/15" :class="compact ? 'h-8 w-8' : 'h-14 w-14'" />
          <div class="tracking-wide" :class="[marks[state].cls || 'text-muted/60', compact ? 'mt-1.5 text-xs' : 'mt-2 text-sm']">
            {{ marks[state].label || 'nothing locked' }}
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="beneficiary" class="mt-1.5 text-xs text-muted">
      claimable by <span :class="beneficiaryAccent">{{ beneficiary }}</span>
    </div>

    <div v-if="note || reserveNote" class="text-body/80" :class="compact ? 'h-4 text-xs' : 'mt-1 h-5 text-sm'">{{ note }}</div>
    <slot />
  </div>
</template>

<style scoped>
.pop-enter-active { transition: all .35s cubic-bezier(.2, .9, .3, 1.2); }
.pop-leave-active { transition: all .18s ease-in; }
.pop-enter-from { opacity: 0; transform: scale(.6) translateY(6px); }
.pop-leave-to { opacity: 0; transform: scale(.85); }
</style>
