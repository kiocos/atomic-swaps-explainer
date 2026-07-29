<script setup lang="ts">
/**
 * How a Boltz lockup address is built, and why one key holds two ways out.
 *
 * The shape follows the learnmeabitcoin Taproot figure, and so does the *argument*,
 * which is the important part:
 *
 *   1. the script tree is hashed down to a merkle root — one fingerprint for every
 *      scripted way the output can be unlocked
 *   2. that root is combined with the aggregate public key to make a tweaked key
 *   3. the tweaked key IS the locking script, and the address encodes it
 *   4. so both spending options are embedded in that single key: sign for it
 *      (key path), or reveal a leaf plus a merkle path proving it built the root
 *      (script path)
 *
 * An earlier version drew a container labelled "the locking script" with the two
 * paths *inside* it. That is backwards and was corrected: the locking script is the
 * tweaked key. The paths are ways to unlock it, which is why they hang **below**
 * the address card rather than above it. Do not put them back inside.
 *
 * The two inputs to the tweak are bottom-aligned so the merkle root and the
 * aggregate key sit at the same height, directly above the junction; their eyebrows
 * live in a separate grid row so they stay level regardless. Before that the key
 * card was top-aligned and its line appeared to start from empty space, which made
 * the figure look like one input rather than two.
 *
 * The junction is a `+` in a ring, captioned with **what comes out of it**: `one
 * tweaked public key`. Two earlier captions were wrong or vague and should not come
 * back. A bare `tweak` names the operation without saying what it produces. And
 * `tweaked into a single key` reads as if the product were the locking script —
 * it is not. The tweaked key is a 32-byte public key that gets *placed inside* the
 * locking script, which is the card below it: `OP_1 OP_PUSHBYTES_32 <tweaked key>`.
 * Keeping those two distinct is the whole reason the card and the junction are
 * separate nodes.
 *
 * A formula card, `Q = P + H(P ‖ root)·G`, was tried here too and cut: it made the
 * figure read as a derivation to follow rather than as a shape to take in.
 *
 * The leaves are reduced to a name and one plain line each. Their full opcodes are
 * on the taptree slide and re-reading them here costs the vertical space this slide
 * needs for the two spend paths, which are the payoff.
 *
 * Boltz's tree has exactly two leaves, so there is no intermediate branch: one
 * TapBranch over two TapLeaf hashes *is* the root. That is also why a control block
 * here carries a merkle path of a single hash.
 *
 * The maths still has to be said right, so it lives in the speaker notes: the tweak
 * is an **addition**, not a multiplication. The hash is a scalar, multiplied by the
 * generator to make a point, and that point is added to P (`xonlyTweakAdd` in
 * boltz-core). Addition is what keeps the key spendable — whoever can sign for P
 * can sign for Q by adding the same scalar. Do not let the notes lose that.
 */
withDefaults(defineProps<{ clicks?: number }>(), { clicks: 99 })

/**
 * Every stage fades rather than mounting, so the figure never changes height and a
 * later stage arriving cannot shove the tree upwards.
 *
 * The tree is on screen from click 0 — it is the taptree slide, not new
 * information. Three clicks: the key, the address they make, the two ways out.
 */
const at = (n: number, c: number) => (c >= n ? 'opacity-100' : 'opacity-0')

const fade = 'transition-opacity duration-400'

/**
 * Feet for the fans, as percentages of the element each <svg> spans.
 *
 *   TREE  — inside the left half, whose own `grid-cols-2 gap-3` puts the two leaf
 *           centres at 24 / 76.
 *   TWEAK — across the full width, whose `grid-cols-2 gap-10` puts the two column
 *           centres at 23 / 77.
 *   OUT   — the same 23 / 77, reversed: one source, two destinations.
 *
 * Re-derive all three if any gap or padding changes.
 */
const TREE = ['M24 0 L50 100', 'M76 0 L50 100']
const TWEAK = ['M23 0 L50 100', 'M77 0 L50 100']
const OUT = ['M50 0 L23 100', 'M50 0 L77 100']

const stroke = {
  fill: 'none',
  stroke: '#8a97a3',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'vector-effect': 'non-scaling-stroke',
}
</script>

<template>
  <div class="flex flex-col items-center">

    <!-- ── the two things the address is computed from ──────────────────── -->
    <div class="grid w-full grid-cols-2 gap-10">
      <div class="col-start-1 row-start-1 text-center"><span class="eyebrow text-cyan">script tree</span></div>
      <div class="col-start-2 row-start-1 text-center" :class="[fade, at(1, clicks)]">
        <span class="eyebrow text-gold">internal key</span>
      </div>

      <div class="col-start-1 row-start-2 mt-1.5 flex flex-col items-center">
        <div class="grid w-full grid-cols-2 gap-3">
          <div class="pane-green px-3 py-1.5 text-center">
            <div class="text-xs text-green font-semibold">hash lock leaf</div>
            <div class="mt-0.5 text-[0.62rem] text-muted">preimage + signature</div>
          </div>
          <div class="pane-cyan px-3 py-1.5 text-center">
            <div class="text-xs text-cyan font-semibold">time lock leaf</div>
            <div class="mt-0.5 text-[0.62rem] text-muted">block height + signature</div>
          </div>
        </div>
        <svg class="h-5 w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path v-for="(d, i) in TREE" :key="i" :d="d" v-bind="stroke" />
        </svg>
        <div class="pane flex items-center gap-2 px-4 py-1.5">
          <div class="i-ph-hash-bold text-base text-muted" />
          <div class="text-sm text-white">merkle root</div>
        </div>
      </div>

      <!-- bottom-aligned, so it meets the junction from the same height as the
           merkle root rather than trailing a line up into empty space -->
      <div class="col-start-2 row-start-2 mt-1.5 flex flex-col items-center justify-end"
           :class="[fade, at(1, clicks)]">
        <div class="pane-gold flex items-center gap-3 px-5 py-2.5">
          <MergedKey size="text-3xl" />
          <div class="text-left">
            <div class="text-sm text-white font-semibold leading-none">one aggregate key</div>
            <div class="mt-1.5 font-mono text-[0.62rem] text-muted leading-none">MuSig2(you, Boltz)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── combined into one key ────────────────────────────────────────── -->
    <div class="w-full" :class="[fade, at(2, clicks)]">
      <svg class="h-7 w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path v-for="(d, i) in TWEAK" :key="i" :d="d" v-bind="stroke" />
      </svg>
      <div class="-mt-3.5 flex flex-col items-center">
        <div class="pane-gold h-7 w-7 flex items-center justify-center rounded-full bg-bg">
          <div class="i-ph-plus-bold text-xs text-gold" />
        </div>
        <div class="mt-1 text-[0.6rem] text-muted">one tweaked public key</div>
      </div>
    </div>

    <!-- ── which is the locking script, and the address encodes it ──────── -->
    <div class="pane-gold mt-1.5 px-6 py-1.5 text-center" :class="[fade, at(2, clicks)]">
      <div class="eyebrow mb-0.5 text-gold">the locking script</div>
      <div class="font-mono text-sm text-white">OP_1 OP_PUSHBYTES_32 &lt;tweaked key&gt;</div>
      <div class="mt-0.5 font-mono text-[0.68rem] text-cyan tracking-wide">bc1p3 xampl … qsmzk 7v</div>
    </div>

    <!-- ── and both ways out are already inside it ──────────────────────── -->
    <div class="w-full" :class="[fade, at(3, clicks)]">
      <svg class="h-7 w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path v-for="(d, i) in OUT" :key="i" :d="d" v-bind="stroke" />
      </svg>
      <div class="grid grid-cols-2 gap-10">
        <!-- Script path left, key path right — the same order as the
             two-ways-to-spend slide, and the same order as the two inputs above:
             the script tree is on the left there too. -->
        <div class="pane-cyan px-4 py-1.5 text-center">
          <div class="text-sm text-cyan font-semibold">script path spend</div>
          <div class="mt-0.5 text-[0.62rem] text-muted">a leaf, and a path proving it is in the root</div>
        </div>
        <div class="pane-green px-4 py-1.5 text-center">
          <div class="text-sm text-green font-semibold">key path spend</div>
          <div class="mt-0.5 text-[0.62rem] text-muted">one signature, and nothing else</div>
        </div>
      </div>
    </div>

  </div>
</template>
