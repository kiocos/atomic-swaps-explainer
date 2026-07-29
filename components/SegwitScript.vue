<script setup lang="ts">
/**
 * The pre-Taproot lockup script, `reverseSwapScript` in boltz-core, rendered once
 * per side of the swap.
 *
 * It is a component rather than markup on the slide because the whole point of
 * showing it twice is that the two are *the same script* — same opcodes, same
 * order, same preimage hash — differing only in which party is named where. If
 * the two were copy-pasted, an edit to one would quietly break that claim.
 *
 * The names are the parties, not `<claim key>` / `<refund key>`. Those are the
 * roles the code uses, but they are relative to a side, so on a slide showing
 * both sides at once they read as if the two lockups were unrelated. Naming Alice
 * and Bob makes the mirror visible: each lockup carries the *other* party's key on
 * its claim branch and its own on the refund branch.
 *
 * No progressive reveal here. The slide's argument is the *comparison* between the
 * two columns, which only exists once both are complete — dimming half of each one
 * would hide the very thing the audience is meant to read across.
 */
withDefaults(
  defineProps<{
    /** Who may claim this lockup — the counterparty, in every swap. */
    claimName: string
    claimAccent?: string
    /** Who may take it back — whoever funded it. */
    refundName: string
    refundAccent?: string
  }>(),
  { claimAccent: 'text-gold', refundAccent: 'text-purple' },
)
</script>

<template>
  <!--
    Every opcode carries its own right margin instead of relying on the space
    between it and the next span: Vue's compiler condenses whitespace-only text
    nodes containing a newline, which silently welds `OP_PUSHBYTES_33` onto the
    key beside it. Same trap as HtlcTitle.vue.

    The branch labels ride on the OP_IF / OP_ELSE lines rather than sitting above
    each block. That is where they belong anyway — the opener *is* the branch —
    and on a slide carrying two full scripts the two rows it saves buy a
    noticeably larger type size.
  -->
  <div class="font-mono text-[0.8rem] leading-[1.4]">
    <div><span class="text-cyan">OP_SIZE</span></div>
    <div><span class="text-orange mr-1.5">OP_PUSHBYTES_1</span><span class="text-body">20</span></div>
    <div><span class="text-cyan">OP_EQUAL</span></div>
    <div>
      <span class="text-cyan mr-2.5">OP_IF</span>
      <span class="chip-green !text-[0.6rem] !py-0">hash lock</span>
    </div>

    <div class="ml-2.5 border-l-2 border-green/45 pl-3">
      <div><span class="text-red">OP_HASH160</span></div>
      <div><span class="text-orange mr-1.5">OP_PUSHBYTES_20</span><span class="text-gold">&lt;preimage hash&gt;</span></div>
      <div><span class="text-cyan">OP_EQUALVERIFY</span></div>
      <div>
        <span class="text-orange mr-1.5">OP_PUSHBYTES_33</span>
        <span :class="claimAccent">&lt;{{ claimName }}'s key&gt;</span>
      </div>
    </div>

    <div>
      <span class="text-cyan mr-2.5">OP_ELSE</span>
      <span class="chip-cyan !text-[0.6rem] !py-0">time lock</span>
    </div>

    <div class="ml-2.5 border-l-2 border-cyan/45 pl-3">
      <div><span class="text-orange">OP_DROP</span></div>
      <div><span class="text-orange mr-1.5">OP_PUSHBYTES_3</span><span class="text-body/70">&lt;block height&gt;</span></div>
      <div><span class="text-cyan">OP_CLTV</span></div>
      <div><span class="text-orange">OP_DROP</span></div>
      <div>
        <span class="text-orange mr-1.5">OP_PUSHBYTES_33</span>
        <span :class="refundAccent">&lt;{{ refundName }}'s key&gt;</span>
      </div>
    </div>

    <div><span class="text-cyan">OP_ENDIF</span></div>
    <div><span class="text-red">OP_CHECKSIG</span></div>
  </div>
</template>
