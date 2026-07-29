<script setup lang="ts">
/**
 * Mock of the boltz-web-app "Boltz Rescue Key" gate — the modal that blocks a
 * chain or submarine swap until the rescue key has been saved and verified
 * (Pay.tsx: `type !== Reverse && !rescueFileBackupDone()`).
 *
 * Copy is the app's own, minus the decorative emoji. The warning wording matters
 * and is quoted rather than paraphrased: the app really does say LOSS OF FUNDS.
 */
</script>

<template>
  <div class="w-[17.5rem] rounded-2xl border border-white/10 bg-[#12253a]/70 px-5 py-4 text-center select-none">
    <div class="text-base font-bold text-white">Boltz Rescue Key</div>

    <div class="mt-2.5 text-[0.72rem] font-bold text-white leading-snug">
      Back up all your swaps with a single Rescue Key
    </div>

    <div class="mt-2 text-[0.63rem] text-body/80 leading-relaxed">
      This key works on any device and for all swaps created with it.
      To continue, please back it up.
    </div>

    <div class="mt-3 flex justify-center">
      <div class="i-ph-warning-fill text-3xl text-gold" />
    </div>

    <div class="mt-3 text-[0.63rem] text-body/80 leading-relaxed">
      Save the Rescue Key in a <span class="font-bold text-white">SECURE</span> and
      <span class="font-bold text-white">PERMANENT</span> location!<br>
      Failing to do so may lead to <span class="font-bold text-white">LOSS OF FUNDS</span>.
    </div>

    <div class="mt-3 rounded-xl bg-gold py-2 text-[0.72rem] font-bold text-[#09141f]">
      Download rescue key
    </div>
  </div>
</template>
