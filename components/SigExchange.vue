<script setup lang="ts">
/**
 * The one round trip that settles a chain swap, drawn as two things that actually
 * travel — sits in `LedgerPair`'s `#top` zone, above the canvas, because the
 * exchange happens between *you and Boltz*, not between the two lockups.
 *
 * The order is the client's own, from `claimChainSwap` in
 * `boltz-web-app/src/utils/claim.ts`, and the shape of it is the point: this is a
 * **swap of signatures**, not a request for one. Before asking Boltz for anything,
 * the client produces its own partial signature for *Boltz's* claim of *your*
 * lockup (`createTheirPartialChainSwapSignature`) and sends it along with the
 * preimage; the response carries Boltz's partial for your claim of theirs
 * (`postChainSwapDetails`). One message each way, and neither side ever hands over
 * anything that would let the other take both.
 *
 * Each token fades in *while* it travels rather than appearing and then moving:
 * one click, one message sent. They park at the far end instead of vanishing, so by
 * the last beat both exchanges are still on screen.
 *
 * The endpoints are drawn: the **Boltz Web App** in your browser on the left, the
 * **Boltz backend** on the right, so the exchange reads as the HTTP round trip it
 * is rather than as two people telepathically agreeing. Those names are the ones
 * the recap slide uses, deliberately — this is the only place in the deck the two
 * are shown talking, and the whole security argument turns on them being different
 * things.
 *
 * Each payload is **two lines**, which is why the rows are as tall as they are. One
 * line at this wording would make a pill wide enough to park on top of an endpoint
 * icon; going taller instead of wider is what keeps the track clear. Each pill also
 * sits on an opaque backdrop so the track line does not run through its text.
 *
 * Percentages are the travel track, not the grid — these do not need to line up
 * with `LedgerPair`'s spots, since the tokens are messages between two endpoints,
 * not coins moving between lockups. FROM/TO are pulled well inside the ends so a
 * parked pill cannot land on an endpoint icon; the wider pill is ~24% of the width,
 * so 22 / 78 is about as far as they can travel. Widen the labels and these have to
 * come in — or the payload needs a third line.
 *
 * The whole thing has to fit `LedgerPair`'s `#top`, which is a fixed `h-30` (120px).
 * Two 44px rows plus the label is 114px. There is no room for a third row here
 * without giving that zone more height, which would move the canvas.
 *
 * The preimage rides *inside* the outbound token, as a key icon, rather than being
 * `LedgerPair`'s travelling key. Two reasons. It is more accurate — the preimage
 * goes to Boltz in that request and never touches either chain, so showing it move
 * across the canvas the way a claim does would say the wrong thing. And it avoids a
 * collision: the canvas key parks at the same spot as the bitcoin arriving beside
 * Boltz, and the key is drawn on top of it.
 */
withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })

const FROM = '22%'
const TO = '78%'
const travel = 'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out'
</script>

<template>
  <div class="relative w-full">

    <!-- the two endpoints -->
    <div class="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
      <div class="i-ph-browser-duotone text-2xl text-gold" />
      <div class="whitespace-nowrap text-[0.58rem] text-muted leading-none">Boltz Web App</div>
    </div>
    <div class="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
      <div class="i-ph-hard-drives-duotone text-2xl text-purple" />
      <div class="whitespace-nowrap text-[0.58rem] text-muted leading-none">Boltz backend</div>
    </div>

    <div class="space-y-1">
      <div class="text-center text-[0.6rem] tracking-[0.14em] uppercase text-muted/70">
        POST request
      </div>

      <!-- out: the preimage, and our half of *their* claim -->
      <div class="relative h-11">
        <div class="absolute inset-x-[8%] top-1/2 h-px bg-gold/20" />
        <div
          class="absolute right-[7.5%] top-1/2 -translate-y-1/2 i-ph-caret-right-fill text-xs text-gold/50 transition-opacity duration-500"
          :class="clicks >= 1 ? 'opacity-100' : 'opacity-0'"
        />
        <div
          :class="travel"
          :style="{ left: clicks >= 1 ? TO : FROM, opacity: clicks >= 1 ? 1 : 0 }"
        >
          <div class="rounded-2xl bg-bg">
            <div class="whitespace-nowrap rounded-2xl border border-gold/45 bg-gold/15 px-3 py-1.5 text-center text-[0.58rem] text-gold font-semibold leading-[1.35]">
              <div class="flex items-center justify-center gap-1.5">
                <span class="i-ph-key-fill text-xs" />
                the preimage
              </div>
              <div>+ your partial signature for the <span class="text-white">BTC</span> lockup</div>
            </div>
          </div>
        </div>
      </div>

      <!-- back: their half of ours -->
      <div class="relative h-11">
        <div class="absolute inset-x-[8%] top-1/2 h-px bg-purple/20" />
        <div
          class="absolute left-[7.5%] top-1/2 -translate-y-1/2 i-ph-caret-left-fill text-xs text-purple/50 transition-opacity duration-500"
          :class="clicks >= 2 ? 'opacity-100' : 'opacity-0'"
        />
        <div
          :class="travel"
          :style="{ left: clicks >= 2 ? FROM : TO, opacity: clicks >= 2 ? 1 : 0 }"
        >
          <div class="rounded-2xl bg-bg">
            <div class="whitespace-nowrap rounded-2xl border border-purple/45 bg-purple/15 px-3 py-1.5 text-center text-[0.58rem] text-purple font-semibold leading-[1.35]">
              <div>their partial signature</div>
              <div>for the <span class="text-white">L-BTC</span> lockup</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
