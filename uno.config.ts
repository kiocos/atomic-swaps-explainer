import { defineConfig } from 'unocss'

// Boltz palette — boltz-web-app/src/style/theme.scss, boltz-theme="default".
// Exposed to UnoCSS so slides can use utilities (text-gold, border-cyan/40, …)
// instead of hand-written CSS. Presets are intentionally not declared here so
// Slidev's own presets — including presetIcons for Iconify — stay intact.
export default defineConfig({
  theme: {
    colors: {
      bg: '#09141f',
      surface: '#12253a',
      gold: '#e8cb2b',
      goldlt: '#fee86b',
      cyan: '#4fadc2',
      orange: '#f7931a',  // --color-btc-orange, and the Bitcoin mark
      teal: '#5db2a5',    // the Liquid mark
      purple: '#a06edc',  // the counterparty: Ledger B in part 1, Boltz in parts 2-3
      green: '#6cc47f',
      red: '#e8746e',
      body: '#d7dee4',
      muted: '#8a97a3',
    },
  },
  shortcuts: {
    // Frosted panel used by every card-like element in the deck.
    'pane': 'bg-white/4 border border-white/12 rounded-2xl',
    'pane-gold': 'bg-gold/6 border border-gold/40 rounded-2xl',
    'pane-cyan': 'bg-cyan/6 border border-cyan/40 rounded-2xl',
    'pane-green': 'bg-green/8 border border-green/40 rounded-2xl',
    'pane-red': 'bg-red/8 border border-red/40 rounded-2xl',
    'pane-orange': 'bg-orange/8 border border-orange/40 rounded-2xl',
    'pane-purple': 'bg-purple/8 border border-purple/40 rounded-2xl',
    'pane-teal': 'bg-teal/8 border border-teal/40 rounded-2xl',
    // Small uppercase label above a group.
    'eyebrow': 'text-[0.7rem] font-bold tracking-[0.14em] uppercase text-muted',
    // Pill used for the small facts that appear inside diagrams.
    'chip': 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap',
    'chip-gold': 'chip bg-gold/15 border-gold/45 text-gold',
    'chip-cyan': 'chip bg-cyan/15 border-cyan/45 text-cyan',
    'chip-green': 'chip bg-green/15 border-green/45 text-green',
    'chip-red': 'chip bg-red/15 border-red/45 text-red',
    'chip-orange': 'chip bg-orange/15 border-orange/45 text-orange',
    'chip-purple': 'chip bg-purple/15 border-purple/45 text-purple',
    'chip-teal': 'chip bg-teal/15 border-teal/45 text-teal',
  },
  safelist: [
    // Chain accents are chosen by prop in Lockup.vue / SwapCanvas.vue, so the
    // class strings never appear literally in source for UnoCSS to scan.
    'text-orange', 'text-purple', 'text-teal', 'text-gold', 'text-cyan', 'text-green', 'text-red',
    'border-orange/45', 'border-purple/45', 'border-teal/45', 'border-gold/45', 'border-cyan/45',
    'border-green/45', 'border-red/45',
    'bg-orange/8', 'bg-purple/8', 'bg-teal/8', 'bg-gold/8', 'bg-cyan/8', 'bg-green/8', 'bg-red/8',
    'i-ph-stack-simple-bold',
  ],
})
