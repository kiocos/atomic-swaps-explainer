<script setup lang="ts">
/**
 * Official brand marks, from github.com/BoltzExchange/logo (Design System/assets),
 * served out of public/brand/.
 *
 * Note on Bitcoin vs Liquid: both are the same curved-B glyph, differing only in
 * fill — orange #f7931a for BTC, teal #5db2a5 for L-BTC. That is the house
 * convention, not a duplicate: L-BTC *is* bitcoin, on the Liquid network.
 *
 * The theory half uses this too. It used to keep abstract "Ledger A / Ledger B"
 * marks so that nothing was branded before Boltz appeared, but the swap it walks
 * through is now concretely BTC for L-BTC — the coins have to be nameable to be
 * watchable as they change sides, and meeting the same two chains here means the
 * practice half is not introducing them cold.
 */
withDefaults(
  defineProps<{
    chain: 'bitcoin' | 'liquid' | 'lightning' | 'boltz'
    /** Rendered size in px. */
    size?: number
  }>(),
  { size: 32 },
)

/**
 * Built against BASE_URL rather than written as bare "/brand/..." paths.
 * Vite rewrites absolute asset URLs it can see in a *template*, but these live
 * in a script-side lookup, so it cannot — and they would 404 on any deploy
 * served from a subdirectory, such as a GitHub Pages project site.
 * BASE_URL always carries a trailing slash.
 */
const base = import.meta.env.BASE_URL

const src = {
  bitcoin: `${base}brand/bitcoin.svg`,
  liquid: `${base}brand/liquid.svg`,
  lightning: `${base}brand/lightning.svg`,
  boltz: `${base}brand/boltz-icon.svg`,
} as const
</script>

<template>
  <img
    :src="src[chain]"
    alt=""
    class="inline-block shrink-0 select-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
</template>
