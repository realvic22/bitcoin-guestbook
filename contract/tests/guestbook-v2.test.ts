import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;
const charlie = accounts.get("wallet_3")!;

describe("guestbook-v2", () => {
  // -- Seed & Pages ---------------------------------------------------

  it("deployer can seed default pages", () => {
    const tx = simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    expect(tx.result).toBeOk(Cl.bool(true));
  });

  it("pages cannot be seeded twice", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    const tx2 = simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    expect(tx2.result).toBeErr(Cl.uint(112)); // ERR_ALREADY_SEEDED
  });

  it("reads seeded pages correctly", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);

    const page = simnet.callReadOnlyFn("guestbook-v2", "get-page", [Cl.uint(1)], deployer);
    expect(page.result).toBeOk(
      Cl.tuple({
        creator: Cl.principal(deployer),
        name: Cl.stringAscii("Dream Wall"),
        description: Cl.stringAscii("What you hope for."),
        color: Cl.stringAscii("#7c6fcd"),
        "entry-count": Cl.uint(0),
      })
    );

    const count = simnet.callReadOnlyFn("guestbook-v2", "get-page-count", [], deployer);
    expect(count.result).toBeOk(Cl.uint(8));
  });

  // -- Write Entry ----------------------------------------------------

  it("write stores entry with optional fields", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);

    const tx = simnet.callPublicFn(
      "guestbook-v2",
      "write",
      [
        Cl.stringAscii("Hello Dream Wall"),
        Cl.some(Cl.uint(1)),
        Cl.none(),
        Cl.none(),
      ],
      alice
    );
    expect(tx.result).toBeOk(Cl.uint(1));
  });

  it("write with all optional fields set", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);

    const tx = simnet.callPublicFn(
      "guestbook-v2",
      "write",
      [
        Cl.stringAscii("A reply to entry 1"),
        Cl.some(Cl.uint(2)),      // page-id = 2 (Thank You Wall)
        Cl.some(Cl.uint(1)),      // parent-id = 1
        Cl.some(Cl.uint(500)),   // reveal-block = 500
      ],
      bob
    );
    expect(tx.result).toBeOk(Cl.uint(1));
  });

  it("entry-count increases", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("a"), Cl.none(), Cl.none(), Cl.none()], alice);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("b"), Cl.none(), Cl.none(), Cl.none()], bob);

    const count = simnet.callReadOnlyFn("guestbook-v2", "get-entry-count", [], deployer);
    expect(count.result).toBeOk(Cl.uint(2));
  });

  it("write indexes entries under user for search", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg 1"), Cl.none(), Cl.none(), Cl.none()], alice);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg 2"), Cl.none(), Cl.none(), Cl.none()], alice);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg 3"), Cl.none(), Cl.none(), Cl.none()], bob);

    const aliceCount = simnet.callReadOnlyFn(
      "guestbook-v2", "get-user-entry-count", [Cl.principal(alice)], deployer
    );
    expect(aliceCount.result).toBeOk(Cl.uint(2));

    const aliceEntry = simnet.callReadOnlyFn(
      "guestbook-v2", "get-user-entry-at", [Cl.principal(alice), Cl.uint(1)], deployer
    );
    expect(aliceEntry.result).toBeOk(Cl.uint(1));

    const secondEntry = simnet.callReadOnlyFn(
      "guestbook-v2", "get-user-entry-at", [Cl.principal(alice), Cl.uint(2)], deployer
    );
    expect(secondEntry.result).toBeOk(Cl.uint(2));
  });

  // -- Usernames ------------------------------------------------------

  it("register username", () => {
    simnet.callPublicFn("guestbook-v2", "register-username", [Cl.stringAscii("alice")], alice);
    const principal = simnet.callReadOnlyFn(
      "guestbook-v2", "get-principal", [Cl.stringAscii("alice")], deployer
    );
    expect(principal.result).toBeOk(Cl.principal(alice));
  });

  it("prevents duplicate username registration", () => {
    simnet.callPublicFn("guestbook-v2", "register-username", [Cl.stringAscii("satoshi")], alice);
    const tx = simnet.callPublicFn("guestbook-v2", "register-username", [Cl.stringAscii("satoshi")], bob);
    expect(tx.result).toBeErr(Cl.uint(106)); // ERR_USERNAME_TAKEN
  });

  it("reverse lookup works", () => {
    simnet.callPublicFn("guestbook-v2", "register-username", [Cl.stringAscii("bob")], bob);
    const name = simnet.callReadOnlyFn(
      "guestbook-v2", "get-username", [Cl.principal(bob)], deployer
    );
    expect(name.result).toBeOk(Cl.some(Cl.stringAscii("bob")));
  });

  it("unregistered user returns none", () => {
    const name = simnet.callReadOnlyFn(
      "guestbook-v2", "get-username", [Cl.principal(charlie)], deployer
    );
    expect(name.result).toBeOk(Cl.none());
  });

  // -- Reactions ------------------------------------------------------

  it("react to an entry", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg"), Cl.none(), Cl.none(), Cl.none()], alice);

    const tx = simnet.callPublicFn(
      "guestbook-v2",
      "react",
      [Cl.uint(1), Cl.some(Cl.uint(1))], // emoji 1 = heart
      bob
    );
    expect(tx.result).toBeOk(Cl.uint(1));
  });

  it("reaction counts update correctly", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg"), Cl.none(), Cl.none(), Cl.none()], alice);

    // Two users give hearts
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(1))], bob);
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(1))], charlie);

    const reactions = simnet.callReadOnlyFn(
      "guestbook-v2", "get-reactions", [Cl.uint(1)], deployer
    );
    expect(reactions.result).toBeOk(
      Cl.tuple({
        heart: Cl.uint(2),
        pray: Cl.uint(0),
        strong: Cl.uint(0),
        fire: Cl.uint(0),
        candle: Cl.uint(0),
        star: Cl.uint(0),
      })
    );
  });

  it("changing reaction moves counts correctly", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg"), Cl.none(), Cl.none(), Cl.none()], alice);

    // Bob gives heart, then changes to fire
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(1))], bob);
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(4))], bob);

    const reactions = simnet.callReadOnlyFn(
      "guestbook-v2", "get-reactions", [Cl.uint(1)], deployer
    );
    expect(reactions.result).toBeOk(
      Cl.tuple({
        heart: Cl.uint(0),
        pray: Cl.uint(0),
        strong: Cl.uint(0),
        fire: Cl.uint(1),
        candle: Cl.uint(0),
        star: Cl.uint(0),
      })
    );
  });

  it("removing reaction works", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    simnet.callPublicFn("guestbook-v2", "write", [Cl.stringAscii("msg"), Cl.none(), Cl.none(), Cl.none()], alice);

    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(3))], bob);
    // Remove reaction
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.none()], bob);

    const reactions = simnet.callReadOnlyFn(
      "guestbook-v2", "get-reactions", [Cl.uint(1)], deployer
    );
    expect(reactions.result).toBeOk(
      Cl.tuple({
        heart: Cl.uint(0), pray: Cl.uint(0), strong: Cl.uint(0),
        fire: Cl.uint(0), candle: Cl.uint(0), star: Cl.uint(0),
      })
    );

    const userReaction = simnet.callReadOnlyFn(
      "guestbook-v2", "get-user-reaction", [Cl.uint(1), Cl.principal(bob)], deployer
    );
    expect(userReaction.result).toBeOk(Cl.none());
  });

  // -- Create Page ----------------------------------------------------

  it("users can create custom pages", () => {
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);
    const tx = simnet.callPublicFn(
      "guestbook-v2",
      "create-page",
      [
        Cl.stringAscii("My Wall"),
        Cl.stringAscii("Personal thoughts"),
        Cl.stringAscii("#ff6600"),
      ],
      alice
    );
    expect(tx.result).toBeOk(Cl.uint(9)); // After 8 default pages = page 9
  });

  // -- Full integration flow ------------------------------------------

  it("full flow: seed - register - write - react - search", () => {
    // Seed
    simnet.callPublicFn("guestbook-v2", "seed-pages", [], deployer);

    // Register
    simnet.callPublicFn("guestbook-v2", "register-username", [Cl.stringAscii("alice")], alice);

    // Write
    simnet.callPublicFn("guestbook-v2", "write", [
      Cl.stringAscii("I dreamed of flying"),
      Cl.some(Cl.uint(1)), // Dream Wall
      Cl.none(),
      Cl.none(),
    ], alice);

    simnet.callPublicFn("guestbook-v2", "write", [
      Cl.stringAscii("I am grateful for this"),
      Cl.some(Cl.uint(2)), // Thank You Wall
      Cl.none(),
      Cl.none(),
    ], alice);

    // React
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(1))], bob);
    simnet.callPublicFn("guestbook-v2", "react", [Cl.uint(1), Cl.some(Cl.uint(5))], charlie);

    // Search by username
    const principal = simnet.callReadOnlyFn(
      "guestbook-v2", "get-principal", [Cl.stringAscii("alice")], deployer
    );
    expect(principal.result).toBeOk(Cl.principal(alice));

    // Check user entries
    const userCount = simnet.callReadOnlyFn(
      "guestbook-v2", "get-user-entry-count", [Cl.principal(alice)], deployer
    );
    expect(userCount.result).toBeOk(Cl.uint(2));

    // Verify reactions on entry 1
    const reactions = simnet.callReadOnlyFn(
      "guestbook-v2", "get-reactions", [Cl.uint(1)], deployer
    );
    expect(reactions.result).toBeOk(
      Cl.tuple({
        heart: Cl.uint(1), pray: Cl.uint(0), strong: Cl.uint(0),
        fire: Cl.uint(0), candle: Cl.uint(1), star: Cl.uint(0),
      })
    );

    // Verify entry 1 is on the Dream Wall
    const entry = simnet.callReadOnlyFn(
      "guestbook-v2", "get-entry", [Cl.uint(1)], deployer
    );
    expect(entry.result).toBeOk(
      Cl.tuple({
        author: Cl.principal(alice),
        message: Cl.stringAscii("I dreamed of flying"),
        block: Cl.uint(4),
        "page-id": Cl.some(Cl.uint(1)),
        "parent-id": Cl.none(),
        "reveal-block": Cl.none(),
      })
    );
  });
});
