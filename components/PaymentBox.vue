<script setup lang="ts">
/**
 * Mock of the boltz-web-app payment page for a chain swap awaiting the lockup.
 *
 * Simplified but not sanitised: the status pill, the chunked address with its
 * first and last groups emphasised, the confirm-in-time warning and the copy
 * row are all real behaviour worth showing. The swap id, address and QR are
 * invented — the QR encodes nothing and will not scan.
 */
withDefaults(defineProps<{ dim?: boolean }>(), { dim: false })

/**
 * The app breaks the address into five-character groups and brightens the first
 * and last, so a human can eyeball the ends against another display. Slide 19
 * is about why eyeballing is not enough.
 */
const chunks = [
  'bc1p3', 'xampl', 'ea7k9', 'wq2mf', 'z8vn6', 'ydr5s', '0hlc4',
  'gu7tj', '9pqz2', 'v8w3e', '5nk4d', 'qsmzk', '7v',
]
const bright = (i: number) => i <= 1 || i >= chunks.length - 2
</script>

<template>
  <div class="w-[21rem] rounded-2xl border border-white/10 bg-[#12253a]/70 px-4 py-3 select-none transition-opacity duration-500"
       :class="dim ? 'opacity-40' : ''">

    <div class="relative flex items-center justify-center gap-2">
      <span class="text-sm font-bold text-white">Swap: GwR27ZfsZh1C</span>
      <ChainIcon chain="bitcoin" :size="16" />
      <div class="i-ph-arrow-right-bold text-[0.55rem] text-muted" />
      <ChainIcon chain="liquid" :size="16" />
      <div class="i-ph-gear-six-fill absolute right-0 text-sm text-muted/70" />
    </div>

    <div class="mt-1.5 flex items-center justify-center gap-2 text-[0.65rem]">
      <span class="text-muted">Status:</span>
      <span class="rounded-full bg-gold/20 px-2 py-0.5 font-semibold text-gold">swap.created</span>
      <span class="border-l border-white/10 pl-2 text-muted/70">Destination</span>
    </div>

    <div class="mt-2 border-t border-white/8 pt-2 text-center text-sm font-bold text-white">
      Send 1 000 000 sats to
    </div>

    <div class="mt-2 flex justify-center">
      <QrMock :size="132" logo="bitcoin" />
    </div>

    <div class="mt-2.5 flex items-start gap-2 rounded-xl border border-white/8 bg-white/3 px-2.5 py-2">
      <div class="i-ph-copy-bold mt-0.5 shrink-0 text-sm text-muted/70" />
      <!-- flex-wrap rather than spaces: the compiler strips trailing whitespace
           inside the spans, which welds the groups into one unbreakable string -->
      <div class="min-w-0 flex-1 flex flex-wrap gap-x-1.5 gap-y-0.5 font-mono text-[0.66rem]">
        <span v-for="(c, i) in chunks" :key="i" :class="bright(i) ? 'text-white' : 'text-muted/55'">{{ c }}</span>
      </div>
    </div>

    <div class="mt-2 text-center text-[0.65rem] font-bold leading-snug text-gold">
      Make sure your transaction confirms within ~24 hours after creation of this swap!
    </div>

    <div class="mt-2 grid grid-cols-3 gap-1.5 text-[0.6rem] font-bold">
      <div v-for="l in ['Amount', 'Address', 'BIP21']" :key="l"
           class="rounded-lg bg-gold py-1.5 text-center text-[#09141f]">{{ l }}</div>
    </div>
    <div class="mt-1.5 rounded-lg bg-purple/70 py-1.5 text-center text-[0.65rem] font-bold text-white">
      Open lockup address
    </div>
  </div>
</template>
