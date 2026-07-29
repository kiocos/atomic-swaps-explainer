<script setup lang="ts">
import { computed } from 'vue'

/**
 * Why the two deadlines cannot be equal — the subtlest point in the talk, and
 * the answer to the attack shown two slides earlier.
 *
 * The slide is in two halves that say the same thing at two scales. On top, the
 * two lockups from the canvas the audience already knows, each carrying a small
 * bar: *the deadline is a property of the lockup*. Below, those same two bars
 * blown up on one shared time axis, where the relationship between them can
 * actually be read. Both halves are driven by `bobEnd` / `aliceEnd`, so the
 * miniature can never disagree with the full-size version — that is the whole
 * reason the lockups live in here rather than being drawn on the slide.
 *
 * Each bar is the window during which that lockup can still be CLAIMED; when it
 * expires, the owner refunds instead. Alice claims first (she has the preimage),
 * so Bob can only ever act after her.
 *
 * It opens BROKEN and is repaired, not the other way round: the audience has
 * just been asked what stops Alice, so the slide has to show the failure before
 * it shows the fix.
 *
 *   0 — both windows the same length, which is the mistake somebody would make
 *   1 — Alice claims Bob's lockup at the last possible moment, publishing the key
 *   2 — the window Bob has left, highlighted: there isn't one
 *   3 — Alice's window extends past Bob's, and the swap completes
 *
 * Note what moves on click 3: only the gold bar — in both halves at once, which
 * is what makes the link between them land. Bob's window and the moment Alice
 * claims stay put, so the single variable under test is the one thing changing
 * on screen. Equal deadlines are the realistic mistake — reversing them is a
 * strawman — and equal is already enough to break it.
 */
const props = withDefaults(
  defineProps<{ clicks?: number; lockups?: boolean; asymmetric?: boolean }>(),
  { clicks: 0, lockups: false, asymmetric: false },
)

/** Fixed: Bob's window, and the moment Alice acts, never move. */
const bobEnd = 46
const claimAt = 42
/** Where Bob gets in, on the run where he has room to. */
const bobClaimAt = 66

/**
 * Both runs spend their first click on setup, then play out identically over the
 * next three — which is what makes them comparable at all. Run one zooms from
 * the lockups into the clock; run two starts from the same equal deadlines and
 * stretches Alice's past Bob's. Hence one shared `beat` offset rather than two
 * sets of click numbers.
 */
const zoomsIn = computed(() => !props.asymmetric)
const shown = computed(() => !zoomsIn.value || props.clicks >= 1)
const expanded = computed(() => props.asymmetric && props.clicks >= 1)
const beat = computed(() => props.clicks - 1)

/**
 * The one variable under test. Everything else on both slides is held constant,
 * so this is the only thing that can be responsible for the difference in
 * outcome — which is the entire argument.
 */
const equalWindows = computed(() => !expanded.value)
const aliceEnd = computed(() => (equalWindows.value ? bobEnd : 84))

/**
 * The two runs diverge on their third beat, which is the whole point: on equal
 * deadlines Alice takes her own funds back, on ordered ones Bob gets his.
 */
const refunded = computed(() => !props.asymmetric && beat.value >= 3)
const bobClaims = computed(() => props.asymmetric && beat.value >= 3)
const safe = computed(() => expanded.value)

/**
 * The key, and the two coins, on the same track and the same percentages
 * LedgerPair uses. The key is what makes the picture legible: it leaves Alice,
 * opens Bob's lockup, and — where the deadlines allow it — goes on to open hers.
 * Every padlock that opens on this slide opens because the key arrived.
 */
const keyPos = computed(() => {
  if (bobClaims.value) return { left: '32.15%', top: '34px' }
  if (beat.value >= 1) return { left: '79.85%', top: '34px' }
  return { left: '3.7%', top: '52px' }
})
const btcPos = computed(() => {
  if (bobClaims.value) return { left: '96.3%', top: '86px' }
  if (refunded.value) return { left: '6.5%', top: '86px' }
  return { left: '20.15%', top: '34px' }
})
const lbtcPos = computed(() =>
  beat.value >= 1 ? { left: '2%', top: '86px' } : { left: '67.85%', top: '34px' })

/**
 * What lies past an expiration: not nothing, but the refund. Drawn from click
 * zero and hatched rather than filled, so the eye reads it as a different *kind*
 * of region than the solid claim window rather than as more of the same. The
 * whole failure on this slide turns on Alice being able to act in there, so it
 * cannot be left as empty track for the audience to infer.
 */
const hatch = (rgb: string) =>
  `repeating-linear-gradient(-45deg, rgba(${rgb}, .2) 0 7px, rgba(${rgb}, 0) 7px 15px)`
const HATCH_ORANGE = hatch('247, 147, 26')
const HATCH_TEAL = hatch('93, 178, 165')

/**
 * The same idea on the 6px bars inside the lockups, at a pitch that survives
 * being that small. They need it: the refundable zone is a property of the
 * timelock, not of the diagram below, so a lockup that shows only the solid part
 * is telling half the truth even before anything is magnified.
 */
const hatchMini = (rgb: string) =>
  `repeating-linear-gradient(-45deg, rgba(${rgb}, .55) 0 1.5px, rgba(${rgb}, 0) 1.5px 4.5px)`
const MINI_ORANGE = hatchMini('247, 147, 26')
const MINI_TEAL = hatchMini('93, 178, 165')

/**
 * How far along the shared clock the story has got, so each timelock's padlock
 * can say whether it has run out yet. It falls out of the beat we are on rather
 * than being tracked separately, which keeps it honest — and it earns its keep
 * on both runs: on equal deadlines both padlocks spring at once, which is the
 * failure in one glyph, and on ordered ones Alice's never opens at all, because
 * Bob got in first.
 */
const now = computed(() => {
  if (refunded.value) return aliceEnd.value + 3
  if (bobClaims.value) return bobClaimAt
  return beat.value >= 1 ? claimAt : 0
})
const aliceExpired = computed(() => now.value > aliceEnd.value)
const bobExpired = computed(() => now.value > bobEnd)

/**
 * On the broken run the caption stops at the claim: what the preimage becoming
 * public is *for* is that Bob can act on it, and on that run he never can, so
 * saying it there only invites the question the slide is about to answer. On the
 * ordered run it is the hinge of the whole thing, and it is said.
 */
const claimCaption = computed(() =>
  props.asymmetric
    ? 'Alice claims at the last moment — the preimage is now public'
    : 'Alice claims at the last moment')
</script>

<template>
  <div class="select-none">

    <!--
      The lockups, as the canvas draws them, shrunk to a header. Same grid
      template as LedgerPair so the boxes land under the same avatars in the
      same places — this has to read as the picture they already know, with one
      thing added to it.
    -->
    <div
      v-if="lockups"
      class="relative mb-3 grid w-full grid-cols-[4rem_1.75rem_1fr_9rem_1fr_1.75rem_4rem] items-start transition-transform duration-700 ease-in-out"
      :style="{ transform: shown ? 'translateY(0)' : 'translateY(150px)' }"
    >
      <div class="flex flex-col items-center gap-0.5 pt-0.5">
        <div class="i-ph-user-circle-fill text-2xl text-gold" />
        <div class="text-xs text-white leading-none">Alice</div>
      </div>
      <div class="h-24 flex justify-center"><div class="w-px border-l border-white/20 border-dashed" /></div>

      <!-- Title text only, no chain mark: the asset's own mark is the one that
           travels, and a second copy of it in the header makes it ambiguous
           which one is the money. Same rule LedgerPair enforces via show-mark. -->
      <div class="pane-orange px-4 py-2.5">
        <div class="text-center text-base text-white font-semibold leading-none">Bitcoin</div>
        <div class="mt-1.5 flex justify-center">
          <div
            class="text-2xl transition-colors duration-500"
            :class="bobClaims ? 'i-ph-lock-simple-open-fill text-green'
              : refunded ? 'i-ph-arrow-u-up-left-bold text-cyan'
              : 'i-ph-lock-simple-fill text-gold'"
          />
        </div>
        <div class="mt-1 text-center text-xs text-muted">
          claimable by <span class="text-purple">Bob</span>
        </div>
        <div class="mt-2.5 flex items-center gap-2">
          <div class="i-ph-clock-countdown-bold shrink-0 text-xs text-orange" />
          <div class="relative h-1.5 flex-1">
            <!-- clipped separately from the lens, which has to overflow it -->
            <div class="absolute inset-0 overflow-hidden rounded-full bg-white/8">
              <div class="absolute inset-y-0 left-0 bg-orange/80 transition-all duration-700 ease-in-out"
                   :style="{ width: `${aliceEnd}%` }" />
              <div class="absolute inset-y-0 right-0 transition-all duration-700 ease-in-out"
                   :style="{ left: `${aliceEnd}%`, backgroundImage: MINI_ORANGE }" />
            </div>
            <!--
              The zoom: one pass across this bar, right to left, and gone. Its
              sweep is what the matching bar below appears out of, so the two are
              timed against each other in the stylesheet.

              It exists *only* on the beat it plays on. Slidev hides inactive
              slides with `display: none`, which restarts CSS animations — so a
              lens that stayed in the DOM would sweep again every time you
              navigated back into this slide, whatever click you landed on.
            -->
            <div
              v-if="zoomsIn && clicks === 1"
              class="lens-sweep-a pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0"
            >
              <MagnifierLens color="#f7931a" rgb="247, 147, 26" />
            </div>
          </div>
        </div>
      </div>

      <div />

      <div class="pane-teal px-4 py-2.5">
        <div class="text-center text-base text-white font-semibold leading-none">Liquid</div>
        <div class="mt-1.5 flex justify-center">
          <div
            class="text-2xl transition-colors duration-500"
            :class="beat >= 1 ? 'i-ph-lock-simple-open-fill text-green' : 'i-ph-lock-simple-fill text-gold'"
          />
        </div>
        <div class="mt-1 text-center text-xs text-muted">
          claimable by <span class="text-gold">Alice</span>
        </div>
        <div class="mt-2.5 flex items-center gap-2">
          <div class="i-ph-clock-countdown-bold shrink-0 text-xs text-teal" />
          <div class="relative h-1.5 flex-1">
            <div class="absolute inset-0 overflow-hidden rounded-full bg-white/8">
              <div class="absolute inset-y-0 left-0 bg-teal/80" :style="{ width: `${bobEnd}%` }" />
              <div class="absolute inset-y-0 right-0"
                   :style="{ left: `${bobEnd}%`, backgroundImage: MINI_TEAL }" />
            </div>
            <div
              v-if="zoomsIn && clicks === 1"
              class="lens-sweep-b pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0"
            >
              <MagnifierLens color="#5db2a5" rgb="93, 178, 165" />
            </div>
          </div>
        </div>
      </div>

      <div class="h-24 flex justify-center"><div class="w-px border-l border-white/20 border-dashed" /></div>
      <div class="flex flex-col items-center gap-0.5 pt-0.5">
        <div class="i-ph-user-circle-fill text-2xl text-purple" />
        <div class="text-xs text-white leading-none">Bob</div>
      </div>

      <!--
        The coins, on the same track and the same percentages LedgerPair uses, so
        this reads as the canvas the audience already knows. Only the L-BTC moves
        here: the whole slide is about the window Alice's claim opens, and her own
        lockup is still sitting there for the rest of it.
      -->
      <div
        class="pointer-events-none absolute z-10 -translate-x-1/2 transition-all duration-700 delay-300 ease-in-out"
        :style="btcPos"
      >
        <AssetCoin chain="bitcoin" :size="26" />
      </div>
      <div
        class="pointer-events-none absolute z-10 -translate-x-1/2 transition-all duration-700 delay-300 ease-in-out"
        :style="lbtcPos"
      >
        <AssetCoin chain="liquid" :size="26" />
      </div>

      <!-- The key travels ahead of the coins, so a lock is always open before
           what it was holding leaves. -->
      <div
        class="pointer-events-none absolute z-20 -translate-x-1/2 transition-all duration-700 ease-in-out"
        :style="keyPos"
      >
        <div class="i-ph-key-fill text-xl text-gold drop-shadow-[0_0_10px_rgba(232,203,43,.9)]" />
      </div>
    </div>

    <!-- the bars, full size — each one appears as its own lens finishes crossing -->
    <div class="relative">

      <!-- Marks that the two windows expire at the same instant. Held back until
           the verdict lands, so the opening state is not pre-judged in red
           before anyone has been shown why it fails. -->
      <div
        v-if="equalWindows && beat >= 2"
        class="pointer-events-none absolute top-6 z-10 border-l-2 border-dashed border-red/70"
        :style="{ left: `${bobEnd}%`, height: '7.8rem' }"
      />

      <!-- Alice's lockup on top, matching the order of the boxes above. Both
           tracks are tinted like the chain they sit on, so a bar reads as the
           lockup directly above it rather than as a new object — which is why
           these labels can be this short. -->
      <div
        class="mb-4 transition-opacity duration-400"
        :class="shown ? 'opacity-100 delay-[1500ms]' : 'opacity-0 delay-0'"
      >
        <!-- The padlock is the state of this timelock: gold and shut while the
             claim window is open, and swinging open in the bar's own colour once
             the hatched refundable zone is where we are. -->
        <div class="mb-2 flex items-center gap-2">
          <div class="i-ph-clock-countdown-bold text-sm text-orange" />
          <span class="eyebrow text-orange">Alice's timelock</span>
          <div
            class="text-sm transition-colors duration-500"
            :class="aliceExpired ? 'i-ph-lock-simple-open-fill text-orange' : 'i-ph-lock-simple-fill text-gold'"
          />
        </div>
        <div class="relative h-9 rounded-xl bg-white/4">
          <div
            class="absolute inset-y-0 right-0 flex items-center justify-center overflow-hidden rounded-r-xl transition-all duration-700 ease-in-out"
            :style="{ left: `${aliceEnd}%`, backgroundImage: HATCH_ORANGE }"
          >
            <span class="whitespace-nowrap text-[0.65rem] text-orange/85 font-semibold">refundable zone</span>
          </div>
          <div
            class="absolute inset-y-0 left-0 border border-orange/50 rounded-xl bg-orange/25 transition-all duration-700 ease-in-out"
            :style="{ width: `${aliceEnd}%` }"
          />
          <div
            class="absolute inset-y-0 w-0.5 bg-orange transition-all duration-700 ease-in-out"
            :style="{ left: `${aliceEnd}%` }"
          />
          <div
            class="absolute -top-6 text-xs text-orange transition-all duration-700 ease-in-out"
            :style="{ left: `${aliceEnd}%`, transform: 'translateX(-50%)' }"
          >
            expiration
          </div>

          <!-- the window Bob has left once the preimage appears -->
          <div
            v-if="beat >= 2"
            class="absolute inset-y-0 flex items-center justify-center border-2 rounded-lg transition-all duration-700 ease-in-out"
            :class="safe ? 'bg-green/35 border-green/70' : 'bg-red/50 border-red'"
            :style="{ left: `${claimAt}%`, width: `${aliceEnd - claimAt}%` }"
          >
            <span v-if="safe && !bobClaims" class="text-xs text-green font-semibold">Bob's window</span>
          </div>
          <div
            v-if="beat >= 2 && !safe && !refunded"
            class="absolute top-3 text-xs text-red font-semibold"
            :style="{ left: `${aliceEnd + 2}%` }"
          >
            Bob's window
          </div>

          <!-- Alice refunding the moment she is allowed to. Same pin as her claim
               on Bob's bar, and the same gold — both are her, acting. -->
          <div
            v-if="refunded"
            class="absolute z-10 flex flex-col items-center -bottom-1.5 -top-2"
            :style="{ left: `${aliceEnd + 3}%`, transform: 'translateX(-50%)' }"
          >
            <div class="h-0 w-0 shrink-0" style="border-left:6px solid transparent;border-right:6px solid transparent;border-top:9px solid #e8cb2b;filter:drop-shadow(0 0 5px rgba(232,203,43,.9))" />
            <div class="w-0.5 flex-1 bg-gold" />
          </div>
          <!-- Above the bar, not in it: the hatched band has its own caption
               centred in it, and two labels sharing that space collided. -->
          <div
            v-if="refunded"
            class="absolute -top-6 whitespace-nowrap text-xs text-gold font-semibold"
            :style="{ left: `${aliceEnd + 5}%` }"
          >
            she refunds before Bob claims it
          </div>

          <!-- Bob getting in, on the run where the window is real -->
          <div
            v-if="bobClaims"
            class="absolute z-20 flex flex-col items-center -bottom-1.5 -top-2"
            :style="{ left: `${bobClaimAt}%`, transform: 'translateX(-50%)' }"
          >
            <div class="h-0 w-0 shrink-0" style="border-left:6px solid transparent;border-right:6px solid transparent;border-top:9px solid #6cc47f;filter:drop-shadow(0 0 5px rgba(108,196,127,.9))" />
            <div class="w-0.5 flex-1 bg-green" />
          </div>
          <div
            v-if="bobClaims"
            class="absolute top-2.5 text-xs text-green font-semibold"
            :style="{ left: `${bobClaimAt + 3}%` }"
          >
            Bob claims, in time
          </div>
        </div>
      </div>

      <!-- Bob's lockup — the one Alice claims, so the key lands here. The bottom
           margin is the room its claim caption needs: that caption is absolutely
           positioned under the mark, so it contributes no height of its own. -->
      <div
        class="mb-8 transition-opacity duration-400"
        :class="shown ? 'opacity-100 delay-[2600ms]' : 'opacity-0 delay-0'"
      >
        <div class="mb-2 flex items-center gap-2">
          <div class="i-ph-clock-countdown-bold text-sm text-teal" />
          <span class="eyebrow text-teal">Bob's timelock</span>
          <div
            class="text-sm transition-colors duration-500"
            :class="bobExpired ? 'i-ph-lock-simple-open-fill text-teal' : 'i-ph-lock-simple-fill text-gold'"
          />
        </div>
        <div class="relative h-9 rounded-xl bg-white/4">
          <div
            class="absolute inset-y-0 right-0 flex items-center justify-center overflow-hidden rounded-r-xl"
            :style="{ left: `${bobEnd}%`, backgroundImage: HATCH_TEAL }"
          >
            <span class="whitespace-nowrap text-[0.65rem] text-teal/85 font-semibold">refundable zone</span>
          </div>
          <div
            class="absolute inset-y-0 left-0 border border-teal/50 rounded-xl bg-teal/30"
            :style="{ width: `${bobEnd}%` }"
          />
          <div class="absolute inset-y-0 w-0.5 bg-teal" :style="{ left: `${bobEnd}%` }" />
          <div
            class="absolute -top-6 text-xs text-teal"
            :style="{ left: `${bobEnd}%`, transform: 'translateX(-50%)' }"
          >
            expiration
          </div>

          <!-- The instant Alice claims, as a pin rather than a key: the key
               itself lives with her in the header, and repeating it here made it
               look like a second one. -->
          <div
            v-if="beat >= 1"
            class="absolute z-10 flex flex-col items-center -bottom-1.5 -top-2"
            :style="{ left: `${claimAt}%`, transform: 'translateX(-50%)' }"
          >
            <div class="h-0 w-0 shrink-0" style="border-left:6px solid transparent;border-right:6px solid transparent;border-top:9px solid #e8cb2b;filter:drop-shadow(0 0 5px rgba(232,203,43,.9))" />
            <div class="w-0.5 flex-1 bg-gold" />
          </div>

          <!-- Under the mark it describes, not off at the left margin: the
               caption and the pin are one annotation. -->
          <div
            v-if="beat >= 1"
            class="absolute top-full mt-2.5 flex items-center gap-2 whitespace-nowrap text-sm text-gold"
            :style="{ left: `${claimAt}%`, transform: 'translateX(-50%)' }"
          >
            <div class="i-ph-broadcast-bold" />
            {{ claimCaption }}
          </div>
        </div>
      </div>
    </div>

    <!-- verdict -->
    <div class="mt-3 h-14">
      <Transition name="verdict" mode="out-in">
        <div
          v-if="beat >= 2"
          :key="`${safe}-${refunded}-${bobClaims}`"
          class="flex items-center gap-4 rounded-xl px-6 py-3"
          :class="safe ? 'pane-green' : 'pane-red'"
        >
          <div
            class="shrink-0 text-2xl"
            :class="safe ? 'i-ph-check-circle-fill text-green' : 'i-ph-x-circle-fill text-red'"
          />
          <div v-if="bobClaims" class="text-lg text-white">
            Bob got his side. <span class="text-green">The swap completes.</span>
          </div>
          <div v-else-if="safe" class="text-lg text-white">
            Now Bob has a real window to act in.
          </div>
          <div v-else-if="refunded" class="text-lg text-white">
            Alice is able to get her funds back. <span class="text-red">Bob is left with nothing.</span>
          </div>
          <div v-else class="text-lg text-white">
            Both expire at the same instant, so Bob has very little time to act.
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/*
 * The reveal, as one timed sequence off a single click:
 *
 *   0.0s  the lockups rise (transition, on the grid itself)
 *   0.7s  Alice's lens enters at the right of her bar and crosses to the left
 *   1.5s  her full-size bar fades in behind it, as the lens clears
 *   1.8s  Bob's lens does the same
 *   2.6s  his bar follows
 *
 * Right to left because the eye then finishes on the left, where the next bar
 * begins. `both` fill keeps each lens invisible before its delay and after its
 * pass, so a lens exists on screen only while it is actually sweeping.
 */
.lens-sweep-a { animation: lens-sweep .9s ease-in-out .7s both; }
.lens-sweep-b { animation: lens-sweep .9s ease-in-out 1.8s both; }

@keyframes lens-sweep {
  0% { opacity: 0; left: 100%; }
  14% { opacity: 1; }
  82% { opacity: 1; }
  100% { opacity: 0; left: 0%; }
}

.verdict-enter-active { transition: all .4s cubic-bezier(.2, .9, .3, 1.15); }
.verdict-leave-active { transition: all .2s ease-in; }
.verdict-enter-from { opacity: 0; transform: translateY(10px); }
.verdict-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
