import { mnemonicToSeedSync } from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import {
  makeContractCall,
  broadcastTransaction,
  getAddressFromPrivateKey,
  fetchNonce,
  Cl,
  AnchorMode,
  PostConditionMode,
  type StacksNetwork,
} from "@stacks/transactions";
import { STACKS_MAINNET, createNetwork } from "@stacks/network";
import {
  MESSAGES, USERNAMES, PAGE_NAMES, PAGE_DESCRIPTIONS,
  COLORS, EMOJI_IDS, EMOJI_LABELS,
} from "./messages";

const bip32 = BIP32Factory(ecc);
const CONTRACT_ADDRESS = "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
const CONTRACT_NAME = "guestbook-v2";
const HIRO_API_KEY = process.env.HIRO_API_KEY;
const NETWORK: StacksNetwork = HIRO_API_KEY
  ? createNetwork(STACKS_MAINNET, HIRO_API_KEY)
  : STACKS_MAINNET;

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";

interface Wallet {
  index: number;
  address: string;
  privateKey: string;
}

interface WrittenEntry {
  id: number;
  message: string;
  author: string;
  authorAddress: string;
  pageId: number | null;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    opts[args[i].replace("--", "")] = args[i + 1];
  }
  return {
    mnemonic: opts.mnemonic || "",
    start: parseInt(opts.start || "0"),
    end: parseInt(opts.end || "9"),
  };
}

function deriveWallets(mnemonic: string, start: number, end: number): Wallet[] {
  if (!mnemonic || mnemonic.split(" ").length < 12) {
    throw new Error("Invalid mnemonic. Must be 12+ words.");
  }
  const seed = mnemonicToSeedSync(mnemonic);
  const master = bip32.fromSeed(seed);
  const wallets: Wallet[] = [];

  for (let i = start; i <= end; i++) {
    const child = master.derivePath(`m/44'/5757'/0'/0/${i}`);
    if (!child.privateKey) throw new Error(`Failed to derive key for index ${i}`);
    const privHex = Buffer.from(child.privateKey).toString("hex");
    const address = getAddressFromPrivateKey(privHex, "mainnet");
    wallets.push({ index: i, address, privateKey: privHex });
  }
  return wallets;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getNonce(address: string): Promise<number> {
  try {
    const nonce = await fetchNonce({ address, network: NETWORK });
    return Number(nonce);
  } catch {
    return 0;
  }
}

async function writeEntry(
  wallet: Wallet, message: string, pageId: number | null, nonce: number
): Promise<string | null> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "write",
    functionArgs: [
      Cl.stringAscii(message),
      pageId ? Cl.some(Cl.uint(pageId)) : Cl.none(),
      Cl.none(),
      Cl.none(),
    ],
    senderKey: wallet.privateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    nonce,
    fee: 20000,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  return (result as any).txid || (result as any).txId || null;
}

async function reactToEntry(
  wallet: Wallet, entryId: number, emojiId: number, nonce: number
): Promise<string | null> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "react",
    functionArgs: [Cl.uint(entryId), Cl.some(Cl.uint(emojiId))],
    senderKey: wallet.privateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    nonce,
    fee: 20000,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  return (result as any).txid || (result as any).txId || null;
}

async function registerUsername(
  wallet: Wallet, username: string, nonce: number
): Promise<string | null> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "register-username",
    functionArgs: [Cl.stringAscii(username)],
    senderKey: wallet.privateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    nonce,
    fee: 20000,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  return (result as any).txid || (result as any).txId || null;
}

async function createPage(
  wallet: Wallet, name: string, desc: string, color: string, nonce: number
): Promise<string | null> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "create-page",
    functionArgs: [Cl.stringAscii(name), Cl.stringAscii(desc), Cl.stringAscii(color)],
    senderKey: wallet.privateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    nonce,
    fee: 20000,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  return (result as any).txid || (result as any).txId || null;
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const { mnemonic, start, end } = parseArgs();

  if (!mnemonic) {
    console.log(`${RED}Usage: npx tsx scripts/generate-transactions.ts --mnemonic "12 words..." --start 0 --end 9${RESET}`);
    process.exit(1);
  }

  const count = end - start + 1;
  console.log(`\n${CYAN}${BOLD}=== Bitcoin Guestbook Transaction Generator ===${RESET}\n`);
  console.log(`Wallets: ${start} to ${end} (${count} total)`);
  console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);

  console.log(`\n${YELLOW}Deriving wallets...${RESET}`);
  const wallets = deriveWallets(mnemonic, start, end);
  wallets.forEach((w) => console.log(`  [${w.index}] ${w.address}`));

  const midpoint = Math.floor(count / 2);
  const writtenEntries: WrittenEntry[] = [];
  const usedUsernames = new Set<string>();
  let totalFees = 0;

  console.log(`\n${CYAN}${BOLD}=== Phase 1: Writing entries (wallets 0-${midpoint - 1}) ===${RESET}\n`);

  for (let i = 0; i < midpoint; i++) {
    const wallet = wallets[i];
    const message = pick(MESSAGES);
    const pageId = Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : null;
    const pageLabel = pageId ? `page ${pageId}` : "General";

    console.log(`[${i + 1}/${count}] ${wallet.address.slice(0, 8)}... ${YELLOW}writing...${RESET}`);
    const nonce = await getNonce(wallet.address);
    const txId = await writeEntry(wallet, message, pageId, nonce);

    if (txId) {
      totalFees += 0.01;
      console.log(`  ${GREEN}OK${RESET} wrote: "${message}" on ${pageLabel}`);
      console.log(`  tx: ${txId.slice(0, 20)}...`);
      writtenEntries.push({ id: i + 1, message, author: wallet.address, authorAddress: wallet.address, pageId });
    } else {
      console.log(`  ${RED}FAIL${RESET} (may need STX — fund ${wallet.address})`);
    }
    if (i < midpoint - 1) { process.stdout.write(`  waiting 30s...`); await sleep(30000); process.stdout.write("\r\x1b[K"); }
  }

  console.log(`\n${CYAN}${BOLD}=== Phase 2: Reactions, usernames, pages (wallets ${midpoint}-${end}) ===${RESET}\n`);

  for (let i = midpoint; i < count; i++) {
    const wallet = wallets[i];
    const roll = Math.random();
    console.log(`[${i + 1}/${count}] ${wallet.address.slice(0, 8)}... `);
    const nonce = await getNonce(wallet.address);
    let txId: string | null = null;
    let action = "";

    if (roll < 0.4 && writtenEntries.length > 0) {
      const entry = pick(writtenEntries);
      const emojiId = pick(EMOJI_IDS);
      process.stdout.write(`${YELLOW}reacting...${RESET}`);
      txId = await reactToEntry(wallet, entry.id, emojiId, nonce);
      action = `reacted ${EMOJI_LABELS[emojiId]} to "${entry.message.slice(0, 30)}..." (#${entry.id})`;
      if (txId) totalFees += 0.001;
    } else if (roll < 0.7) {
      let username = pick(USERNAMES);
      while (usedUsernames.has(username)) username = pick(USERNAMES);
      usedUsernames.add(username);
      process.stdout.write(`${YELLOW}registering @${username}...${RESET}`);
      txId = await registerUsername(wallet, username, nonce);
      action = `registered @${username}`;
      if (txId) totalFees += 0.05;
    } else {
      const name = pick(PAGE_NAMES);
      const desc = pick(PAGE_DESCRIPTIONS);
      const color = pick(COLORS);
      process.stdout.write(`${YELLOW}creating page...${RESET}`);
      txId = await createPage(wallet, name, desc, color, nonce);
      action = `created page "${name}"`;
      if (txId) totalFees += 0.05;
    }

    if (txId) {
      console.log(`\n  ${GREEN}OK${RESET} ${action}`);
      console.log(`  tx: ${txId.slice(0, 20)}...`);
    } else {
      console.log(`\n  ${RED}FAIL${RESET} (may need STX — fund ${wallet.address})`);
    }
    if (i < count - 1) { process.stdout.write(`  waiting 30s...`); await sleep(30000); process.stdout.write("\r\x1b[K"); }
  }

  console.log(`\n${CYAN}${BOLD}=== Summary ===${RESET}`);
  console.log(`Wallets: ${count}`);
  console.log(`Entries written: ${writtenEntries.length}`);
  console.log(`Total fees: ~${totalFees.toFixed(4)} STX`);
  console.log(`Deployer can withdraw: ~${totalFees.toFixed(4)} STX via withdraw-fees`);
  console.log(`\n${GREEN}Done!${RESET}\n`);
}

main().catch((e) => {
  console.error(`${RED}Fatal:${RESET}`, e.message);
  process.exit(1);
});
