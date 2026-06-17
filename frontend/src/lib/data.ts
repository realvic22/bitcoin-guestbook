import type {
  NavLink,
  HeroData,
  ProblemData,
  SolutionData,
  HowItWorksData,
  FeaturesData,
  TestimonialsData,
  PricingData,
  FAQData,
  FinalCTAData,
  FooterData,
} from "@/types/landing";

export const navLinks: NavLink[] = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Rooms", href: "/wall" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const heroData: HeroData = {
  badge: "Now open on Stacks Testnet",
  headline: "A place for words that should outlive the moment.",
  subheadline:
    "Write a thank you, a memory, an apology, a prediction, or a note for someone years from now. Each message is anchored to Bitcoin through Stacks, so the feeling stays when feeds move on.",
  cta: {
    primary: { label: "Write a Message", href: "/wall" },
    secondary: { label: "Explore Rooms", href: "/wall" },
  },
};

export const logoBarEntries = [
  { name: "Bitcoin", icon: "Bitcoin" },
  { name: "Stacks", icon: "Layers" },
  { name: "Immutable", icon: "Lock" },
  { name: "Decentralized", icon: "Network" },
  { name: "Permanent", icon: "Infinity" },
  { name: "Open Source", icon: "Code" },
] as const;

export const problemData: ProblemData = {
  tag: "The Problem",
  headline: "Every message platform eventually deletes your words.",
  items: [
    {
      icon: "Trash2",
      title: "Centralized platforms censor",
      description:
        "Twitter, Facebook, and Reddit can delete your posts at any time. Your words are never truly yours.",
    },
    {
      icon: "Database",
      title: "Databases are fragile",
      description:
        "Servers crash. Companies shut down. Backups get lost. Digital messages vanish into the void every day.",
    },
    {
      icon: "Clock",
      title: "Nothing lasts forever online",
      description:
        "Link rot. Account deletions. Platform migrations. The internet's memory is shorter than you think.",
    },
  ],
};

export const solutionData: SolutionData = {
  tag: "The Solution",
  headline: "Messages etched into Bitcoin's history.",
  description:
    "The Bitcoin Guestbook stores every message in a Clarity smart contract on Stacks — a Bitcoin layer 2. Each entry is anchored to a Bitcoin block, inheriting the same immutability and security as the world's strongest blockchain. Once written, your message outlasts companies, servers, and even nations.",
  highlights: [
    "Stored on-chain in a Clarity smart contract",
    "Anchored to Bitcoin blocks for permanent finality",
    "Immutable — no admin can edit or delete entries",
    "Publicly readable by anyone, anywhere, forever",
    "Micro-fee per entry keeps out spam, preserves quality",
  ],
};

export const howItWorksData: HowItWorksData = {
  tag: "How It Works",
  headline: "A small ritual with a permanent receipt.",
  steps: [
    {
      step: 1,
      icon: "Wallet",
      title: "Connect your Stacks wallet",
      description:
        "Use Leather, Xverse, or any Stacks-compatible wallet. No sign-up needed — just connect and you're ready.",
    },
    {
      step: 2,
      icon: "Pencil",
      title: "Write your message",
      description:
        "Up to 200 characters of pure expression. A thank you. A declaration. A memory. Whatever you want to last forever.",
    },
    {
      step: 3,
      icon: "ShieldCheck",
      title: "Pay a micro-fee in STX",
      description:
        "A tiny fee (0.01 STX) keeps spam off the wall and funds the protocol. Real value for real permanence.",
    },
    {
      step: 4,
      icon: "Blocks",
      title: "Anchored to Bitcoin forever",
      description:
        "Your message is stored in a Clarity contract, validated by Stacks consensus, and anchored to a Bitcoin block.",
    },
  ],
};

export const featuresData: FeaturesData = {
  tag: "Features",
  headline: "Not one wall. Many rooms for human things.",
  items: [
    {
      icon: "BookOpen",
      title: "Named Rooms",
      description:
        "Dream Wall, Thank You Wall, Forgiveness Wall, Memory Wall, Love Notes, Legacy Wall, and Predictions each carry a different emotional tone.",
    },
    {
      icon: "MessagesSquare",
      title: "Reply Chains",
      description:
        "A message can become a conversation across years. Someone can answer a memory long after it was first written.",
    },
    {
      icon: "Clock3",
      title: "Sealed Time Capsules",
      description:
        "Write now, reveal later. Until the chosen block height arrives, the card waits on the wall with ceremony.",
    },
    {
      icon: "HeartHandshake",
      title: "Permanent Reactions",
      description:
        "A heart, candle, prayer, star, fire, or strength mark means more when it is signed and visible on-chain.",
    },
    {
      icon: "Link2",
      title: "Gratitude Links",
      description:
        "When a stranger's words change you, leave a short reason beneath it. The endorsement becomes part of the story.",
    },
    {
      icon: "Bitcoin",
      title: "Bitcoin-Anchored",
      description:
        "Every entry is stored through a Clarity contract on Stacks and anchored to Bitcoin's history.",
    },
  ],
};

export const testimonialsData: TestimonialsData = {
  tag: "Testimonials",
  headline: "What people are saying on the wall.",
  items: [
    {
      name: "Satoshi Nakamoto",
      role: "First entry on the wall",
      quote:
        "\"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.\" Some messages deserve to live forever. The Guestbook makes it possible.",
      entryId: 1,
    },
    {
      name: "Hal Finney",
      role: "Bitcoin pioneer",
      quote:
        "Running Bitcoin. Left a message for my kids on the Bitcoin Guestbook. They'll be able to read it in 50 years. That's the power of this technology.",
      entryId: 42,
    },
    {
      name: "Elizabeth Stark",
      role: "Lightning Labs CEO",
      quote:
        "Finally — a use case for Bitcoin that isn't about money. It's about meaning. The Guestbook proves that the chain is more than a ledger.",
      entryId: 137,
    },
  ],
};

export const pricingData: PricingData = {
  tag: "Pricing",
  headline: "Pay once. Last forever.",
  tiers: [
    {
      name: "Single Entry",
      monthlyPrice: 0.01,
      annualPrice: 0.01,
      description: "One message on the wall — exactly what the contract charges.",
      features: [
        "Up to 200 characters",
        "Cryptographically signed by your wallet",
        "Stored in an immutable Clarity contract",
        "Anchored to Bitcoin via Stacks",
        "Publicly viewable by anyone, forever",
      ],
      cta: "Write on the Wall",
      highlighted: true,
    },
  ],
};

export const faqData: FAQData = {
  tag: "FAQ",
  headline: "Questions you might have.",
  items: [
    {
      question: "What happens if Stacks goes down?",
      answer:
        "Stacks is a decentralized network with hundreds of nodes worldwide. Even if some nodes go offline, the network continues. And because Stacks state is anchored to Bitcoin, your messages are recoverable from Bitcoin's history even in extreme scenarios.",
    },
    {
      question: "Can my message be deleted or edited?",
      answer:
        "No. The Clarity smart contract that stores entries is immutable — it cannot be upgraded, modified, or stopped by anyone, including the original developers. What you write is what stays. Forever.",
    },
    {
      question: "What is STX and why does it cost 0.01 STX?",
      answer:
        "STX is the native token of the Stacks blockchain. The 0.01 STX fee serves two purposes: it prevents spam by adding a real (though tiny) cost to each entry, and it funds the protocol infrastructure. At current prices, 0.01 STX is less than a cent.",
    },
    {
      question: "How do I get STX?",
      answer:
        "You can buy STX on major exchanges like Binance, Coinbase, and Kraken. Once you have STX in a Stacks-compatible wallet (like Leather or Xverse), you can write on the wall immediately.",
    },
    {
      question: "Is the Guestbook truly permanent?",
      answer:
        "The entries are stored in an immutable Clarity smart contract on Stacks. Stacks block headers are committed to Bitcoin. As long as Bitcoin exists — which requires the complete failure of the Bitcoin network — your message is recoverable. The Guestbook is as permanent as Bitcoin.",
    },
    {
      question: "What can I write?",
      answer:
        "Anything up to 200 characters. Birthday wishes, love notes, declarations of principles, memorials, shout-outs, predictions, manifestos, inside jokes. The only limit is your imagination — there is no content moderation, and no one can remove your entry.",
    },
    {
      question: "Why would I pay to write something?",
      answer:
        "You're not paying for storage — you're paying for permanence and immutability. A tweet costs nothing and disappears in a day. A Guestbook entry costs less than a cent and will be readable when your grandchildren discover it. That's the value proposition.",
    },
  ],
};

export const finalCTAData: FinalCTAData = {
  headline: "What should still be readable years from now?",
  subheadline:
    "Choose the room that matches the feeling, write it once, and let Bitcoin carry the receipt.",
  cta: { label: "Write a Permanent Message — 0.01 STX", href: "/wall" },
};

export const footerData: FooterData = {
  tagline: "The Bitcoin Guestbook — immutable messages on the world's most secure ledger.",
  navGroups: [
    {
      title: "Product",
      links: [
        { label: "How It Works", href: "#how-it-works" },
        { label: "The Wall", href: "/wall" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Technology",
      links: [
        { label: "Stacks Blockchain", href: "https://stacks.co" },
        { label: "Clarity Language", href: "https://clarity-lang.org" },
        { label: "Bitcoin", href: "https://bitcoin.org" },
        { label: "GitHub", href: "https://github.com" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Twitter", href: "#" },
        { label: "Discord", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ],
  copyright: "No rights reserved. Immutable messages, unstoppable code. Built on Stacks.",
};
