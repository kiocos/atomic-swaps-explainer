<script setup lang="ts">
/**
 * The canvas for the two-lockup story. The theory half runs Alice against Bob on
 * it; the walkthrough runs you against Boltz on the same component, so the shape
 * the audience learned in the first half is literally the shape they are shown
 * in the second.
 *
 * Every slide that renders it puts the two ledger boxes on the *exact* same
 * pixels, so nothing slides around as the argument develops. The zones are
 * fixed-height and always present, so filling one in later cannot push the
 * ledgers up or down:
 *
 *   #top     — whatever happens above the ledgers (the preimage → hash chain)
 *   #middle  — the fixed-width column between them (a caption)
 *   #bottom  — the verdict line
 */
import { computed } from 'vue'

type State = 'empty' | 'locked' | 'open' | 'refunded'

/**
 * The four places anything can be: with either party, or inside either lockup.
 * The key and the two assets all move between them, which is what makes the
 * argument watchable — every step is something physically going somewhere.
 */
type Spot = 'alice' | 'lockupA' | 'lockupB' | 'bob'

const props = withDefaults(
  defineProps<{
    leftPerson?: string
    rightPerson?: string
    /** `boltz` swaps the generic avatar for the circular brand mark. */
    leftAvatar?: 'person' | 'boltz'
    rightAvatar?: 'person' | 'boltz'
    leftTitle?: string
    rightTitle?: string
    leftChain?: 'bitcoin' | 'liquid' | 'a' | 'b'
    rightChain?: 'bitcoin' | 'liquid' | 'a' | 'b'
    leftState?: State
    rightState?: State
    leftNote?: string
    rightNote?: string
    /** Who each lockup pays out to. Omit to drop the line. */
    leftBeneficiary?: string
    rightBeneficiary?: string
    /** The asset each lockup holds, and where it currently sits. */
    leftAsset?: 'bitcoin' | 'liquid' | null
    rightAsset?: 'bitcoin' | 'liquid' | null
    leftAssetAt?: Spot
    rightAssetAt?: Spot
    /** Assets only exist once something has been funded. */
    showAssets?: boolean
    /** The travelling key — the preimage. */
    keyAt?: Spot | null
    /**
     * Two more travelling glyphs, drawn as MuSig2 aggregates rather than as the
     * preimage, and named for the party they *belong to* rather than where they
     * end up — the left party's key crosses the whole canvas to open the right
     * lockup, and vice versa. Used by the cooperative-claim slide; omit them and
     * nothing changes for the canvas slides in the theory half.
     */
    leftAggKeyAt?: Spot | null
    rightAggKeyAt?: Spot | null
  }>(),
  {
    leftPerson: '', rightPerson: '',
    leftAvatar: 'person', rightAvatar: 'person',
    leftTitle: 'Ledger A', rightTitle: 'Ledger B',
    leftChain: 'a', rightChain: 'b',
    leftState: 'empty', rightState: 'empty', leftNote: '', rightNote: '',
    leftBeneficiary: '', rightBeneficiary: '',
    leftAsset: null, rightAsset: null, leftAssetAt: 'lockupA', rightAssetAt: 'lockupB',
    showAssets: false, keyAt: null, leftAggKeyAt: null, rightAggKeyAt: null,
  },
)

/**
 * Percentages across the ledger row, derived from the grid template below —
 * 4rem | 1.75rem | 1fr | 9rem | 1fr | 1.75rem | 4rem over a 871px row. The two
 * narrow columns are the chain boundaries, drawn as dashed rules: a coin
 * *crossing* one is the moment it stops being locked in a contract and starts
 * being somebody's money. Re-derive every number here if that template changes.
 */
const SPOT: Record<Spot, number> = { alice: 3.7, lockupA: 26.15, lockupB: 73.85, bob: 96.3 }

/**
 * Inside a lockup the asset sits left of the padlock and the key right of it,
 * far enough out to clear it — the padlock is 36px on a 272px box, so anything
 * closer than about 6% of the row overlaps it.
 */
const ASSET_INSET = -6
const KEY_INSET = 6
const inLockup = (s: Spot) => s === 'lockupA' || s === 'lockupB'

/**
 * Two heights, not one. Inside a lockup, things ride level with the padlock;
 * beside a person they drop below the avatar, which would otherwise be sitting
 * exactly where an arriving coin lands. Both are transitioned, so a claimed coin
 * slides out of its box and settles by its new owner in one movement.
 */
const KEY_TOP = { lockup: '40px', person: '78px' }
const ASSET_TOP = { lockup: '43px', person: '82px' }

/** Shared by the preimage key and the two aggregate keys — same track, same insets. */
const keyPos = (at: Spot | null) => ({
  left: at ? `${SPOT[at] + (inLockup(at) ? KEY_INSET : 0)}%` : '50%',
  top: KEY_TOP[at && inLockup(at) ? 'lockup' : 'person'],
})

const keyLeft = computed(() => keyPos(props.keyAt).left)
const keyTop = computed(() => keyPos(props.keyAt).top)

/**
 * Both coins land on the same person whenever a swap goes wrong — one side
 * claimed, the other taken back, both to them. Side by side needs only a nudge
 * now that an asset is a bare mark rather than a labelled chip.
 */
const stacked = computed(() => props.leftAssetAt === props.rightAssetAt)
const assetLeft = (at: Spot, nudge: number) =>
  `${SPOT[at] + (inLockup(at) ? ASSET_INSET : stacked.value ? nudge : 0)}%`
const assetTop = (at: Spot) => ASSET_TOP[inLockup(at) ? 'lockup' : 'person']
</script>

<template>
  <div class="flex flex-col items-center">

    <!-- reserved, so the preimage block does not displace the ledgers -->
    <div class="h-30 w-full flex flex-col items-center justify-end">
      <slot name="top" />
    </div>

    <div class="relative mt-3 grid w-full grid-cols-[4rem_1.75rem_1fr_9rem_1fr_1.75rem_4rem] items-start">
      <!--
        The two parties. Aligned to the top of the row so the track below them —
        where the key and the coins travel — stays clear of the avatar.
      -->
      <div class="flex flex-col items-center gap-1 self-start pt-1">
        <template v-if="leftPerson">
          <img v-if="leftAvatar === 'boltz'" src="/brand/boltz-logo-circle-transparent.svg" alt="" class="h-9 w-9">
          <div v-else class="i-ph-user-circle-fill text-4xl text-gold" />
          <div class="text-sm text-white leading-none">{{ leftPerson }}</div>
        </template>
      </div>

      <div class="h-full flex justify-center"><div class="w-px border-l border-white/20 border-dashed" /></div>

      <Lockup
        compact reserve-note :show-mark="false"
        :chain="leftChain" :title="leftTitle"
        :state="leftState" :note="leftNote"
        :beneficiary="leftBeneficiary" beneficiary-accent="text-purple"
      />

      <div class="flex flex-col items-center justify-start px-2 pt-9">
        <slot name="middle" />
      </div>

      <Lockup
        compact reserve-note :show-mark="false"
        :chain="rightChain" :title="rightTitle"
        :state="rightState" :note="rightNote"
        :beneficiary="rightBeneficiary" beneficiary-accent="text-gold"
      />

      <div class="h-full flex justify-center"><div class="w-px border-l border-white/20 border-dashed" /></div>

      <div class="flex flex-col items-center gap-1 self-start pt-1">
        <template v-if="rightPerson">
          <img v-if="rightAvatar === 'boltz'" src="/brand/boltz-logo-circle-transparent.svg" alt="" class="h-9 w-9">
          <div v-else class="i-ph-user-circle-fill text-4xl text-purple" />
          <div class="text-sm text-white leading-none">{{ rightPerson }}</div>
        </template>
      </div>

      <!--
        Everything that moves is absolutely positioned on one track level with
        the padlocks, so it can never disturb the pinned layout. The coins carry
        a travel delay: the key reaches a lock first, and only then does what it
        unlocked come out — which is both the right order and the thing that
        keeps the two from sliding through each other mid-canvas.
      -->
      <Transition name="key-in">
        <div
          v-if="keyAt"
          class="key-drop pointer-events-none absolute z-20 -translate-x-1/2 transition-[left,top] duration-700 ease-in-out"
          :style="{ left: keyLeft, top: keyTop }"
        >
          <div class="i-ph-key-fill text-4xl text-gold drop-shadow-[0_0_14px_rgba(232,203,43,.9)]" />
        </div>
      </Transition>

      <!--
        The two aggregate keys. No `.key-drop` on these: that animation exists for a
        slide that *arrives* with a key already placed, and these are always mounted
        by a click, so the enter transition is what plays.
      -->
      <Transition name="key-in">
        <div
          v-if="leftAggKeyAt"
          class="pointer-events-none absolute z-20 -translate-x-1/2 transition-[left,top] duration-700 ease-in-out"
          :style="keyPos(leftAggKeyAt)"
        >
          <MergedKey size="text-4xl" />
        </div>
      </Transition>
      <Transition name="key-in">
        <div
          v-if="rightAggKeyAt"
          class="pointer-events-none absolute z-20 -translate-x-1/2 transition-[left,top] duration-700 ease-in-out"
          :style="keyPos(rightAggKeyAt)"
        >
          <MergedKey size="text-4xl" />
        </div>
      </Transition>

      <div
        v-if="leftAsset"
        class="pointer-events-none absolute z-10 -translate-x-1/2 transition-all duration-700 delay-700 ease-in-out"
        :class="showAssets ? 'opacity-100' : 'opacity-0'"
        :style="{ left: assetLeft(leftAssetAt, -2.2), top: assetTop(leftAssetAt) }"
      >
        <AssetCoin :chain="leftAsset" />
      </div>
      <div
        v-if="rightAsset"
        class="pointer-events-none absolute z-10 -translate-x-1/2 transition-all duration-700 delay-700 ease-in-out"
        :class="showAssets ? 'opacity-100' : 'opacity-0'"
        :style="{ left: assetLeft(rightAssetAt, 2.2), top: assetTop(rightAssetAt) }"
      >
        <AssetCoin :chain="rightAsset" />
      </div>
    </div>

    <div class="mt-4 h-14 w-full flex items-start justify-center text-center">
      <slot name="bottom" />
    </div>

  </div>
</template>

<style scoped>
/* the key fades in where it first appears, then slides on `left` from there */
.key-in-enter-active { transition: opacity .35s ease, transform .35s cubic-bezier(.2, .9, .3, 1.2); }
.key-in-enter-from { opacity: 0; transform: translate(-50%, .5rem) scale(.6); }

/*
 * And fades out again, for the one slide that takes the key away — the refund
 * path never uses it, and leaving it beside Alice would collide with the coin
 * coming back to her. Without this the removal is instant, which reads as a
 * glitch rather than as the key going unused.
 */
.key-in-leave-active { transition: opacity .3s ease, transform .3s ease; }
.key-in-leave-to { opacity: 0; transform: translate(-50%, .35rem) scale(.8); }

/*
 * A slide that mounts with the key already placed never runs the transition
 * above — and `appear` is no help either, because Slidev keeps every slide in
 * the DOM from page load and merely hides the inactive ones. It hides them with
 * `display: none`, though, which restarts CSS animations. So the pop is an
 * animation rather than a transition: it replays each time the slide is shown,
 * which is what makes the key read as the new thing on an otherwise identical
 * picture.
 *
 * Keyframes carry the -50% themselves, or they would cancel the centring
 * `-translate-x-1/2` for the duration of the animation.
 */
.key-drop { animation: key-drop .4s cubic-bezier(.2, .9, .3, 1.2) both; }

@keyframes key-drop {
  from { opacity: 0; transform: translate(-50%, .5rem) scale(.6); }
  to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
</style>
