import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

describe("guestbook contract", () => {
  it("allows writing a message and paying the fee", () => {
    const msg = "Hello from the Bitcoin Guestbook!";
    const tx = simnet.callPublicFn(
      "guestbook",
      "write",
      [Cl.stringAscii(msg)],
      alice
    );
    expect(tx.result).toBeOk(Cl.uint(1));

    const count = simnet.getDataVar("guestbook", "entry-count");
    expect(count).toBeUint(1);
  });

  it("stores the entry with correct author, message, and block", () => {
    const msg = "A message for the wall";
    const tx = simnet.callPublicFn(
      "guestbook",
      "write",
      [Cl.stringAscii(msg)],
      bob
    );
    // entry 1 is the only entry in this isolated test
    const entry = simnet.callReadOnlyFn(
      "guestbook",
      "get-entry",
      [Cl.uint(1)],
      bob
    );
    expect(entry.result).toBeOk(
      Cl.tuple({
        author: Cl.principal(bob),
        message: Cl.stringAscii(msg),
        block: Cl.uint(2),
      })
    );
  });

  it("increments entry-count on each write", () => {
    simnet.callPublicFn(
      "guestbook",
      "write",
      [Cl.stringAscii("message one")],
      alice
    );
    simnet.callPublicFn(
      "guestbook",
      "write",
      [Cl.stringAscii("message two")],
      bob
    );

    const count = simnet.getDataVar("guestbook", "entry-count");
    expect(count).toBeUint(2);
  });

  it("accumulates fees from multiple entries", () => {
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("msg 1")], alice);
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("msg 2")], bob);

    const fees = simnet.getDataVar("guestbook", "fees-collected");
    expect(fees).toBeUint(20000); // 2 * 10000 microSTX
  });

  it("get-entry returns the written message correctly", () => {
    const msg = "Permanent message etched in Bitcoin";
    simnet.callPublicFn(
      "guestbook",
      "write",
      [Cl.stringAscii(msg)],
      bob
    );

    const entry = simnet.callReadOnlyFn(
      "guestbook",
      "get-entry",
      [Cl.uint(1)],
      bob
    );
    expect(entry.result).toBeOk(
      Cl.tuple({
        author: Cl.principal(bob),
        message: Cl.stringAscii(msg),
        block: Cl.uint(2),
      })
    );
  });

  it("returns error for non-existent entry", () => {
    const entry = simnet.callReadOnlyFn(
      "guestbook",
      "get-entry",
      [Cl.uint(999)],
      alice
    );
    // ERR_NOT_FOUND = (err u101)
    expect(entry.result).toBeErr(Cl.uint(101));
  });

  it("allows owner to withdraw collected fees", () => {
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("paid msg")], bob);

    const feesBefore = simnet.getDataVar("guestbook", "fees-collected");
    expect(feesBefore).toBeUint(10000);

    const tx = simnet.callPublicFn("guestbook", "withdraw-fees", [], deployer);
    expect(tx.result).toBeOk(Cl.bool(true));

    const feesAfter = simnet.getDataVar("guestbook", "fees-collected");
    expect(feesAfter).toBeUint(0);
  });

  it("prevents non-owner from withdrawing fees", () => {
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("paid msg")], alice);

    const tx = simnet.callPublicFn("guestbook", "withdraw-fees", [], bob);
    // ERR_NOT_OWNER = (err u102)
    expect(tx.result).toBeErr(Cl.uint(102));
  });

  it("multiple wallets can write messages independently", () => {
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("alice msg")], alice);
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("bob msg")], bob);

    const entry1 = simnet.callReadOnlyFn(
      "guestbook",
      "get-entry",
      [Cl.uint(1)],
      alice
    );
    const entry2 = simnet.callReadOnlyFn(
      "guestbook",
      "get-entry",
      [Cl.uint(2)],
      bob
    );

    expect(entry1.result).toBeOk(
      Cl.tuple({
        author: Cl.principal(alice),
        message: Cl.stringAscii("alice msg"),
        block: Cl.uint(2),
      })
    );
    expect(entry2.result).toBeOk(
      Cl.tuple({
        author: Cl.principal(bob),
        message: Cl.stringAscii("bob msg"),
        block: Cl.uint(3),
      })
    );
  });

  it("get-entry-count reflects total entries written", () => {
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("a")], alice);
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("b")], bob);
    simnet.callPublicFn("guestbook", "write", [Cl.stringAscii("c")], alice);

    const count = simnet.callReadOnlyFn(
      "guestbook",
      "get-entry-count",
      [],
      alice
    );
    expect(count.result).toBeOk(Cl.uint(3));
  });
});
