import { fetchCallReadOnlyFunction, Cl } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME, getNetwork } from "./stacks";

function readOnlyBase(senderAddress: string) {
  return { contractAddress: CONTRACT_ADDRESS, contractName: CONTRACT_NAME, senderAddress, network: getNetwork() };
}

export interface EntryFull {
  author: string; message: string; block: string;
  pageId: number | null; parentId: number | null; revealBlock: number | null;
}

export interface PageData { creator: string; name: string; description: string; color: string; entryCount: number; }
export interface ReactionCounts { heart: number; pray: number; strong: number; fire: number; candle: number; star: number; }

function extractOptional(v: any): any { return v?.type === "some" ? extractValue(v.value) : v?.type === "none" ? null : null; }
function extractValue(v: any): any {
  if (!v || typeof v !== "object") return v;
  if (v.type === "uint" || v.type === "int") return Number(v.value);
  if (v.type === "bool") return v.value;
  if (v.type === "address" || v.type === "principal" || v.type === "string-ascii") return v.value;
  return v.value;
}

// Entries
export async function getEntryCount(sender: string): Promise<number> {
  const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-entry-count", functionArgs: [] });
  return r.type === "uint" ? Number(r.value) : 0;
}

export async function getEntry(entryId: number, sender: string): Promise<EntryFull | null> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-entry", functionArgs: [Cl.uint(entryId)] });
    if (r.type === "tuple") {
      const v = r.value;
      return {
        author: String(v.author?.value ?? ""), message: String(v.message?.value ?? ""),
        block: String(v.block?.value ?? ""),
        pageId: extractOptional(v["page-id"]), parentId: extractOptional(v["parent-id"]), revealBlock: extractOptional(v["reveal-block"]),
      };
    }
    return null;
  } catch { return null; }
}

// Pages
export async function getPageCount(sender: string): Promise<number> {
  const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-page-count", functionArgs: [] });
  return r.type === "uint" ? Number(r.value) : 0;
}

export async function getPage(pageId: number, sender: string): Promise<PageData | null> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-page", functionArgs: [Cl.uint(pageId)] });
    if (r.type === "tuple") {
      const v = r.value;
      return { creator: String(v.creator?.value ?? ""), name: String(v.name?.value ?? ""), description: String(v.description?.value ?? ""), color: String(v.color?.value ?? "#9e9e9e"), entryCount: Number(v["entry-count"]?.value ?? 0) };
    }
    return null;
  } catch { return null; }
}

// Reactions
export async function getReactions(entryId: number, sender: string): Promise<ReactionCounts> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-reactions", functionArgs: [Cl.uint(entryId)] });
    if (r.type === "tuple") {
      const v = r.value;
      return { heart: Number(v.heart?.value ?? 0), pray: Number(v.pray?.value ?? 0), strong: Number(v.strong?.value ?? 0), fire: Number(v.fire?.value ?? 0), candle: Number(v.candle?.value ?? 0), star: Number(v.star?.value ?? 0) };
    }
    return { heart: 0, pray: 0, strong: 0, fire: 0, candle: 0, star: 0 };
  } catch { return { heart: 0, pray: 0, strong: 0, fire: 0, candle: 0, star: 0 }; }
}

export async function getUserReaction(entryId: number, user: string, sender: string): Promise<number | null> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-user-reaction", functionArgs: [Cl.uint(entryId), Cl.principal(user)] });
    return r.type === "some" ? Number(r.value?.value ?? 0) : null;
  } catch { return null; }
}

// Username / Search
export async function getPrincipal(username: string, sender: string): Promise<string | null> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-principal", functionArgs: [Cl.stringAscii(username)] });
    return r.type === "principal" ? String(r.value) : null;
  } catch { return null; }
}

export async function getUsername(who: string, sender: string): Promise<string | null> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-username", functionArgs: [Cl.principal(who)] });
    return r.type === "some" ? String(r.value?.value ?? "") : null;
  } catch { return null; }
}

export async function getUserEntryCount(who: string, sender: string): Promise<number> {
  const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-user-entry-count", functionArgs: [Cl.principal(who)] });
  return r.type === "uint" ? Number(r.value) : 0;
}

export async function getUserEntryAt(who: string, pos: number, sender: string): Promise<number | null> {
  try {
    const r: any = await fetchCallReadOnlyFunction({ ...readOnlyBase(sender), functionName: "get-user-entry-at", functionArgs: [Cl.principal(who), Cl.uint(pos)] });
    return r.type === "uint" ? Number(r.value) : null;
  } catch { return null; }
}
