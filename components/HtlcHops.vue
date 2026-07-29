<script setup lang="ts">
/**
 * A chain of HTLC hops: node — HTLC → node — HTLC → node.
 *
 * Used twice on the same slide, one above the other, to make a single point by
 * repetition: a Lightning payment and a swap are the same shape. The two rows
 * share this component precisely so they line up pixel for pixel — if the hops
 * did not sit at the same x, the resemblance would be something the audience has
 * to be told rather than something they can see.
 */
type Node = {
  label: string
  /** Iconify name, for generic nodes. */
  icon?: string
  /** Official brand mark, for Boltz and the chains — takes precedence. */
  mark?: 'bitcoin' | 'liquid' | 'lightning' | 'boltz'
  accent?: string
}

defineProps<{ nodes: [Node, Node, Node], hopLabel?: string }>()
</script>

<template>
  <div class="grid grid-cols-[7rem_1fr_7rem_1fr_7rem] items-center">
    <template v-for="(node, i) in nodes" :key="node.label">
      <!-- the hop between the previous node and this one -->
      <div v-if="i > 0" class="flex flex-col items-center gap-1 px-2">
        <span class="text-sm text-body/85">{{ hopLabel ?? 'HTLC' }}</span>
        <div class="flex w-full items-center">
          <div class="h-px flex-1 bg-white/45" />
          <div class="i-ph-caret-right-fill -ml-1 text-xs text-white/45" />
        </div>
      </div>

      <div class="flex flex-col items-center gap-2">
        <ChainIcon v-if="node.mark" :chain="node.mark" :size="42" />
        <div v-else class="text-4xl" :class="[node.icon, node.accent ?? 'text-gold']" />
        <div class="text-lg text-white font-medium leading-none">{{ node.label }}</div>
      </div>
    </template>
  </div>
</template>
