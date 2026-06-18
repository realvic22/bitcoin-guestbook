# DAU Booster

Parallel transaction broadcaster that boosts Daily Active Users for the Bitcoin Guestbook contract by having N distinct wallets each perform one transaction simultaneously.

## How it works

1. Derives N HD wallets from `MNEMONIC` at `m/44'/5757'/0'/0/{start..end}`
2. Queries the contract for existing entries
3. Picks the **cheapest** function automatically:
   - **`react`** (0.001 STX) — if entries exist on the contract
   - **`write`** (0.01 STX) — fallback if no entries exist
4. Fetches all nonces, then broadcasts **all N transactions in parallel** via `Promise.all`

## Why Promise.all is safe

Each derived wallet has a **distinct address** → distinct nonce. No two transactions share the same sender, so there is zero risk of nonce collisions. All txs can be broadcast simultaneously without sequencing.

## Usage

```bash
MNEMONIC="your twelve word seed phrase" \
STACKS_FEE=5000 \
npx tsx scripts/dau-booster.ts --start 1 --end 100
```

## CLI args

| Arg | Description |
|-----|-------------|
| `--start` | First wallet index to use |
| `--end` | Last wallet index to use |

Range `--start 1 --end 100` = **100 wallets, 100 txs = 100 DAU**.

## Env vars

| Var | Description | Default |
|-----|-------------|---------|
| `MNEMONIC` | BIP-39 seed phrase for HD wallet derivation | **required** |
| `STACKS_FEE` | Custom tx fee in microSTX | `5000` |
| `HIRO_API_KEY` | Hiro API key to bypass rate limits (recommended for >10 wallets) | — |
| `CONTRACT_ADDRESS` | Stacks contract address | `SP2X9XZ...GAB1` |
| `CONTRACT_NAME` | Contract name | `guestbook-v2` |
| `NETWORK` | `"testnet"` or `"mainnet"` | `mainnet` |

## Example output

```
=== DAU Booster ===

Wallets:  1 → 100  (100 total)
Network:  mainnet
Fee:      5000 microSTX
Contract: SP2X9XZ...GAB1.guestbook-v2

Deriving 100 wallets...
  [1] SP3YR...
  ...
  [100] SP2XA...

Querying contract entry count...
  Total entries on contract: 42

Strategy: react (0.001 STX per tx — cheapest)
  Total cost: ~0.1000 STX + gas fees

Fetching nonces for all wallets...
Broadcasting 100 transactions in parallel...

=== Results ===
Success: 97/100
Failed:  3/100

Sample tx IDs:
  [1] f3a2b1c... (react)
  [2] 7d1e9f... (react)
  ...

Done!
```

## Dependencies

Already installed in `scripts/package.json`:
- `bip32` / `bip39` / `tiny-secp256k1` — HD wallet derivation
- `@stacks/transactions` / `@stacks/network` — tx building, signing, broadcasting
