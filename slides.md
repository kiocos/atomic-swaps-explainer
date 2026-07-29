---
theme: default
title: Atomic Swaps
info: Across two chains, without trusting the counterparty. BitDevs Santiago.
author: BitDevs Santiago
class: text-left
drawings:
  persist: false
transition: fade
mdc: true
fonts:
  sans: Noto Sans
  mono: Noto Sans Mono
layout: cover
---

<div class="flex flex-col items-center text-center">

<img src="/brand/boltz-logo-circle-transparent.svg" alt="Boltz"
     v-motion :initial="{ opacity: 0, scale: 0.82 }"
     :enter="{ opacity: 1, scale: 1, transition: { duration: 700 } }"
     class="w-44 h-44 drop-shadow-[0_0_60px_rgba(232,203,43,0.28)]">

# Atomic Swaps

<div class="mt-3 text-xl text-body/80">Across two chains, without trusting the counterparty</div>

<div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"
     class="mt-14 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-muted">
  <div class="i-ph-lightning-fill text-gold" />
  BitDevs Santiago
</div>

</div>

<!--
Tonight's subject is atomic swaps: how two parties trade across two different ledgers without
either one trusting the other.

Boltz is the worked example, because it is in production and all of its code and documentation are
public — so you can check anything I say tonight. But the aim is that by the end you can apply the
same reasoning to any swap system, including ones that do not exist yet.

No Lightning, Taproot or Bitcoin Script background assumed.
-->

---
clicks: 3
---

# Why do we need atomic swaps?

<div class="mt-3 text-lg text-muted">
  Suppose Alice and Bob want to trade coins.
</div>

<div class="mx-auto mt-9 grid max-w-2xl grid-cols-[1fr_6rem_1fr] items-stretch">

  <div class="pane flex items-center justify-center gap-4 px-4 py-3">
    <div class="flex items-center gap-2">
      <div class="i-ph-user-circle-fill text-2xl text-gold" />
      <div class="text-base text-white font-semibold">Alice</div>
    </div>
    <div class="h-11 w-px bg-white/12" />
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-sm text-muted"><span class="w-12">has</span><AssetCoin chain="bitcoin" :size="22" /></div>
      <div class="flex items-center gap-2 text-sm text-muted"><span class="w-12">wants</span><AssetCoin chain="liquid" :size="22" /></div>
    </div>
  </div>

  <!-- The gap is the whole problem, so it is drawn rather than described — and
       the two arrows are the failure itself, shown rather than asserted: one
       payment crosses, and nothing comes back the other way. -->
  <div class="relative flex flex-col items-center justify-center gap-2">
    <div class="absolute inset-y-0 w-px border-l-2 border-white/15 border-dashed" />
    <div v-click="2" class="relative z-10 flex items-center gap-1 rounded-md bg-bg px-1.5 py-0.5">
      <AssetCoin chain="bitcoin" :size="17" />
      <div class="i-ph-arrow-right-bold text-sm text-gold" />
    </div>
    <div v-click="3" class="relative z-10 flex items-center gap-1 rounded-md bg-bg px-1.5 py-0.5">
      <div class="i-ph-arrow-left-bold text-sm text-red/40" />
      <div class="i-ph-x-bold text-xs text-red" />
    </div>
  </div>

  <div class="pane flex items-center justify-center gap-4 px-4 py-3">
    <div class="flex items-center gap-2">
      <div class="i-ph-user-circle-fill text-2xl text-purple" />
      <div class="text-base text-white font-semibold">Bob</div>
    </div>
    <div class="h-11 w-px bg-white/12" />
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-sm text-muted"><span class="w-12">has</span><AssetCoin chain="liquid" :size="22" /></div>
      <div class="flex items-center gap-2 text-sm text-muted"><span class="w-12">wants</span><AssetCoin chain="bitcoin" :size="22" /></div>
    </div>
  </div>

</div>

<div v-click="1" class="mt-9 flex justify-center">
  <span class="chip-cyan !text-sm !px-4 !py-1.5"><span class="i-ph-database-duotone" /> no shared state</span>
</div>

<div v-click="3" class="pane-red mx-auto mt-7 flex max-w-2xl items-center gap-4 px-6 py-3">
  <div class="i-ph-x-circle-fill shrink-0 text-2xl text-red" />
  <div class="text-lg text-white">Whoever goes first can simply not be paid back.</div>
</div>

<!--
Here is the whole problem, before any machinery.

Alice has bitcoin and wants L-BTC. Bob has L-BTC and wants bitcoin. Straightforward trade — except
that these are two different ledgers.

[click] They share nothing. Neither chain can see the other's transactions, and there is no moment
at which both payments can be made to happen together — no common clock to schedule them by, and no
undo if one of them goes through and the other does not.

[click] Which means one of them goes first. Say it is Alice. Her bitcoin crosses.

[click] And then nothing comes back. That is the trap: whoever goes first has handed over their
money and is now relying on the other side to be honest. It is not a Bitcoin problem — it is true of
any two independent ledgers.

So the honest options, before tonight's material, are two: one of them trusts the other, or they
both hand their coins to a custodian and trust them instead. The second is the one exchanges sell,
and it is not a solution — it is the same trust with a nicer interface.

That is the question in the title, answered. Everything in the first half of this talk is one way
out of this slide.
-->

---
layout: section
---

# Theory

<div class="mt-3 text-muted">How atomic swaps work, in general</div>

<!--
First half. Nothing in it is specific to Boltz, or even to Bitcoin — it is the reasoning you could
apply to any two ledgers. The second half is one production system doing exactly this.
-->

---
layout: section
---

# HTLC

<div class="mt-3 text-muted">Hash Time Lock Contract</div>

<!--
The answer has a name, and the name is the recipe. Three words, and each one is a slide.
-->

---
clicks: 3
---

# Same concept, applied to different scenarios

<div class="mt-10 flex flex-col gap-12">

  <div v-click="1">
    <div class="eyebrow mb-4 text-gold">a Lightning payment</div>
    <HtlcHops :nodes="[
      { label: 'Alice', icon: 'i-ph-lightning-fill' },
      { label: 'Bob', icon: 'i-ph-lightning-fill' },
      { label: 'Carol', icon: 'i-ph-lightning-fill' },
    ]" />
  </div>

  <div v-click="2">
    <div class="eyebrow mb-4 text-cyan">a swap</div>
    <HtlcHops :nodes="[
      { label: 'Alice', icon: 'i-ph-lightning-fill' },
      { label: 'Boltz', mark: 'boltz' },
      { label: 'On-chain', mark: 'bitcoin' },
    ]" />
  </div>

</div>

<div v-click="3" class="mt-11 text-center text-xl text-white">
  Get the HTLC right and the <span class="text-gold">endpoints</span> become interchangeable.
</div>

<!--
Anyone here who has used Lightning has already used the thing this talk is about.

[click] A Lightning payment does not travel as one payment. Alice does not pay Carol — Alice sets up
a contract with Bob, and Bob sets up a contract with Carol. Each hop is an HTLC. Nobody along the
route has to trust anybody else, and none of them can run off with the money in transit.

[click] A swap is the same shape. One hop is on Lightning, the other is on-chain, and the party in
the middle is a service rather than a routing node. But the contract is the same contract.

[click] So the endpoints changed and the mechanism did not. That is the whole reason this
generalises: get the HTLC right and you can put almost anything on either end of it.

Worth saying out loud, since the audience is not assumed to know Lightning: everything from here on
works without any Lightning knowledge. I am only pointing at it because a lot of you have already
trusted this machinery with real money.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-lock-key-duotone text-6xl text-gold" /></div>

# An HTLC in a swap

<div class="mt-4 text-xl text-muted">
  Two lockups, on two chains that cannot see each other
</div>

<!--
So let us build one. Two people, two chains, and nothing shared between them — the situation from
the opening slide, now with the tool we are allowed to use.

Everything for the rest of this half happens on one picture, which fills in as we go.
-->

---
clicks: 3
# the next slide opens in this one's exact final state, so a cross-fade would
# wash the whole picture out to show nothing new. Read from the slide being
# left in both directions (Slidev logic/transition.ts), so this governs the hop
# to the claim slide only; every other hop keeps the deck-wide fade.
transition: none
---

<HtlcTitle active="hash" />

<LedgerPair
  left-person="Alice" right-person="Bob"
  left-title="Bitcoin" left-chain="bitcoin" left-beneficiary="Bob"
  right-title="Liquid" right-chain="liquid" right-beneficiary="Alice"
  left-asset="bitcoin" right-asset="liquid"
  :show-assets="$clicks >= 3"
  :key-at="$clicks >= 1 ? 'alice' : null"
  :left-state="$clicks >= 3 ? 'locked' : 'empty'"
  :right-state="$clicks >= 3 ? 'locked' : 'empty'">

  <template #top>
    <div v-click="1" class="flex items-center gap-2">
      <div class="i-ph-key-fill text-2xl text-gold" />
      <span class="text-base text-white">preimage</span>
      <span class="text-xs text-muted">— a random value Alice picks, and only she has</span>
    </div>
    <div v-click="2" class="flex flex-col items-center">
      <div class="i-ph-arrow-down-bold text-xs text-muted/50" />
      <div class="text-xs text-muted">hashed</div>
      <div class="chip-gold mt-0.5 !text-xs !px-3 !py-1"><span class="i-ph-lock-simple-fill" /> preimage hash</div>
    </div>
    <!-- Branches the one hash down into both boxes. Width is tuned to land on
         the two box centres — see the grid template in LedgerPair. This is the
         slide's actual claim, drawn rather than asserted. -->
    <div v-click="3" class="mt-1 h-6 w-[51%] border-gold/30 rounded-t-lg border-x-2 border-t-2" />
  </template>

  <template #middle>
    <div v-click="3" class="text-center text-xs text-gold leading-tight">
      the same<br>hash lock<br>on both sides
    </div>
  </template>

</LedgerPair>

<!--
Alice has bitcoin, Bob has L-BTC, and each wants what the other is holding. Same picture as the
opening slide — this is now how we fix it.

[click] Alice picks a random value. It is called the preimage. Think of it as a key. Nobody else
has it, and that matters for the whole rest of the talk.

[click] She hashes it. The hash acts as a padlock. Publishing the padlock is safe — it gives away
nothing about the key.

[click] Now both of them fund a lockup, and both lockups are built around that same preimage hash.
Watch the coins: Alice's bitcoin goes into a lockup on Bitcoin that Bob can claim, and Bob's L-BTC
goes into a lockup on Liquid that Alice can claim.

The same hash on both sides. Note what has *not* happened: neither of them has handed anything to
the other, and neither has handed anything to a third party. The coins are on their own chains, in
a contract.
-->

---
clicks: 3
---

<HtlcTitle active="hash" />

<LedgerPair
  left-person="Alice" right-person="Bob"
  left-title="Bitcoin" left-chain="bitcoin" left-beneficiary="Bob"
  right-title="Liquid" right-chain="liquid" right-beneficiary="Alice"
  left-asset="bitcoin" right-asset="liquid" show-assets
  :left-asset-at="$clicks >= 3 ? 'bob' : 'lockupA'"
  :right-asset-at="$clicks >= 1 ? 'alice' : 'lockupB'"
  :key-at="$clicks >= 3 ? 'lockupA' : $clicks >= 2 ? 'bob' : $clicks >= 1 ? 'lockupB' : 'alice'"
  :left-state="$clicks >= 3 ? 'open' : 'locked'"
  :right-state="$clicks >= 1 ? 'open' : 'locked'"
  :left-note="$clicks >= 3 ? 'Bob took it' : ''"
  :right-note="$clicks >= 1 ? 'Alice took it' : ''">

  <!-- This slide opens in the previous one's exact final state — same labels,
       same preimage chain, same caption, same coins in the same lockups, with
       the key still beside Alice. Nothing changes on the cut, and the previous
       slide carries `transition: none` so the picture visibly holds still.
       Everything after that happens on a click. -->
  <template #top>
    <div class="flex items-center gap-2">
      <div class="i-ph-key-fill text-2xl text-gold" />
      <span class="text-base text-white">preimage</span>
      <span class="text-xs text-muted">— a random value Alice picks, and only she has</span>
    </div>
    <div class="flex flex-col items-center">
      <div class="i-ph-arrow-down-bold text-xs text-muted/50" />
      <div class="text-xs text-muted">hashed</div>
      <div class="chip-gold mt-0.5 !text-xs !px-3 !py-1"><span class="i-ph-lock-simple-fill" /> preimage hash</div>
    </div>
    <div class="mt-1 h-6 w-[51%] border-gold/30 rounded-t-lg border-x-2 border-t-2" />
  </template>

  <!-- The caption has done its job by now, and the middle column is where the
       travelling key needs the room. It is still on screen when the slide opens,
       so the cut stays continuous, and clears itself on arrival — opacity only,
       so nothing around it moves. -->
  <template #middle>
    <div class="fade-out-on-reveal text-center text-xs text-gold leading-tight">
      the same<br>hash lock<br>on both sides
    </div>
  </template>

  <!-- Two lines in the same place, cross-faded rather than stacked: the zone
       height never changes, and the second reads as a consequence of the first
       rather than as a second item on a list. -->
  <template #bottom>
    <div class="relative w-full">
      <div class="absolute inset-x-0 flex justify-center transition-opacity duration-500"
           :class="$clicks === 1 ? 'opacity-100' : 'opacity-0'">
        <span class="chip-gold !text-sm !px-4 !py-1.5">
          <span class="i-ph-broadcast-bold" /> to claim, she had to publish the key
        </span>
      </div>
      <div class="absolute inset-x-0 flex justify-center transition-opacity duration-500"
           :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'">
        <span class="chip-gold !text-sm !px-4 !py-1.5">
          <span class="i-ph-key-fill" /> so Bob can use the same key to claim the BTC
        </span>
      </div>
    </div>
  </template>

</LedgerPair>

<!--
Same picture. Both lockups funded, the same hash on both, and the key still sitting with Alice —
she is the only person who can open either of them right now. Watch where it goes.

[click] She uses it on Bob's lockup, on Liquid, and that side opens. The L-BTC is hers.

And here is the part that makes the whole thing work. To satisfy that lock her transaction has to
*contain* the preimage — otherwise the network has no way to check it. So the key is now written
onto the Liquid chain, in public, for anyone to read.

That is not a leak and it is not a bug. It is the mechanism.

[click] Because the person it matters to is Bob. He reads the key off the chain, and it is the same
key — the one that opens the lockup on Bitcoin. This is how one fact crosses between two ledgers
that have no way to talk to each other: Alice cannot take her side without handing Bob what he needs
to take his.

[click] So he does. The bitcoin is his.

That is what "atomic" means here. Not that the two happen at the same moment — they plainly do not.
It means the first one *enables* the second. And notice both coins have now changed sides, with no
escrow and no third party anywhere in the picture.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-question-mark-bold text-6xl text-red" /></div>

# So what stops Alice?

<div class="mt-4 text-xl text-muted">
  She holds the key. What keeps her from ending up with <span class="text-white">both</span> sides?
</div>

<!--
Hold on, though. Look at the position Alice is in.

She picked the preimage. She is the only one who has it, and she chooses when — and whether — to
use it. Bob has funded a lockup and is now waiting on a decision that is entirely hers.

So ask the obvious question. What actually stops her from ending up with both?

Do not answer it yet. Let the room sit with it — and if someone shouts the answer, that is fine,
the next slide is the picture of what goes wrong.

One thing to head off if it comes up: she cannot simply claim both lockups. Her own lockup pays out
to Bob and needs *his* signature, not just the key — we will see that in the actual script shortly.
The problem is subtler than theft, and worse, because it needs no dishonesty at all. Only patience.
-->

---
clicks: 3
---

<HtlcTitle active="hash" />

<LedgerPair
  left-person="Alice" right-person="Bob"
  left-title="Bitcoin" left-chain="bitcoin" left-beneficiary="Bob"
  right-title="Liquid" right-chain="liquid" right-beneficiary="Alice"
  left-asset="bitcoin" right-asset="liquid" show-assets
  :left-asset-at="$clicks >= 2 ? 'alice' : 'lockupA'"
  :right-asset-at="$clicks >= 1 ? 'alice' : 'lockupB'"
  :key-at="$clicks >= 2 ? 'lockupA' : $clicks >= 1 ? 'lockupB' : 'alice'"
  :left-state="$clicks >= 2 ? 'open' : 'locked'"
  :right-state="$clicks >= 1 ? 'open' : 'locked'"
  :left-note="$clicks >= 2 ? 'Alice took it too' : ''"
  :right-note="$clicks >= 1 ? 'Alice took it' : ''">

  <template #middle>
    <div v-click="2" class="flex flex-col items-center gap-1 text-center text-xs text-red leading-tight">
      <div class="i-ph-arrows-left-right-bold text-xl" />
      and straight<br>back for<br>her own
    </div>
  </template>

  <template #bottom>
    <div v-click="3" class="pane-red flex items-center gap-4 px-6 py-3">
      <div class="i-ph-x-circle-fill shrink-0 text-2xl text-red" />
      <div class="text-lg text-white">Alice has both. Bob has <span class="text-red">nothing</span>.</div>
    </div>
  </template>

</LedgerPair>

<!--
Here is the version of the answer most people reach for first.

[click] Alice claims Bob's lockup, exactly as before. The L-BTC crosses over and is hers.

[click] And then she just turns round and takes her own back too. She has the key, after all — so
why would anything stop her using it twice?

[click] Alice has both coins. Bob has nothing.

Now — hold that picture, because it is wrong, and the next slide is about exactly why.

Do not explain it here. Let them look at it for a second and let it seem reasonable. She has the
key; why would anything stop her using it twice? That is the intuition worth taking seriously
before taking it apart.
-->

---
clicks: 4
---

# Every claim needs the other side's key

<div v-click="1" class="mt-5 flex items-center justify-center gap-3">
  <span class="text-sm text-muted">Alice holds</span>
  <span class="chip-gold"><span class="i-ph-key-fill" /> the preimage</span>
  <span class="chip-gold"><span class="i-ph-key-fill" /> her own key</span>
  <span class="text-sm text-muted">— and nothing of Bob's</span>
</div>

<div class="mt-6 grid grid-cols-2 gap-7">

  <!-- her own lockup: the one she cannot touch -->
  <div class="pane-orange px-6 py-5 transition-all duration-500"
       :class="[$clicks >= 3 ? 'shake-once !border-red/60' : '', $clicks >= 3 ? 'opacity-100' : 'opacity-90']">
    <div class="flex items-center gap-2.5">
      <ChainIcon chain="bitcoin" :size="22" />
      <span class="text-white font-semibold">Alice's lockup</span>
    </div>
    <div class="eyebrow mt-3.5">to claim it you need</div>
    <div class="mt-2.5 space-y-2">
      <div class="flex items-center gap-2.5 text-sm">
        <div class="i-ph-key-fill shrink-0 text-gold" />
        <span class="text-body">the preimage</span>
        <div v-click="3" class="i-ph-check-circle-fill ml-auto text-green" />
      </div>
      <div class="flex items-center gap-2.5 text-sm">
        <div class="i-ph-key-fill shrink-0 text-purple" />
        <span class="text-body">Bob's key</span>
        <div v-click="3" class="i-ph-x-circle-fill ml-auto text-red" />
      </div>
    </div>
    <div v-click="3" class="mt-4 text-center text-sm text-red font-semibold">Alice cannot claim this</div>
  </div>

  <!-- Bob's lockup: the one she can -->
  <div class="pane-teal px-6 py-5">
    <div class="flex items-center gap-2.5">
      <ChainIcon chain="liquid" :size="22" />
      <span class="text-white font-semibold">Bob's lockup</span>
    </div>
    <div class="eyebrow mt-3.5">to claim it you need</div>
    <div class="mt-2.5 space-y-2">
      <div class="flex items-center gap-2.5 text-sm">
        <div class="i-ph-key-fill shrink-0 text-gold" />
        <span class="text-body">the preimage</span>
        <div v-click="2" class="i-ph-check-circle-fill ml-auto text-green" />
      </div>
      <div class="flex items-center gap-2.5 text-sm">
        <div class="i-ph-key-fill shrink-0 text-gold" />
        <span class="text-body">Alice's key</span>
        <div v-click="2" class="i-ph-check-circle-fill ml-auto text-green" />
      </div>
    </div>
    <div v-click="2" class="mt-4 text-center text-sm text-green font-semibold">Alice can claim this</div>
  </div>

</div>

<div v-click="4" class="mt-6 text-center text-xl text-white">
  Each lockup pays out to <span class="text-gold">the other side</span>, and only they can sign for it
</div>

<!--
So here is why the previous slide cannot happen, and it is worth being precise because the reason is
the thing people miss.

Every claim path in an HTLC needs two things: the preimage, *and* a signature from whoever that
lockup pays out to. Not just the preimage. We will see it written out in the script shortly — the
claim leaf ends in a CHECKSIG.

[click] Alice has two things. She has the preimage, because she picked it. And she has her own key.
That is all. She has nothing of Bob's, and she never did.

[click] So Bob's lockup, on Liquid, she can take. It pays out to her, so it wants her signature, and
she has it. That is the claim we watched happen.

[click] But her own lockup pays out to *Bob*. Claiming it needs Bob's key, and Alice cannot produce
Bob's signature any more than she could forge his handwriting. This path is simply shut to her. She
can hold the preimage all day and it does not help.

[click] Which is the rule underneath both: each lockup pays out to the other side, and only that
side can sign for it. That is what stops the greedy version.

And now the honest problem appears — because if Alice cannot claim her own lockup, and Bob has not
claimed it either, then her money is sitting in a contract that nobody can currently open.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-question-mark-bold text-6xl text-cyan" /></div>

# So how could Alice get her money back, if she needed to?

<div class="mt-4 text-xl text-muted">
  Her own lockup pays out to Bob — and Bob may never come.
</div>

<!--
Which leaves the question this half of the talk has been building to without saying so.

Alice has funded a lockup. She cannot claim it — it pays out to Bob. And suppose Bob never funds his
side at all, or funds it and then vanishes, or his node dies, or he simply changes his mind. Nothing
in what we have built so far obliges him to do anything.

So her money sits in an output that she cannot open and he has no reason to.

That is not a theoretical worry, and it is not about anybody being dishonest. Half of all swaps that
fail, fail because one side went away. If the contract has no answer to this, then "non-custodial"
just means "your money is stuck instead of stolen", which is not much of an improvement.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-clock-countdown-duotone text-6xl text-gold" /></div>

# Enter the time lock

<div class="mt-4 text-xl text-muted">
  Every HTLC has a timelock. This ensures each party has enough time to get their funds.
</div>

<!--
Every lockup we have drawn already has one, and it has to: without a deadline, a swap that stalls
leaves both sides locked forever, with no way for anyone to get their own money back. So the refund
path is not optional.

That is the T in HTLC. And you have just watched why it is not enough on its own to write "and
there is a deadline" on both sides and call it done.

The two deadlines are the last free variable in the design, and getting their order wrong is
exactly the failure on the previous slide.
-->

---
clicks: 4
---

<HtlcTitle active="time" />

<DeadlineTimeline class="mt-3" lockups :clicks="$clicks" />

<!--
Back to the two lockups, and this time look at the small bar inside each one. That is its timelock —
the deadline the last slide just introduced. Both have one, and right now both are set to the same
length: symmetric, fair, and what anybody would reach for first.

[click] Blow those two bars up onto a single shared clock, because the whole question is how they
relate to each other, and you cannot see that inside two separate boxes.

Each bar is the window in which that lockup can still be claimed. Past the expiration is the hatched
part: that is not dead time, it is when the owner can take their own funds back. Alice claims first —
she is the only one with the key — so Bob can only ever act after her.

[click] And Alice is not obliged to be prompt. Assume she claims at the last possible moment before
the deadlines. The L-BTC is hers.

[click] Here is what that leaves Bob. The instant she claims is the instant his window expires too.
Everything between those two moments is all the time he will ever have, and it is very nearly
nothing — nowhere near enough to get a transaction confirmed.

[click] And Alice does not need to do anything clever with the time she has. Her own deadline passes
and she refunds immediately, right on the mark. Her bitcoin comes back.

Bob is now holding nothing at all: he never got the L-BTC out, and the bitcoin he was owed has gone
back to Alice. And notice she broke no rule. She was patient and she was quick, in that order.

That is the picture from a few slides ago, and now you can see exactly which knob produced it. Not
dishonesty — two numbers that happened to be equal.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-scales-duotone text-6xl text-gold" /></div>

# How to solve this?

<div class="mt-4 text-xl text-muted">
  Asymmetric time locks do the trick.
</div>

<!--
The fix is not a new mechanism. Everything is already in place — two lockups, one hash, two
deadlines. The only thing wrong is that the deadlines are the same.

So make them different. And the direction matters: it is not enough that they differ, it has to be
the *right* one that is longer.

Ask the room which one, if there is time. The answer falls out of who has to act second.
-->

---
clicks: 4
---

<HtlcTitle active="time" />

<DeadlineTimeline class="mt-3" lockups asymmetric :clicks="$clicks" />

<!--
Exactly where we started. Same two lockups, same two deadlines, both still the same length. Nothing
has been fixed yet.

[click] So fix the one thing. Stretch Alice's deadline out past Bob's — and watch that it happens in
both places at once, in the small bar inside her lockup and in the big one below. It is one number,
and it is the only thing on this slide that differs from the last one.

[click] Everything else runs exactly as before. She still waits, she still claims at the last
possible moment, the key opens Bob's lockup, and the L-BTC is hers.

[click] But now look at the gap between that moment and her own expiration. That gap is Bob's
window, and this time it is real.

[click] So he uses it. The same key, off the chain, opens her lockup — and the bitcoin is his.

Note what Alice cannot do here. She cannot refund early to squeeze him, because her deadline is the
one that comes last, by construction. Being patient no longer buys her anything.

Which makes the ordering a safety property rather than a tuning parameter. Whoever has to act
*second* must still have a window when their turn comes, so the party who moves first takes the
longer deadline. If you take one thing from this half of the talk, take this one: it is the
condition that is easiest to state and easiest to get wrong.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-cube-duotone text-6xl text-gold" /></div>

# How does it look on the blockchain?

<div class="mt-4 text-xl text-muted">
  Bitcoin Script
</div>

<!--
Everything so far has been the contract in the abstract — a hash lock, a time lock, two deadlines in
the right order. All of it true of any atomic swap, on any chain.

So: what does it actually look like? Not on a whiteboard — on the chain.

The next few slides are the same contract written down twice. Once the way Bitcoin ran it before
Taproot, and once the way it runs it now. Nothing new gets introduced; it is the same four things
we already built, in the notation the network actually enforces.
-->

---
clicks: 3
---

# The actual locking scripts

<!-- Slide 10's arrangement, deliberately: Alice, her chain boundary, the two
     lockups, Bob. The scripts hang under the box they belong to in the same
     grid, so which script governs which lockup needs no arrow to say it. The
     dashed rules span both rows — the whole column is that party's side.

     The lockup boxes are reduced to a chain mark, a name and a padlock. On the
     canvas slides the box *is* the subject and earns its height; here the script
     is, and every row the header gives up goes into type size. -->
<div class="mt-3 grid grid-cols-[3.5rem_1.25rem_1fr_1.5rem_1fr_1.25rem_3.5rem] items-center gap-y-3">

  <div class="col-start-1 row-start-1 flex flex-col items-center gap-1">
    <div class="i-ph-user-circle-fill text-3xl text-gold" />
    <div class="text-sm text-white leading-none">Alice</div>
  </div>

  <div class="col-start-2 row-start-1 row-span-2 h-full flex justify-center">
    <div class="w-px border-l border-white/20 border-dashed" />
  </div>

  <div class="col-start-3 row-start-1 pane-orange flex items-center justify-center gap-2.5 px-4 py-2">
    <ChainIcon chain="bitcoin" :size="20" />
    <div class="text-base text-white font-semibold leading-none">Bitcoin</div>
    <div class="i-ph-lock-simple-fill text-lg text-gold" />
  </div>

  <div class="col-start-5 row-start-1 pane-teal flex items-center justify-center gap-2.5 px-4 py-2">
    <ChainIcon chain="liquid" :size="20" />
    <div class="text-base text-white font-semibold leading-none">Liquid</div>
    <div class="i-ph-lock-simple-fill text-lg text-gold" />
  </div>

  <div class="col-start-6 row-start-1 row-span-2 h-full flex justify-center">
    <div class="w-px border-l border-white/20 border-dashed" />
  </div>

  <div class="col-start-7 row-start-1 flex flex-col items-center gap-1">
    <div class="i-ph-user-circle-fill text-3xl text-purple" />
    <div class="text-sm text-white leading-none">Bob</div>
  </div>

  <!-- One column at a time, and each one arrives whole. `v-click` fades rather
       than mounting, so row 2 holds its height from the start: the second script
       appearing cannot shift the first, and the dashed chain rules — which span
       both rows — are full length before either script is on screen. -->
  <div v-click="1" class="col-start-3 row-start-2">
    <SegwitScript
      claim-name="Bob" claim-accent="text-purple"
      refund-name="Alice" refund-accent="text-gold" />
  </div>

  <div v-click="2" class="col-start-5 row-start-2">
    <SegwitScript
      claim-name="Alice" claim-accent="text-gold"
      refund-name="Bob" refund-accent="text-purple" />
  </div>

</div>

<div v-click="3" class="mt-3 text-center text-muted">
  One script, two branches — and <span class="text-white">both go on chain</span>, whichever you used
</div>

<!--
The two lockups, exactly as we left them. Each one is an output sitting on its own chain, and each
one is governed by a script. Here is what those scripts actually said, before Taproot.

[click] Alice's, on Bitcoin. Read it top to bottom.

The condition on top is a size check: is the thing you handed me thirty-two bytes long? That is hex
twenty, by the way, not twenty decimal. If it is, you are claiming, and you take the first branch —
hash it, compare it to the preimage hash, and sign. If it is not, you fall through to the second:
wait for the block height, and sign. The two DROPs are stack housekeeping.

Note whose keys those are. Alice funded this lockup, and it pays out to Bob — so the claim branch
asks for *Bob's* signature, and the refund branch asks for hers.

[click] And Bob's, on Liquid. Now read across, because that is what this slide is for.

Same opcodes, same order. The preimage hash is the same value in both columns — that is the shared
hash lock from part one, on screen as one thing appearing twice.

The keys are not. Every name has swapped. Bob's lockup pays out to Alice, so it asks for her
signature to claim and his to refund. Each side is asking for the *other* party's key — which is
exactly why Alice cannot claim both, the thing we animated a few slides ago, now sitting in one line
of script.

The block heights are not the same either. That is the asymmetry from the timeline, living in one
line.

[click] And here is the thing worth complaining about. There is one script per lockup, so both
branches are published every time it is spent. Refund quietly six months later, and the chain still
shows the hash lock, the preimage hash, the whole shape of the contract. Anyone looking can tell
this was a swap, and you paid for the bytes of the branch you did not use.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-tree-structure-duotone text-6xl text-gold" /></div>

# Taproot

<div class="mt-4 text-xl text-muted">
  Improving the solution.
</div>

<!--
Taproot changes two things that matter for us, and we are going to take them one at a time.

The first is about scripts, and it is the direct answer to the complaint we just made: instead of
one script with every branch inside it, you commit to a *set* of branches and reveal only the one
you actually use. That is the next slide.

The second is about keys: two parties who agree can produce a single key and a single signature
between them.

Neither is specific to swaps. Both happen to be exactly what a swap wants.
-->

---
clicks: 3
---

<div class="mt-2 flex justify-center">
  <div class="pane-gold flex items-center gap-2.5 px-5 py-2">
    <div class="i-ph-tree-structure-duotone text-xl text-gold" />
    <div class="text-lg text-white font-semibold">taptree</div>
  </div>
</div>

<!-- The branch feet are the *column centres*, not 25/75: the grid's 1.75rem gap
     shifts each column inwards by half of it. 871px of content width minus that
     gap, quartered, is 24.2%. Re-derive if the gap or the slide padding changes. -->
<svg class="-mb-1 h-16 w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <path
    v-for="(branch, i) in [{ d: 'M50 0 L24.2 100', at: 1 }, { d: 'M50 0 L75.8 100', at: 2 }]"
    :key="i"
    :d="branch.d"
    fill="none"
    stroke="#8a97a3"
    stroke-width="1.5"
    stroke-linecap="round"
    vector-effect="non-scaling-stroke"
    class="transition-opacity duration-500"
    :class="$clicks >= branch.at ? 'opacity-100' : 'opacity-0'"
  />
</svg>

<div class="grid grid-cols-2 gap-7">

  <div v-click="1" class="pane-green px-6 py-5">
    <div class="eyebrow text-green">hash lock</div>
    <div class="mt-3 space-y-3 font-mono text-[0.76rem] leading-snug">
      <div>
        <div><span class="text-cyan">OP_SIZE</span></div>
        <div><span class="text-orange">OP_PUSHBYTES_1</span> <span class="text-body">20</span></div>
        <div><span class="text-cyan">OP_EQUALVERIFY</span></div>
        <div class="font-sans text-[0.76rem] text-muted">the preimage is exactly 32 bytes</div>
      </div>
      <div>
        <div><span class="text-red">OP_HASH160</span></div>
        <div><span class="text-orange">OP_PUSHBYTES_20</span> <span class="text-gold">&lt;preimage hash&gt;</span></div>
        <div><span class="text-cyan">OP_EQUALVERIFY</span></div>
        <div class="font-sans text-[0.76rem] text-muted">and it hashes to this</div>
      </div>
      <div>
        <div><span class="text-orange">OP_PUSHBYTES_32</span> <span class="text-gold">&lt;claim key&gt;</span></div>
        <div><span class="text-red">OP_CHECKSIG</span></div>
        <div class="font-sans text-[0.76rem] text-muted">and you signed</div>
      </div>
    </div>
  </div>

  <div v-click="2" class="pane-cyan px-6 py-5">
    <div class="eyebrow text-cyan">time lock</div>
    <div class="mt-3 space-y-3 font-mono text-[0.76rem] leading-snug">
      <div>
        <div><span class="text-orange">OP_PUSHBYTES_32</span> <span class="text-gold">&lt;refund key&gt;</span></div>
        <div><span class="text-red">OP_CHECKSIGVERIFY</span></div>
        <div class="font-sans text-[0.76rem] text-muted">you signed</div>
      </div>
      <div>
        <div><span class="text-orange">OP_PUSHBYTES_3</span> <span class="text-gold">&lt;block height&gt;</span></div>
        <div><span class="text-cyan">OP_CLTV</span></div>
        <div class="font-sans text-[0.76rem] text-muted">and this height has passed</div>
      </div>
    </div>
  </div>

</div>

<div v-click="3" class="mt-5 text-center text-muted">
  every branch ends in a <span class="text-white">signature</span> — the preimage alone claims nothing
</div>

<!--
Same two rules as the SegWit script, but split up. One branch each, and they hang off the taptree as
separate leaves. To spend, you reveal one leaf and prove it belongs to the tree. The other one stays
a hash — nobody learns what the alternative was, and you do not pay for its bytes.

[click] The hash lock. The size check first: the preimage must be exactly thirty-two bytes. That is
not decoration. In a reverse swap the same preimage has to settle a Lightning payment, and Lightning
preimages are thirty-two bytes. Without this line, somebody could commit to the hash of some
other-length value, claim on chain, and leave the counterparty holding a preimage Lightning will not
accept. Then the hash check. Then a signature.

[click] The time lock is shorter. A signature, and a block height that must have passed.

Notice the keys: thirty-two bytes now, not thirty-three. Taproot uses x-only public keys, so the
prefix byte is gone. If you find an older Boltz deck showing PUSHBYTES_33 in the leaves, that
predates the change.

[click] And here is the thing people assume wrongly, which is why I wanted the real script up. Both
branches end in a signature check. The preimage on its own claims nothing — you need the preimage
*and* the key. The timeout on its own refunds nothing — you need the height *and* the key.
-->

---
clicks: 2
---

# MuSig2

<div class="mt-4 flex justify-center">
  <MusigKeys :merged="$clicks >= 1" />
</div>

<div v-click="2" class="mt-4 text-center text-muted">
  On chain it is <span class="text-white">just a key</span> — nothing says two people made it
</div>

<!--
Alice has a key. Bob has a key. Before Taproot, if you wanted an output that both of them had to
agree on, you wrote a two-of-two multisig and put both keys plus both signatures on the chain.

[click] MuSig2 lets them add their keys together instead. One aggregate key, and when they both want
to spend, one aggregate signature — produced between them, over a couple of rounds of messages,
without either one ever handing over their private key.

[click] The result is an ordinary-looking key and an ordinary-looking signature. Same size, same
shape, same fee as any single-signer payment. Someone reading the chain cannot tell there were two
people involved, let alone that they were doing a swap.

Worth being clear about what this does and does not give us: it needs both parties to be present and
willing. It is a fast path for the case where everyone is happy. It is not a replacement for the
contract — that is the next slide.
-->

---
clicks: 3
---

# Two ways to spend a lockup

<!-- The two halves of Taproot, side by side under the paths they enable. Each
     column is a callback: the left is the tree from the MuSig2 slide, the right
     is the taptree, both at synthesis size. Nothing here is new — the slide's job
     is to put them under one heading each and say which is which.

     No blank lines inside this block. A blank line ends the HTML block for
     markdown-it, and anything indented four or more spaces after one is parsed as
     an indented code fence — which is exactly what the whole slide rendered as the
     first time round. Blank lines are only safe before a line indented two spaces
     or less. -->
<div class="mt-5 grid grid-cols-[1.45fr_1px_1fr] items-start gap-x-9">
  <div v-click="1" class="flex flex-col items-center">
    <div class="text-2xl text-white font-bold">Script path</div>
    <div class="mt-1 text-xs text-cyan">uncooperative — you act alone</div>
    <!-- Feet at the two sub-column centres. `grid-cols-2 gap-5` over this column
         puts them at 24 / 76, not 25 / 75 — the gap pulls each column inwards by
         half of itself. Re-derive if the gap changes. -->
    <svg class="mt-3 -mb-1 h-11 w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        v-for="(d, i) in ['M50 0 L24 100', 'M50 0 L76 100']"
        :key="i"
        :d="d"
        fill="none"
        stroke="#8a97a3"
        stroke-width="1.5"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div class="grid w-full grid-cols-2 gap-5">
      <div>
        <div class="text-center text-base text-green font-semibold">Hash lock</div>
        <div class="mt-2 font-mono text-[0.68rem] leading-[1.45]">
          <div><span class="text-cyan">OP_SIZE</span></div>
          <div><span class="text-orange mr-1.5">OP_PUSHBYTES_1</span><span class="text-body">20</span></div>
          <div><span class="text-cyan">OP_EQUALVERIFY</span></div>
          <div><span class="text-red">OP_HASH160</span></div>
          <div><span class="text-orange mr-1.5">OP_PUSHBYTES_20</span><span class="text-gold">&lt;preimage hash&gt;</span></div>
          <div><span class="text-cyan">OP_EQUALVERIFY</span></div>
          <div><span class="text-orange mr-1.5">OP_PUSHBYTES_32</span><span class="text-gold">&lt;claim key&gt;</span></div>
          <div><span class="text-red">OP_CHECKSIG</span></div>
        </div>
      </div>
      <div>
        <div class="text-center text-base text-cyan font-semibold">Time lock</div>
        <div class="mt-2 font-mono text-[0.68rem] leading-[1.45]">
          <div><span class="text-orange mr-1.5">OP_PUSHBYTES_32</span><span class="text-gold">&lt;refund key&gt;</span></div>
          <div><span class="text-red">OP_CHECKSIGVERIFY</span></div>
          <div><span class="text-orange mr-1.5">OP_PUSHBYTES_3</span><span class="text-body/70">&lt;block height&gt;</span></div>
          <div><span class="text-cyan">OP_CLTV</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="h-full w-px bg-white/15" />
  <div v-click="2" class="flex flex-col items-center">
    <div class="text-2xl text-white font-bold">Key path</div>
    <div class="mt-1 text-xs text-green">cooperative — both sides sign</div>
    <MusigKeys compact class="mt-1" />
    <div class="mt-5 w-full space-y-2">
      <div class="flex items-center gap-2.5">
        <div class="i-ph-coins-duotone shrink-0 text-base text-green" />
        <div class="text-xs text-body">one signature, so <span class="text-white">lower fees</span></div>
      </div>
      <div class="flex items-center gap-2.5">
        <div class="i-ph-eye-slash-duotone shrink-0 text-base text-green" />
        <div class="text-xs text-body">looks like <span class="text-white">any other payment</span></div>
      </div>
      <div class="flex items-center gap-2.5">
        <div class="i-ph-fast-forward-duotone shrink-0 text-base text-green" />
        <div class="text-xs text-body">refunds <span class="text-white">without the wait</span></div>
      </div>
    </div>
  </div>
</div>

<div v-click="3" class="mt-6 text-center text-xl text-white">
  Cooperation is the <span class="text-gold">optimisation</span>. The leaves are the guarantee.
</div>

<!--
Now put the two halves of Taproot together. The lockup is one Taproot output, and a Taproot output
can be spent two ways. Which one gets used tells you how the swap went.

[click] The script path first, because it is the one that has to exist. It is the taptree we just
read. Reveal one leaf, satisfy it, spend. It needs nobody's agreement and nobody's help — no message
to the other side, no endpoint to call. That is the whole point of it, and it is what makes the
other column safe to attempt.

[click] The key path. That is the aggregate key from two slides ago — both parties sign, one
signature goes on chain, and it is over. In practice almost every swap ends here.

And it is worth wanting, for three separate reasons. It is cheaper, because a single signature is
all that goes on chain. It is more private, because nothing about that transaction says "swap" — it
is indistinguishable from an ordinary Taproot payment. And it is faster, because if a swap fails,
Boltz will co-sign your refund immediately instead of leaving you to wait out the timeout.

Notice what is on screen: neither of these is new. Both columns are slides we have already done,
sitting under the two things they are for.

[click] Which is the sentence to hold onto. Cooperation is what makes it cheap, private and quick.
But it is an optimisation. The leaves are what make it safe to attempt at all. If the other side
stops answering, you do not negotiate with them — you use a leaf.
-->

---
layout: section
---

# Practice

<div class="mt-3 text-muted">One production system, doing exactly that</div>

<!--
That is the theory, and it is genuinely all of it. Everything from here is one implementation.

Boltz. Their own words for it, and it is the page title on the site, are "non-custodial Bitcoin
bridge". It swaps between Bitcoin, Lightning and Liquid, and it does it with the contract we just
built.

The framing to keep for the rest of the talk: Boltz is a counterparty, not a custodian. It is the
other side of your trade, the way Bob was the other side of Alice's. At no point does it hold your
funds. That distinction is the whole reason the second half is worth walking through in detail —
because the interesting question stops being "do I trust them" and becomes "what exactly is being
enforced, and by what".
-->

---
clicks: 4
---

# Swap directions

<div class="mt-5 flex items-center gap-4">
  <img src="/brand/boltz-logo-circle-transparent.svg" alt="Boltz" class="h-11 w-11">
  <div class="text-lg text-body">the directions Boltz currently supports</div>
</div>

<div class="mt-8 space-y-3.5">

<div v-click="1" class="pane flex items-center gap-8 px-7 py-4">
  <div class="w-32 text-lg font-bold text-body">Submarine</div>
  <div class="flex items-center gap-3.5">
    <ChainIcon chain="bitcoin" :size="30" />
    <div class="i-ph-arrow-right-bold text-sm text-muted/60" />
    <ChainIcon chain="lightning" :size="30" />
  </div>
  <div class="ml-auto text-sm text-muted">on-chain coins in, a Lightning invoice paid</div>
</div>

<div v-click="2" class="pane flex items-center gap-8 px-7 py-4">
  <div class="w-32 text-lg font-bold text-body">Reverse</div>
  <div class="flex items-center gap-3.5">
    <ChainIcon chain="lightning" :size="30" />
    <div class="i-ph-arrow-right-bold text-sm text-muted/60" />
    <ChainIcon chain="bitcoin" :size="30" />
  </div>
  <div class="ml-auto text-sm text-muted">Lightning in, on-chain coins out</div>
</div>

<div
  v-click="3"
  class="flex items-center gap-8 px-7 py-4 transition-all duration-500"
  :class="$clicks >= 4 ? 'pane-gold' : 'pane'"
>
  <div class="w-32 text-lg font-bold transition-colors duration-500" :class="$clicks >= 4 ? 'text-gold' : 'text-body'">Chain</div>
  <div class="flex items-center gap-3.5">
    <ChainIcon chain="bitcoin" :size="30" />
    <div class="i-ph-arrow-right-bold text-sm text-muted/60" />
    <ChainIcon chain="liquid" :size="30" />
  </div>
  <div class="ml-auto text-sm text-muted">on-chain to on-chain, across two networks</div>
</div>

</div>

<div v-click="4" class="mt-7 text-center text-lg text-white">
  The rest of the talk follows <span class="text-gold">one chain swap</span>, end to end.
</div>

<!--
Open with what Boltz actually is, since there is no longer a divider to say it over:

The hard part of peer-to-peer atomic swaps was never the cryptography. It is finding a counterparty
who wants exactly the opposite trade, for the same amount, right now. That is the problem Boltz
solves, and essentially the only one. The security is the HTLC we just built, unchanged — in the
diagram from part one, Boltz is simply Bob.

Which is why a public, permissionless service can still be non-custodial. It is a counterparty, not
a deposit account. At no point does it hold your funds under its own control.

Now the products. Three of them, one mechanism underneath. The two rules are the same in all three;
what changes is where the two legs live and who holds the preimage.

[click] Submarine: you have on-chain coins and want to pay a Lightning invoice. The preimage belongs
to whoever issued that invoice, so Boltz can only obtain it by actually making the payment — which
is exactly the property you want.

[click] Reverse: the other way. You want on-chain coins out of Lightning. Here you generate the
preimage.

[click] Chain: on-chain to on-chain. This is the one we follow for the rest of the talk, because
both legs are visible on a blockchain — nothing is hidden inside Lightning, so you can see the
whole mechanism working.
-->

---
clicks: 3
# forward transitions are read from the slide being *left* (Slidev
# logic/transition.ts), so this governs the hop to the rescue-key slide,
# played straight after the button tap
transition: slide-left
---

# Creating a chain swap at Boltz

<div class="mt-6 grid grid-cols-[auto_1fr] items-center gap-14">

  <!-- press-step tracks the annotation count: the tap is always the click after
       the last one. It was 4 while a third annotation stood here. -->
  <SwapBox :step="$clicks" advance-on-tap :press-step="3" />

  <div class="space-y-5">
    <div v-click="1" class="pane flex items-center gap-4 px-6 py-4">
      <div class="i-ph-arrows-down-up-bold text-2xl text-gold shrink-0" />
      <span class="text-body">pick the pair, enter an amount</span>
    </div>
    <div v-click="2" class="pane flex items-center gap-4 px-6 py-4">
      <div class="i-ph-arrow-square-out-duotone text-2xl text-gold shrink-0" />
      <span class="text-body">say where the L-BTC should end up</span>
    </div>
  </div>

</div>

<!--
Now the walkthrough: Bitcoin to Liquid, end to end. One canvas, built up a piece at a time — when
we step away from it to look at the check, we come back to the same picture rather than a new one.

This is the whole interface. Let us walk one swap through it.

[click] You pick the pair and an amount. Nothing has left your browser yet.

[click] You give it a Liquid address — where you want the L-BTC to arrive. That is the only piece of
information about you the swap needs.

Worth saying out loud rather than putting on the slide: that address is the only piece of
information about you the swap needs. No account, no email, no login, no KYC — there is nothing to
sign up for, because there is nothing being held on your behalf.

[click] So you press Create Swap.

What comes back is not an address.
-->

---
clicks: 4
---

# Swap created! You're asked to backup a Rescue Key

<div class="mt-3 grid grid-cols-[auto_1fr] items-center gap-12">

  <RescueBox />

  <div class="space-y-3.5">
    <div v-click="1" class="pane flex items-center gap-4 px-6 py-3.5">
      <div class="i-ph-note-pencil-duotone text-2xl text-gold shrink-0" />
      <span class="text-body">a twelve-word mnemonic — one for all your swaps</span>
    </div>
    <div v-click="2" class="pane flex items-center gap-4 px-6 py-3.5">
      <div class="i-ph-browser-duotone text-2xl text-cyan shrink-0" />
      <span class="text-body">generated in your browser, kept in its local storage</span>
    </div>
    <div v-click="3" class="pane flex items-center gap-4 px-6 py-3.5">
      <div class="i-ph-key-fill text-2xl text-gold shrink-0" />
      <span class="text-body">every preimage is derived from it</span>
    </div>
    <div v-click="4" class="pane-gold px-6 py-3.5">
      <div class="flex items-center gap-4">
        <div class="i-ph-lifebuoy-duotone shrink-0 text-2xl text-gold" />
        <span class="text-white">an emergency backup, for when local storage is gone</span>
      </div>
      <div class="mt-1.5 pl-10 text-sm text-muted">cleared browsing data, a private window, a lost device</div>
    </div>
  </div>

</div>

<!--
Press Create Swap and this is what you get. Not an address — a wall.

When you pressed that button, your browser generated a preimage and a key pair locally and sent
only the hash and a public key to the server. Everything it generated comes from one recovery
phrase, which Boltz calls the rescue key.

[click] It is a twelve-word BIP39 mnemonic. Not one per swap — one for all of them, on any device.

[click] It was generated the first time you loaded the page, and it lives in this
browser's local storage. It is not on Boltz's servers. They could not send it to you if you asked.
Clear site data, open the app on your phone instead, use a private window — gone.

[click] Every key for every swap derives from it — and so does every preimage. That second part is
the unusual one. A preimage is normally a random value you have to store; here it is computed from
the private key, which is computed from this phrase. Nothing to store, nothing to lose separately.

[click] And now be accurate about what this phrase is for, because the screen is quite dramatic and
it is easy to leave people with the wrong impression.

In the ordinary case you never touch it. The browser has everything it needs in local storage, the
swap completes in the next few minutes, and the phrase is never used at all. This is a backup, and
like any backup it exists for the day the normal path is unavailable.

The day being: you cleared your browsing data mid-swap, or you were in a private window and closed
it, or your laptop died, or you want to finish the swap on a different machine. Anyone who browses
with storage that clears itself should take it seriously. Everybody else is writing down something
they will most likely never need — which is exactly what a backup is.

If that day does come, this is the only thing that gets your funds back, because both routes out of
your lockup derive from it: your preimage claims the Liquid you are owed, and your refund key
reclaims the Bitcoin you sent. Boltz cannot help — it never had the phrase. That is why the app
treats it as a wall rather than a suggestion, and makes you read it back before continuing.

It only does this when you are the one locking funds on-chain. Reverse swaps skip it, because you
have nothing at risk to rescue.

One more thing the phrase gets you, if it comes up: a watch-only key. It can ask the server which
swaps exist without being able to spend any of them. The trade-off is that it hands the server a way
to link your swaps together.
-->

---
clicks: 2
---

# Now it shows you an address

<div class="mt-2 grid grid-cols-[auto_1fr] items-center gap-14">

  <PaymentBox />

  <div class="space-y-5">
    <div v-click="1" class="pane flex items-center gap-4 px-6 py-5">
      <div class="i-ph-qr-code-duotone text-2xl text-gold shrink-0" />
      <span class="text-body">it asks you to send funds into this address</span>
    </div>
    <div v-click="2" class="pane-gold flex items-center gap-4 px-6 py-5">
      <div class="i-ph-question-bold text-2xl text-gold shrink-0" />
      <span class="text-lg text-white">but how can you know it is safe to do so?</span>
    </div>
  </div>

</div>

<!--
Rescue key saved, and now the app gives you what you came for: an address, a QR code, an amount, and
a warning to be quick about it.

This is the ordinary end of the story. You scan it, you send, the swap completes. Millions of people
use interfaces that look exactly like this every day and never think about it again.

[click] So that is the ask. Send real money into this address.

[click] And here is the question I want you to sit with for a second, because it is the one the rest
of this section answers.

How would you know that is safe to do?

You cannot read an address. It is a string. You cannot tell by looking whether it belongs to a swap,
or to this swap, or to anything at all. You have the app's word for it, and the app got it from a
server.

That is not an accusation — Boltz has every commercial reason to behave. It is just that "they
probably will" is a different kind of guarantee from the one we spent part one building.
-->

---
clicks: 3
---

# An address encodes the locking script

<div class="mt-10 flex items-stretch justify-center gap-10">
  <div class="pane-gold w-[18rem] px-7 py-7 text-center">
    <div class="i-ph-lock-key-duotone mx-auto text-4xl text-gold" />
    <div class="mt-4 text-lg text-white">locking script</div>
    <div class="mt-2 text-sm leading-snug text-muted">every way the output can be spent</div>
  </div>
  <div class="flex flex-col items-center justify-center">
    <div class="i-ph-arrow-right-bold text-2xl text-muted/50" />
    <div class="mt-2 text-xs text-muted">encoded as</div>
  </div>
  <div class="pane-cyan w-[18rem] px-7 py-7 text-center">
    <div class="i-ph-tag-duotone mx-auto text-4xl text-cyan" />
    <div class="mt-4 text-lg text-white">the address</div>
    <div class="mt-2 text-sm leading-snug text-muted">the string you are shown</div>
  </div>
</div>

<div class="mt-10 space-y-4 max-w-2xl mx-auto">
  <div v-click="1" class="pane-green flex items-center gap-3 px-6 py-3.5 text-lg">
    <div class="i-ph-check-circle-fill text-2xl text-green shrink-0" />
    <span class="text-white">same locking script</span>
    <span class="text-muted">always gives</span>
    <span class="text-white">the same address</span>
  </div>
  <div v-click="2" class="pane-red flex items-center gap-3 px-6 py-3.5 text-lg">
    <div class="i-ph-x-circle-fill text-2xl text-red shrink-0" />
    <span class="text-white">change one byte of it</span>
    <span class="text-muted">and you get</span>
    <span class="text-white">a different address</span>
  </div>
</div>

<div v-click="3" class="mt-8 flex items-center justify-center gap-3 text-muted">
  <div class="i-ph-lock-key-open-duotone text-xl text-muted/70" />
  the <span class="text-white">unlocking script</span> comes later — whichever branch you end up using
</div>

<!--
Before the mechanism, the question it answers — this used to be a slide of its own and is now yours
to ask out loud. You have just been handed an address and told to send real money to it. What are
you trusting Boltz to have got right? Three things, and none of them require it to be evil; a bug
would do just as well. That the hash lock commits to *your* preimage hash, not one only they can
open. That your refund window outlasts theirs, or you are back in the attack we drew in part one.
And that the tree carries those two leaves and no third one — some extra script letting one side
out early without the preimage and without waiting.

Then the punchline, and it is worth pausing on: look back at that address and ask which of the three
you could have spotted. None. Not one is visible in the string, and squinting at the first and last
characters does not help. So can the software do better than squinting?

This is the hinge of the whole talk, so I will go slowly, and I want to use the proper names for
these because the whole argument turns on them.

Every Bitcoin output carries a locking script: the conditions that have to be met before it can be
spent. To spend it you supply an unlocking script — the data that satisfies those conditions. Our
lockup has two ways to be satisfied, the hash lock and the time lock, so there are two possible
unlocking scripts for the same locking script.

Now the part that matters. An address is not an account number, and it is not a name the server
assigns you. It is an *encoding of the locking script itself*. Decode the address and you get the
script back. That is not an analogy — it is literally what the client does, and I will show you the
line later.

[click] So it is deterministic. The same locking script always encodes to the same address.

[click] And it is sensitive. Change a key, change the block height, add a branch — the script
changes, so the address changes completely. There is no way to alter the conditions and keep the
address.

Put those two together and you have something powerful. You never have to take the server's address
on faith. You can build the locking script you actually want, encode it yourself, and compare.

[click] Worth keeping the two straight: the locking script is fixed the moment you fund the output,
and it is what the address commits to. The unlocking script is chosen later, when someone spends.
The check we are about to do is entirely about the locking script — before a single satoshi moves.

On Taproot it is one step less direct: the address encodes an output key that commits to the script
tree, rather than spelling the branches out. But the property is the same, which is why the same
check works.
-->

---
clicks: 3
---

# An address encodes the locking script

<TaprootAddress class="mt-1" :clicks="$clicks" />

<!--
We have just said an address *is* the locking script, encoded. So here is how that one for your
lockup gets built. Two ingredients, one number, and then the payoff.

First the script tree — the two leaves from a few slides ago. Hash each one, hash the pair, and you
have the merkle root: a single fingerprint standing for every scripted way this output can ever be
unlocked. Note there is no intermediate branch, because with exactly two leaves one pairing *is* the
root.

[click] Second, the internal key: your key and Boltz's, aggregated with MuSig2.

[click] Now combine them. The root gets hashed together with the key, and the result is added to the
key — say that carefully if anyone asks, because you sometimes hear "multiply". The hash *is*
multiplied, but by the generator point, and the point that comes out is *added*. Addition is the
whole trick: whoever could sign for the original key can still sign for the tweaked one, by adding
the same number to their private key.

And that tweaked key *is* the locking script. Look at what actually sits in the output: push a one,
push thirty-two bytes. That is the whole of it. The hash lock is not in there. The time lock is not
in there. Neither key is in there. The address is just that number, encoded.

[click] Which sets up the thing worth taking away from this slide. Both ways out are already inside
that single key. Sign for it, and you are done — that is the key path, and it looks like any
ordinary payment. Or reveal one leaf together with a path proving it helped build the root, and the
chain can check that against the key you funded. That is the script path.

So Boltz cannot pretend the refund leaf was never there. The address you sent money to was computed
from it.

And because it is computed rather than assigned, you can compute it yourself. Which is exactly what
the next slide does — the app runs this same derivation locally, and refuses to show you an address
unless its answer matches theirs.
-->

---
clicks: 4
# the annotated walkthrough is the longest listing in the deck; without this it
# runs a couple of lines past the bottom of the slide
class: compact-code
---

# So the app rebuilds it, and compares

<div class="mt-5 grid grid-cols-[15rem_1fr] gap-8">

<div class="space-y-4 pt-1">
  <div v-click="1" class="flex items-start gap-3">
    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gold/20 text-xs font-bold text-gold">1</span>
    <div>
      <div class="text-sm text-white">start from what it holds</div>
      <div class="text-xs text-muted">its own preimage and key</div>
    </div>
  </div>
  <div v-click="2" class="flex items-start gap-3">
    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gold/20 text-xs font-bold text-gold">2</span>
    <div>
      <div class="text-sm text-white">rebuild it from scratch</div>
      <div class="text-xs text-muted">both leaves, and the key they make</div>
    </div>
  </div>
  <div v-click="3" class="flex items-start gap-3">
    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-green/20 text-xs font-bold text-green">3</span>
    <div>
      <div class="text-sm text-white">is theirs the same?</div>
      <div class="text-xs text-muted">branch for branch</div>
    </div>
  </div>
  <div v-click="4" class="flex items-start gap-3">
    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-green/20 text-xs font-bold text-green">4</span>
    <div>
      <div class="text-sm text-white">does the address encode it?</div>
      <div class="text-xs text-muted">decode it back and compare</div>
    </div>
  </div>
</div>

```ts {all|1-2|3-12|14-15|16-17}
const ourPreimageHash = sha256(ourPreimage)
const ourKey = deriveKey(keyIndex, asset)
const ourTree = reverseSwapTree(
  isLiquid,
  ourPreimageHash,
  boltzKey,           // Boltz may claim, with the preimage
  ourKey.publicKey,   // we may refund, after the timeout
  boltzTimeout,
)
const ourScript = Scripts.p2trOutput(
  tweakMusig(createMusig(ourKey, boltzKey), ourTree).aggPubkey,
)

if (!compareTrees(boltzTree, ourTree))
  throw new Error("swap tree mismatch")
if (!equalBytes(decodeAddress(displayedAddress).script, ourScript))
  throw new Error("decoded address script mismatch")
```

</div>

<div class="mt-3 text-xs text-muted">
  <code>src/utils/validation.ts</code> — simplified to the side you fund; the real one runs for both
  lockups with the two keys swapped over
</div>

<!--
This is the whole security model, so let us walk it. The code is the real client, tidied only by
fixing it to one side of the swap — the real function handles both, which is where its ternaries
come from.

[click] It starts from what it already holds. The preimage hash is its own preimage, hashed here.
The key is derived from the rescue key. Neither came from the server.

[click] Then it rebuilds the whole thing itself — both leaves, then the tweaked key they produce,
then the script that key sits in. Boltz's key may claim with the preimage; ours may refund after the
timeout. It knows which way round that goes; it does not ask.

Read the prefixes and the slide reads itself. Everything called `our` was computed in this browser.
Everything called `boltz` arrived over the wire. The whole check is: do they match.

Notice what it is *not* doing. It is not scanning the server's answer looking for something
suspicious. Blocklists do that, and they fail on anything the author did not anticipate. This
independently produces the correct answer and tests the server's against it.

[click] First comparison: does the tree we were sent match the one we just built? Branch for branch.
If not, it throws.

[click] Second: encode our tree into an address, decode the address we were given back into a
script, and compare the bytes. This is the line I promised on the last slide — the address really
is an encoding of the locking script, and here is the code turning one into the other.

Two comparisons. If both pass, the output can only be spent under the script this browser built:
only your preimage unlocks it, only your key refunds it, the deadline is the one you were shown,
and there is no third branch.

That is the moment worth naming. Before this, "non-custodial" is marketing. After it, everything
that happens is governed by consensus rules rather than by how Boltz chooses to behave.

On Liquid there is a third check — the blinding key has to match the address too.
-->

---
clicks: 4
---

# The same check, run on both lockups

```ts
await Promise.all([
  validateSide(Side.Send,    swap.assetSend,    swap.lockupDetails),   // your BTC
  validateSide(Side.Receive, swap.assetReceive, swap.claimDetails),    // their L-BTC
])
```

<div class="mt-8 grid grid-cols-2 gap-7">

  <div v-click="1" class="pane-orange px-6 py-6">
    <div class="flex items-center gap-2.5">
      <ChainIcon chain="bitcoin" :size="24" />
      <span class="text-white font-semibold">your Bitcoin lockup</span>
    </div>
    <div class="mt-4 space-y-3 text-sm">
      <div v-click="3" class="flex items-start gap-2.5">
        <div class="i-ph-lock-simple-fill mt-1 shrink-0 text-green" />
        <div class="text-muted">
          <span class="font-semibold text-purple">their key</span> claims it, with the preimage
        </div>
      </div>
      <div v-click="3" class="flex items-start gap-2.5">
        <div class="i-ph-clock-countdown-fill mt-1 shrink-0 text-cyan" />
        <div class="text-muted">
          <span class="font-semibold text-gold">your key</span> refunds it, once the deadline passes
        </div>
      </div>
    </div>
  </div>

  <div v-click="2" class="pane-teal px-6 py-6">
    <div class="flex items-center gap-2.5">
      <ChainIcon chain="liquid" :size="24" />
      <span class="text-white font-semibold">their Liquid lockup</span>
    </div>
    <div class="mt-4 space-y-3 text-sm">
      <div v-click="3" class="flex items-start gap-2.5">
        <div class="i-ph-lock-simple-fill mt-1 shrink-0 text-green" />
        <div class="text-muted">
          <span class="font-semibold text-gold">your key</span> claims it, with the preimage
        </div>
      </div>
      <div v-click="3" class="flex items-start gap-2.5">
        <div class="i-ph-clock-countdown-fill mt-1 shrink-0 text-cyan" />
        <div class="text-muted">
          <span class="font-semibold text-purple">their key</span> refunds it, once the deadline passes
        </div>
      </div>
    </div>
  </div>

</div>

<div v-click="3" class="mt-5 text-center text-sm text-muted">
  the same four steps both times — only <span class="text-white">which key goes in which slot</span> is swapped
</div>

<div v-click="4" class="mt-4 text-center text-lg text-white">
  Both must pass, or <span class="text-gold">no address is shown at all</span>
</div>

<!--
One thing the tidied code hid, and it matters: that check does not run once. It runs twice.

There are two lockups in a chain swap, and you are shown an address for the one you fund — but the
client validates both, before either exists on-chain.

[click] The one you are about to fund, on Bitcoin.

[click] And the one Boltz will fund, on Liquid.

[click] Now look at what differs between the two runs. It is only which key goes in which position.

On your lockup, their key may claim it — with the preimage — and your key may refund it. On their
lockup it is exactly reversed: your key claims, their key refunds.

That is the whole of the `side === Side.Send ? ... : ...` business in the real source. Same
function, same four steps, two sets of arguments. The client also derives a *different* key for
each side — the refund key index for yours, the claim key index for theirs.

[click] And both have to pass. `Promise.all` — if either side is wrong, the whole validation
rejects and the app shows an error instead of an address. There is nothing on screen to send money
to.

Why check theirs at all, when you are not funding it? Because a correct lockup on your side is only
half the trade. If their side commits to a different preimage hash, or names a key that is not
yours, you would fund a perfectly good lockup and still have no way to claim what you are owed.
-->

---
clicks: 5
---

# Where that leaves us

<div class="mt-8 space-y-3">

<div v-click="1" class="pane flex items-center gap-4 px-6 py-3">
  <div class="i-ph-sliders-horizontal-duotone shrink-0 text-xl text-cyan" />
  <div class="text-body">You picked the pair and the amount</div>
</div>

<div v-click="2" class="pane flex items-center gap-4 px-6 py-3">
  <div class="i-ph-key-duotone shrink-0 text-xl text-gold" />
  <div class="text-body">Boltz Web App generated the keys and the preimage, and sent only the <span class="text-white">hash</span></div>
</div>

<div v-click="3" class="pane flex items-center gap-4 px-6 py-3">
  <ChainIcon chain="boltz" :size="20" />
  <div class="text-body">Boltz backend replied with a tree, its key, a deadline and an <span class="text-white">address</span></div>
</div>

<div v-click="4" class="pane flex items-center gap-4 px-6 py-3">
  <div class="i-ph-shield-check-duotone shrink-0 text-xl text-green" />
  <div class="text-body">The Boltz Web App in your browser rebuilt all of it and compared, twice, on both lockups</div>
</div>

</div>

<div v-click="5" class="mt-8 flex items-center justify-center gap-4">
  <div class="i-ph-check-circle-fill text-4xl text-green" />
  <div class="text-2xl text-white">Safe to fund.</div>
</div>

<!--
Quick recap, because the next part is where money actually moves.

[click] You picked a pair and an amount. Nothing had left the browser yet.

[click] Your browser generated the keys and the preimage from the rescue phrase, and sent Boltz the
hash — never the preimage, never a private key.

[click] Boltz replied with the whole proposed contract: the tree, its own public key, a timeout
height and the address to fund.

[click] And the browser threw none of that away and trusted none of it. It rebuilt the contract from
what it already held, compared branch for branch, decoded the address back into a script and
compared that too — for both lockups, not just yours.

[click] Which is the only reason the next step is reasonable. Everything up to here has been
preparation for one irreversible action, and that action is now safe to take.
-->

---
clicks: 2
---

# You fund it from your own wallet

<div class="mt-2 flex items-center justify-center gap-16">

  <!-- The same payment page from earlier, unchanged: the audience should
       recognise the screen they were asked to distrust, now that it has been
       checked. A different mock here would read as a different address. -->
  <PaymentBox />

  <div v-click="1" class="relative">
    <PhoneFrame :width="200" :height="330">
      <div class="h-full flex flex-col items-center justify-center gap-4 bg-black">
        <div class="relative">
          <div class="rounded-lg bg-white p-1.5"><QrMock :size="104" :modules="25" logo="bitcoin" /></div>
          <!-- viewfinder brackets + a sweep, so "scanning" is a thing happening -->
          <div class="pointer-events-none absolute -inset-2.5 border-2 border-green/80 rounded-lg" />
          <div v-if="$clicks < 2" class="scan-sweep pointer-events-none absolute -inset-2.5 overflow-hidden rounded-lg">
            <div class="h-0.5 w-full bg-green shadow-[0_0_12px_rgba(108,196,127,.9)]" />
          </div>
        </div>
        <div v-if="$clicks >= 2" class="flex items-center gap-2 text-xs text-green">
          <div class="i-ph-check-circle-fill" /> address captured
        </div>
        <div v-else class="text-xs text-muted">scanning…</div>
      </div>
    </PhoneFrame>
  </div>

</div>

<!--
This is the handover, and it is worth naming what is happening at this moment.

[click] You point your own wallet at that QR. Not a Boltz wallet — whatever you already use.

[click] And the address goes in.

Notice what Boltz has, at this instant, that it did not have before: nothing. There is no session,
no account, no permission you granted. The only thing connecting you to it is that you are about to
pay to an address whose spending rules your own browser derived and checked.
-->

---
clicks: 3
---

# Your wallet, your transaction

<div class="mt-4 flex items-start justify-center gap-12">

  <PhoneFrame :width="216" :height="352">
    <WalletSend :step="$clicks >= 3 ? 2 : $clicks >= 2 ? 1 : 0" />
  </PhoneFrame>

  <div class="max-w-xs pt-10 space-y-4">
    <div v-click="1" class="pane flex items-start gap-3 px-5 py-3.5">
      <div class="i-ph-scan-duotone mt-0.5 shrink-0 text-lg text-cyan" />
      <div class="text-sm text-body">the scanned address, in a wallet Boltz has never met</div>
    </div>
    <div v-click="2" class="pane flex items-start gap-3 px-5 py-3.5">
      <div class="i-ph-pencil-simple-duotone mt-0.5 shrink-0 text-lg text-gold" />
      <div class="text-sm text-body">you enter the amount and you sign it</div>
    </div>
    <div v-click="3" class="pane-green flex items-start gap-3 px-5 py-3.5">
      <div class="i-ph-paper-plane-tilt-duotone mt-0.5 shrink-0 text-lg text-green" />
      <div class="text-sm text-body">broadcast — and now one lockup exists</div>
    </div>
  </div>

</div>

<!--
[click] The address lands in your wallet. This is a wallet Boltz has no relationship with, holds no
key for, and cannot see.

[click] You type the amount and you sign. Your keys, your device, your decision.

[click] And you broadcast it.

That transaction is the first irreversible thing in the whole flow, and everything before it existed
to make it safe. From here the contract takes over.
-->

---
clicks: 6
---

# Unlocking, cooperatively

<LedgerPair
  left-person="You" right-person="Boltz" right-avatar="boltz"
  left-title="Bitcoin" left-chain="bitcoin"
  right-title="Liquid" right-chain="liquid"
  left-asset="bitcoin" right-asset="liquid" show-assets
  :left-asset-at="$clicks >= 6 ? 'bob' : $clicks >= 1 ? 'lockupA' : 'alice'"
  :right-asset-at="$clicks >= 5 ? 'alice' : $clicks >= 2 ? 'lockupB' : 'bob'"
  :left-state="$clicks >= 6 ? 'open' : $clicks >= 1 ? 'locked' : 'empty'"
  :right-state="$clicks >= 5 ? 'open' : $clicks >= 2 ? 'locked' : 'empty'"
  :left-agg-key-at="$clicks >= 5 ? 'lockupB' : $clicks >= 4 ? 'alice' : null"
  :right-agg-key-at="$clicks >= 6 ? 'lockupA' : $clicks >= 3 ? 'bob' : null"
  :left-note="$clicks >= 6 ? 'one signature' : ''"
  :right-note="$clicks >= 5 ? 'one signature' : ''">

  <template #top>
    <SigExchange :clicks="$clicks - 2" />
  </template>

  <template #bottom>
    <div v-click="6" class="text-lg text-white">
      Two ordinary payments. The chain never sees the
      <span class="text-gold">preimage</span> or the <span class="text-gold">leaves</span>.
    </div>
  </template>

</LedgerPair>

<!--
Same canvas as the first half, with Boltz standing where Bob stood. Nothing is locked yet — you have
your bitcoin, Boltz has its L-BTC.

[click] You fund first, and your Bitcoin transaction confirms. Note that only one lockup exists
right now. If everything stopped here, nothing has gone wrong — you wait out your deadline and refund
yourself.

[click] Boltz sees the confirmation and locks its own funds on Liquid, against the same preimage
hash. Now there are two, and each one is locked to a single key that you and Boltz *share* — the
MuSig2 aggregate. Neither of you can sign for it alone, so somebody has to ask.

[click] You go first, and it is one POST from the web app in your browser to the Boltz backend —
`POST /swap/chain/{id}/claim`. It carries two things. The preimage: watch where it goes, and where it
does *not* — to Boltz, in a request body, never onto either chain. And your partial signature for the
*Bitcoin* lockup, the one you funded, which is the one Boltz is going to claim. You sign their
transaction before you ask for anything. Now Boltz has both halves for your Bitcoin lockup, and there
is its key.

(Strictly there is a GET just before this one, fetching Boltz's claim transaction and its nonce so
you have something to sign. The POST is the exchange worth drawing.)

[click] And the response carries their partial signature for the *Liquid* lockup — the one they
funded, the one you are going to claim. Now you can assemble a key too.

That is what makes it safe. It is not a request for a favour, it is a trade: I sign yours, you sign
mine, one message each way, and at no point does either of us hold something that would open both.

[click] So you use yours. One signature, and Boltz's Liquid lockup opens. The L-BTC is yours.

[click] And Boltz uses its own on your Bitcoin lockup.

Look at what actually landed on chain: one signature per lockup. Not a preimage, not a leaf, not a
script. Two payments that look like any other Taproot payment on either chain — which is the privacy
result from earlier, made real. Nobody watching can tell these two transactions are related.

And if any of it fails — Boltz does not answer, sends a bad signature, goes away entirely — the
client falls straight back to the script path. That is one line in the code: catch, and retry
uncooperatively. The leaves we spent the first half building are what make this fast path safe to
attempt at all.

The requirement that is easy to miss: nothing unlocks funds on your behalf. Every way out is
something *you* do — you claim, or you refund. Boltz can be slow, or absent, or hostile, and the
worst it costs you is time.
-->

---
layout: center
class: text-center
---

<div class="mb-6 flex justify-center"><div class="i-ph-check-circle-fill text-6xl text-green" /></div>

# Swap complete

<div class="mt-6 flex items-center justify-center gap-5">
  <ChainIcon chain="bitcoin" :size="26" />
  <div class="i-ph-arrows-left-right-bold text-gold" />
  <ChainIcon chain="liquid" :size="26" />
</div>

<!--
Swap done. Bitcoin out, L-BTC in.

And walk back through what was never required: no account, no email, no KYC, no deposit into
anybody's wallet, no moment at which Boltz could have decided to keep your money.

That is the whole claim, and it is now something you have watched rather than something you have
been told.
-->

---
clicks: 5
---

# What to take away

<div class="mt-12 space-y-8">
  <div v-click="1" class="flex items-baseline gap-6">
    <span class="text-2xl text-gold font-bold">1</span>
    <div>
      <div class="text-2xl text-white">Non-custodial</div>
      <div class="mt-1 text-base text-muted">it never holds your keys — the locking scripts enforce that</div>
    </div>
  </div>
  <div v-click="2" class="flex items-baseline gap-6">
    <span class="text-2xl text-gold font-bold">2</span>
    <div>
      <div class="text-2xl text-white">Don't trust, verify</div>
      <div class="mt-1 text-base text-muted">the web app doesn't trust the backend — it verifies the responses for you</div>
    </div>
  </div>
  <div v-click="3" class="flex items-baseline gap-6">
    <span class="text-2xl text-gold font-bold">3</span>
    <div>
      <div class="text-2xl text-white">Verify the lockup before you fund it</div>
      <div class="mt-1 text-base text-muted">that is where the security actually lives</div>
    </div>
  </div>
</div>

<div v-click="3" class="mt-12 text-center text-muted">
  ask those three of <span class="text-white">any</span> swap system, not just this one
</div>

<!--
Wrapping up. Three things, and they are the ones worth carrying out of the room.

[click] Non-custodial. It never has your keys. A verified lockup has only the two branches you
checked, and it cannot keep both sides — taking yours publishes the preimage that opens theirs. None
of that is a promise Boltz makes; they are things the chain will not let it do.

Be honest about the limits while you are here, because they are worth saying out loud rather than
burying. Boltz can still refuse to co-sign and make you wait out the timeout. It can decline the swap
and cost you fees. It sees both legs of your trade. So: it can cost you time. It cannot take your
funds.

[click] Don't trust, verify. That is the reason you can say any of the above. You do not take the
backend's word for anything — the web app rebuilds every lockup and checks it before it will show you
an address. That is the whole of the second half, in four words.

One more honest limit, and it belongs right here: the check runs in JavaScript that Boltz's own
server hands your browser. The client is open source, reproducible, and you can run it from source —
but load it from their domain and you are trusting the delivery. That is true of every browser-based
wallet, and it is why the recommended integration path is a reviewed library rather than a web page.

[click] And verify before you fund, because that is where the security actually lives. The protocol
has been well understood for years. What varies between systems — and what decides whether you get
robbed — is whether the software reconstructs the lockup or just displays what it was handed.

Two things I would still say out loud even though they are no longer on the slide, because they are
what makes this generalise: one preimage has to link both sides, or it is not a swap, it is two
payments and a promise. And cooperation is an optimisation, never a requirement — every path that
matters works without the other side agreeing to anything.

Ask these three of anything calling itself an atomic swap. And if you only remember one, make it the
third.
-->

---
layout: center
class: text-center
---

# Thank you!

<div class="mt-6 grid grid-cols-[auto_1fr] items-center gap-12">
<div class="flex flex-col items-center">
<img src="/slides-qr.svg" alt="github.com/kiocos/atomic-swaps-explainer" class="h-48 w-48 rounded-xl bg-white p-2.5">
<div class="mt-3 font-mono text-[0.72rem] text-cyan">github.com/kiocos/atomic-swaps-explainer</div>
<div class="mt-1 text-xs text-muted">slides, source, and all the links</div>
</div>
<div class="space-y-4">
<div class="pane-gold flex items-center gap-4 px-6 py-4">
<img src="/brand/boltz-logo-circle-transparent.svg" alt="Boltz" class="h-14 w-14 shrink-0">
<div class="min-w-0 text-left">
<div class="text-lg text-white">Boltz</div>
<div class="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[0.8rem]">
<span class="flex items-center gap-2"><div class="i-ph-globe-simple-bold shrink-0 text-cyan" /><span class="text-body">boltz.exchange</span></span>
<span class="flex items-center gap-2"><div class="i-simple-icons-github shrink-0 text-body/70" /><span class="text-body">github.com/BoltzExchange</span></span>
<span class="flex items-center gap-2"><div class="i-simple-icons-x shrink-0 text-body/70" /><span class="text-body">@Boltzhq</span></span>
</div>
</div>
</div>
<div class="pane flex items-center gap-4 px-6 py-4">
<img src="/caio.png" alt="Caio" class="h-14 w-14 shrink-0 rounded-full">
<div class="min-w-0 text-left">
<div class="text-lg text-white">Caio</div>
<div class="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-[0.8rem]">
<span class="flex items-center gap-2"><div class="i-ph-envelope-simple-duotone shrink-0 text-cyan" /><span class="text-body">c@bol.tz</span></span>
<span class="flex items-center gap-2"><div class="i-simple-icons-github shrink-0 text-body/70" /><span class="text-body">github.com/kiocos</span></span>
</div>
</div>
</div>
</div>
</div>

<!--
Everything is public — the deck, its source, and Boltz's own code. If anything tonight sounded like
a claim rather than a fact, go and check it.

Happy to take questions.
-->
