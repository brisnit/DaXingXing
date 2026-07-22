// Core domain types for Da Xing Xing.
// These mirror the Supabase schema in /supabase/schema.sql and keep the
// mock-data layer type-safe so the UI is ready to swap in real data later.

export type ProjectStage =
  | "Idea"
  | "Concept"
  | "Specification"
  | "Feasibility Review"
  | "Manufacturer Matching"
  | "Quoting"
  | "Prototype"
  | "Testing"
  | "Revision"
  | "Production Ready"
  | "In Production"
  | "Quality Control"
  | "Shipping"
  | "Launch"
  | "Distribution";

export interface ProductProject {
  id: string;
  name: string;
  category: string;
  stage: ProjectStage;
  completion: number; // 0-100
  targetLaunch: string;
  budget: number;
  manufacturer?: string;
  latestUpdate: string;
  nextAction: string;
  summary: string;
  unitCostLow: number;
  unitCostHigh: number;
  retailTarget: number;
  quantity: number;
  feasibility: number; // 0-100
  render: string; // color seed for the generated SVG render
}

export interface Manufacturer {
  id: string;
  name: string;
  demo: true; // every marketplace profile is a labeled demo profile
  country: string;
  region: string;
  city: string;
  specialties: string[];
  materials: string[];
  methods: string[];
  certifications: string[];
  moq: number;
  leadTimeDays: number;
  prototypeCapable: boolean;
  capacity: string;
  languages: string[];
  exportRegions: string[];
  rating: number;
  onTime: number;
  communication: number;
  completedProjects: number;
  verified: boolean;
  usManufacturing: boolean;
  priceTier: 1 | 2 | 3;
  smallBatch: boolean;
  blurb: string;
}

export interface Material {
  id: string;
  name: string;
  group: string;
  swatch: string; // hex
  description: string;
  commonUses: string[];
  costTier: 1 | 2 | 3 | 4 | 5;
  durability: 1 | 2 | 3 | 4 | 5;
  weight: "Very light" | "Light" | "Medium" | "Heavy";
  sustainability: 1 | 2 | 3 | 4 | 5;
  compatibility: string[];
  colorAvailability: string;
  moqImplication: string;
  pros: string[];
  cons: string[];
}

export interface ProductCategory {
  name: string;
  slug: string;
  blurb: string;
  regulated?: boolean;
  regulationNote?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  priceLabel: string;
  forWho: string;
  includes: string[];
  featured?: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  forWho: string;
  features: string[];
  featured?: boolean;
}

export interface Quote {
  id: string;
  manufacturer: string;
  country: string;
  demo: true;
  prototypeCost: number;
  toolingCost: number;
  moldCost: number;
  unitCost: number;
  moq: number;
  samplingDays: number;
  productionDays: number;
  packagingCost: number;
  qcCost: number;
  shippingEstimate: number;
  dutiesEstimate: number;
  paymentTerms: string;
  expires: string;
  assumptions: string[];
  exclusions: string[];
  flags: { level: "warning" | "danger" | "info"; note: string }[];
}
