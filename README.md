# Atomic Swaps

A BitDevs talk on how atomic swaps work, using [Boltz](https://boltz.exchange) as the worked example.

**[View the slides →](https://kiocos.github.io/atomic-swaps-explainer/1)**

## Boltz

- [Documentation](https://docs.boltz.exchange) · [Web app docs](https://docs.boltz.exchange/web-app) · [API](https://api.boltz.exchange)
- [boltz-web-app](https://github.com/BoltzExchange/boltz-web-app) — the client, and where the address check runs
- [boltz-core](https://github.com/BoltzExchange/boltz-core) — swap scripts, Taproot trees, MuSig2
- [boltz-backend](https://github.com/BoltzExchange/boltz-backend) — the server

## The code in the talk

- [`validation.ts`](https://github.com/BoltzExchange/boltz-web-app/blob/master/src/utils/validation.ts) — rebuilds the lockup and compares, before showing you an address
- [`claim.ts`](https://github.com/BoltzExchange/boltz-web-app/blob/master/src/utils/claim.ts) — the cooperative claim, and the fallback to the script path
- [`ReverseSwapScript.ts`](https://github.com/BoltzExchange/boltz-core/blob/master/lib/swap/ReverseSwapScript.ts) — the pre-Taproot locking script
- [`ReverseSwapTree.ts`](https://github.com/BoltzExchange/boltz-core/blob/master/lib/swap/ReverseSwapTree.ts) — the two Taproot leaves
- [`TaprootUtils.ts`](https://github.com/BoltzExchange/boltz-core/blob/master/lib/swap/TaprootUtils.ts) — the tweak, and control blocks
- [`Scripts.ts`](https://github.com/BoltzExchange/boltz-core/blob/master/lib/swap/Scripts.ts) — `p2trOutput`, the whole on-chain locking script
- [`Musig.ts`](https://github.com/BoltzExchange/boltz-core/blob/master/lib/musig/Musig.ts) — key aggregation and partial signatures

## Background

- [Taproot](https://learnmeabitcoin.com/technical/upgrades/taproot/) — learnmeabitcoin
