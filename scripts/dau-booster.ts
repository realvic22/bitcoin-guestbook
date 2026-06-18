import { mnemonicToSeedSync } from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import {
  makeContractCall,
  broadcastTransaction,
  fetchNonce,
  fetchCallReadOnlyFunction,
  getAddressFromPrivateKey,
  Cl,
  AnchorMode,
  PostConditionMode,
} from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET, createNetwork } from "@stacks/network";

const bip32 = BIP32Factory(ecc);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
const CONTRACT_NAME = process.env.CONTRACT_NAME || "guestbook-v2";
const NETWORK_LABEL = process.env.NETWORK === "testnet" ? "testnet" : "mainnet";
const HIRO_API_KEY = process.env.HIRO_API_KEY;

const NETWORK = HIRO_API_KEY
  ? createNetwork(NETWORK_LABEL === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET, HIRO_API_KEY)
  : (NETWORK_LABEL === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET);

const STACKS_FEE = Number(process.env.STACKS_FEE || 5000);
const MNEMONIC = process.env.MNEMONIC;

const R = "\x1b[0m";
const G = "\x1b[32m";
const Y = "\x1b[33m";
const RE = "\x1b[31m";
const C = "\x1b[36m";
const B = "\x1b[1m";

const REACTION_FEE = 1000;
const ENTRY_FEE = 10000;

interface Wallet {
  index: number;
  address: string;
  privateKey: string;
}

interface TxResult {
  walletIndex: number;
  address: string;
  txId: string | null;
  fn: string;
  error?: string;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    opts[args[i].replace("--", "")] = args[i + 1];
  }
  const start = parseInt(opts.start);
  const end = parseInt(opts.end);
  if (isNaN(start) || isNaN(end) || start < 0 || end < start) {
    throw new Error("Usage: --start <N> --end <N> (e.g. --start 1 --end 100)");
  }
  return { start, end };
}

function deriveWallets(mnemonic: string, start: number, end: number): Wallet[] {
  const seed = mnemonicToSeedSync(mnemonic);
  const master = bip32.fromSeed(seed);
  const wallets: Wallet[] = [];
  for (let i = start; i <= end; i++) {
    const child = master.derivePath(`m/44'/5757'/0'/0/${i}`);
    if (!child.privateKey) throw new Error(`Failed to derive key for index ${i}`);
    const privHex = Buffer.from(child.privateKey).toString("hex");
    const address = getAddressFromPrivateKey(privHex, NETWORK_LABEL);
    wallets.push({ index: i, address, privateKey: privHex });
  }
  return wallets;
}

async function getEntryCount(): Promise<number> {
  try {
    const r: any = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-entry-count",
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
      network: NETWORK,
    });
    return r.type === "ok" && r.value?.type === "uint" ? Number(r.value.value) : 0;
  } catch {
    return 0;
  }
}

async function fetchWalletNonce(address: string): Promise<number> {
  try {
    const nonce = await fetchNonce({ address, network: NETWORK });
    return Number(nonce);
  } catch {
    return 0;
  }
}

async function broadcastReact(
  wallet: Wallet, entryId: number, nonce: number
): Promise<string | null> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "react",
    functionArgs: [Cl.uint(entryId), Cl.some(Cl.uint(1))],
    senderKey: wallet.privateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    nonce,
    fee: STACKS_FEE,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  return (result as any).txid || (result as any).txId || null;
}

async function broadcastWrite(
  wallet: Wallet, nonce: number
): Promise<string | null> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "write",
    functionArgs: [
      Cl.stringAscii("gm"),
      Cl.none(),
      Cl.none(),
      Cl.none(),
    ],
    senderKey: wallet.privateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    nonce,
    fee: STACKS_FEE,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  return (result as any).txid || (result as any).txId || null;
}

async function main() {
  if (!MNEMONIC) {
    console.log(`${RE}MNEMONIC env var is required${R}`);
    process.exit(1);
  }

  const { start, end } = parseArgs();
  const count = end - start + 1;

  console.log(`\n${C}${B}=== DAU Booster ===${R}\n`);
  console.log(`Wallets:  ${start} → ${end}  (${count} total)`);
  console.log(`Network:  ${NETWORK_LABEL}`);
  console.log(`Fee:      ${STACKS_FEE} microSTX`);
  console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);

  console.log(`\n${Y}Deriving ${count} wallets...${R}`);
  const wallets = deriveWallets(MNEMONIC, start, end);
  if (count <= 5) wallets.forEach((w) => console.log(`  [${w.index}] ${w.address}`));
  else {
    console.log(`  [${wallets[0].index}] ${wallets[0].address}`);
    console.log(`  ...`);
    console.log(`  [${wallets[count - 1].index}] ${wallets[count - 1].address}`);
  }

  console.log(`\n${Y}Querying contract entry count...${R}`);
  const totalEntries = await getEntryCount();
  console.log(`  Total entries on contract: ${totalEntries}`);

  let fn: "react" | "write";
  let feePerTx: number;

  if (totalEntries > 0) {
    fn = "react";
    feePerTx = REACTION_FEE;
    console.log(`\n${G}Strategy: react${R} (0.001 STX per tx — cheapest)`);
  } else {
    fn = "write";
    feePerTx = ENTRY_FEE;
    console.log(`\n${Y}Strategy: write${R} (0.01 STX per tx — no entries to react to)`);
  }

  const totalStx = (count * feePerTx) / 1_000_000;
  console.log(`  Total cost: ~${totalStx.toFixed(4)} STX + gas fees`);

  console.log(`\n${Y}Fetching nonces for all wallets...${R}`);
  const nonces = await Promise.all(
    wallets.map((w) => fetchWalletNonce(w.address).then((n) => ({ index: w.index, nonce: n })))
  );
  const nonceMap = new Map(nonces.map((n) => [n.index, n.nonce]));

  console.log(`\n${C}${B}Broadcasting ${count} transactions in parallel...${R}\n`);

  const results: TxResult[] = await Promise.all(
    wallets.map(async (w) => {
      const nonce = nonceMap.get(w.index) ?? 0;
      try {
        let txId: string | null;
        if (fn === "react") {
          const entryId = Math.floor(Math.random() * totalEntries);
          txId = await broadcastReact(w, entryId, nonce);
        } else {
          txId = await broadcastWrite(w, nonce);
        }
        return { walletIndex: w.index, address: w.address, txId, fn };
      } catch (err: any) {
        return { walletIndex: w.index, address: w.address, txId: null, fn, error: err.message };
      }
    })
  );

  const success = results.filter((r) => r.txId);
  const fail = results.filter((r) => !r.txId);

  console.log(`\n${C}${B}=== Results ===${R}`);
  console.log(`${G}Success:${R} ${success.length}/${count}`);
  console.log(`${RE}Failed: ${R} ${fail.length}/${count}`);

  if (fail.length > 0) {
    console.log(`\n${RE}Failures:${R}`);
    fail.forEach((f) => console.log(`  [${f.walletIndex}] ${f.address.slice(0, 10)}... ${f.error || "unknown"}`));
  }

  if (success.length > 0) {
    console.log(`\n${G}Sample tx IDs:${R}`);
    success.slice(0, 5).forEach((r) => console.log(`  [${r.walletIndex}] ${r.txId?.slice(0, 24)}... (${r.fn})`));
    if (success.length > 5) console.log(`  ... and ${success.length - 5} more`);
  }

  console.log(`\n${G}Done!${R}\n`);
}

main().catch((e) => {
  console.error(`${RE}Fatal:${R}`, e.message);
  process.exit(1);
});
