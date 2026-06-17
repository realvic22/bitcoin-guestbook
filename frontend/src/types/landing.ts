export interface NavLink {
  label: string;
  href: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  subheadline: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export interface LogoBarEntry {
  name: string;
  icon: string; // lucide icon name
}

export interface ProblemItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemData {
  tag: string;
  headline: string;
  items: ProblemItem[];
}

export interface SolutionData {
  tag: string;
  headline: string;
  description: string;
  highlights: string[];
}

export interface Step {
  step: number;
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksData {
  tag: string;
  headline: string;
  steps: Step[];
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesData {
  tag: string;
  headline: string;
  items: Feature[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  entryId: number;
}

export interface TestimonialsData {
  tag: string;
  headline: string;
  items: Testimonial[];
}

export interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface PricingData {
  tag: string;
  headline: string;
  tiers: PricingTier[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQData {
  tag: string;
  headline: string;
  items: FAQItem[];
}

export interface FinalCTAData {
  headline: string;
  subheadline: string;
  cta: { label: string; href: string };
}

export interface FooterData {
  tagline: string;
  navGroups: { title: string; links: { label: string; href: string }[] }[];
  copyright: string;
}
