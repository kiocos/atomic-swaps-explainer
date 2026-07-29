<script setup lang="ts">
/**
 * A unit of the asset being swapped, as it travels the canvas.
 *
 * Just the brand mark — no ticker, no amount. It is the *same* mark the lockup
 * shows while holding it, because there is only ever one of each on the canvas:
 * the coin you watch leave a lockup is the coin you watch arrive at a person.
 * An amount would invite the wrong question anyway; what matters is only which
 * side of the picture it ends up on.
 */
withDefaults(defineProps<{ chain: 'bitcoin' | 'liquid'; size?: number }>(), { size: 30 })

const glow = { bitcoin: 'rgba(247,147,26,.55)', liquid: 'rgba(93,178,165,.55)' } as const
</script>

<template>
  <ChainIcon
    :chain="chain"
    :size="size"
    :style="{ filter: `drop-shadow(0 0 10px ${glow[chain]})` }"
  />
</template>
