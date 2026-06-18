# Transaction Generator

Sequential seeder script that populates the Bitcoin Guestbook contract with realistic data using HD wallets derived from a mnemonic.

## How it works

Runs in **two phases** across the wallet range:

### Phase 1 — Write entries
The first half of wallets each write a random message to a random page. Messages are drawn from a pool of 50 heartfelt/inspirational phrases.

### Phase 2 — Reactions, usernames, pages
The remaining wallets randomly pick one of three actions:
- **40% chance** — react to a previously written entry with a random emoji
- **30% chance** — register a unique username
- **30% chance** — create a custom page/wall

Each transaction waits **30 seconds** before the next to avoid rate limiting on mainnet.

## Usage

```bash
npx tsx scripts/generate-transactions.ts --mnemonic "your twelve words..." --start 0 --end 19
```

## CLI args

| Arg | Description |
|-----|-------------|
| `--mnemonic` | BIP-39 seed phrase for HD wallet derivation |
| `--start` | First wallet index |
| `--end` | Last wallet index |

Range `--start 0 --end 19` = **20 wallets** — 10 writers + 10 reactors/registrants.

## Env vars

| Var | Description | Default |
|-----|-------------|---------|
| `HIRO_API_KEY` | Hiro API key to bypass rate limits | — |

## Contract functions used

| Function | STX cost | Used in |
|----------|----------|---------|
| `write` | 0.01 STX | Phase 1 |
| `react` | 0.001 STX | Phase 2 |
| `register-username` | 0.05 STX | Phase 2 |
| `create-page` | 0.05 STX | Phase 2 |

## Content pools

Defined in `messages.ts`:

- **`MESSAGES`** — 50 messages (gratitude, memories, apologies, predictions)
- **`USERNAMES`** — 50 handle ideas (dreamwalker, quietstorm, wildflower...)
- **`PAGE_NAMES`** — 20 room names (Secret Garden, Bare Soul, Midnight Thoughts...)
- **`PAGE_DESCRIPTIONS`** — 10 descriptions
- **`COLORS`** — 10 hex colors for custom pages

## Example output

```
=== Bitcoin Guestbook Transaction Generator ===

Wallets: 0 to 19 (20 total)
Contract: SP2X9XZ...GAB1.guestbook-v2

Deriving wallets...
  [0] SP3YRM...
  [1] SP2XAZ...

=== Phase 1: Writing entries (wallets 0-9) ===

[1/20] SP3YRM... writing...
  OK wrote: "I hope whoever reads this finds peace" on page 3
  tx: f3a2b1c...

=== Phase 2: Reactions, usernames, pages (wallets 10-19) ===

[11/20] SP2XAZ...
  OK reacted heart to "Gratitude turned my life..." (#5)
  tx: 7d1e9f...

=== Summary ===
Wallets: 20
Entries written: 10
Total fees: ~0.1520 STX
```

## Dependencies

Already installed in `scripts/package.json`:
- `bip32` / `bip39` / `tiny-secp256k1` — HD wallet derivation
- `@stacks/transactions` / `@stacks/network` — tx building, signing, broadcasting
