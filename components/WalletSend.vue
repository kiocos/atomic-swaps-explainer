<script setup lang="ts">
/**
 * The user's own wallet, mid-swap — a compact stand-in for a Send screen, then
 * its confirmation.
 *
 * Sends *bitcoin*, to the address on the payment page: in the chain swap the
 * deck follows, the user funds the Bitcoin lockup and Boltz funds the Liquid
 * one. Getting this backwards makes the phone scan one chain's address and open
 * another chain's wallet.
 *
 * Deliberately generic otherwise: no wallet's branding, no real address, no real
 * txid. The point of the slide is *whose software this is* — yours, not Boltz's
 * — so anything that made it look like a specific product would work against it.
 *
 *   step 0 — address scanned in, amount still empty
 *   step 1 — amount filled
 *   step 2 — sent
 */
withDefaults(defineProps<{ step?: number }>(), { step: 0 })
</script>

<template>
  <div class="h-full flex flex-col bg-[#141416] px-3.5 pb-3.5 pt-2 text-left">
    <template v-if="step < 2">
      <div class="text-center text-[0.7rem] text-white font-semibold">Send</div>

      <div class="mt-3 text-[0.55rem] text-white/45 uppercase tracking-wide">Asset</div>
      <div class="mt-1 flex items-center gap-2 rounded-lg bg-white/6 px-2.5 py-2">
        <ChainIcon chain="bitcoin" :size="16" />
        <div class="text-[0.66rem] text-white font-medium">Bitcoin</div>
      </div>

      <!-- Same ends as the address on the payment page, since this is that
           address after a scan. Change one and change the other. -->
      <div class="mt-2.5 text-[0.55rem] text-white/45 uppercase tracking-wide">Address</div>
      <div class="mt-1 rounded-lg bg-white/6 px-2 py-2 text-center text-[0.55rem] text-cyan font-mono leading-relaxed">
        bc1p3 xampl … qsmzk 7v
      </div>

      <div class="mt-2.5 text-[0.55rem] text-white/45 uppercase tracking-wide">Amount</div>
      <div class="mt-1 flex items-center justify-between rounded-lg bg-white/6 px-2.5 py-2">
        <span
          class="text-[0.72rem] font-mono transition-all duration-500"
          :class="step >= 1 ? 'text-white opacity-100' : 'text-white/25 opacity-60'"
        >{{ step >= 1 ? '1 000 000' : '0' }}</span>
        <span class="text-[0.62rem] text-cyan">sats</span>
      </div>

      <div
        class="mt-auto rounded-lg py-2 text-center text-[0.7rem] font-semibold transition-all duration-500"
        :class="step >= 1 ? 'bg-cyan/85 text-bg' : 'bg-white/8 text-white/30'"
      >
        Next
      </div>
    </template>

    <div v-else class="h-full flex flex-col items-center justify-center gap-3">
      <div class="grid h-14 w-14 place-items-center border-2 border-white/70 rounded-xl bg-[#0d2036]">
        <div class="i-ph-check-bold text-3xl text-white" />
      </div>
      <div class="text-[0.8rem] text-white font-semibold">Transaction Sent</div>
      <div class="break-all px-3 text-center text-[0.5rem] text-white/40 font-mono leading-relaxed">
        57af160aae95e4397a015e6e9301f914627bc8c53b42aa29a4fb2d8ca633ee4d
      </div>
    </div>
  </div>
</template>
