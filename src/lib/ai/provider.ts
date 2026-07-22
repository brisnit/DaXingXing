// AI provider abstraction.
// The platform's AI acts as a coordinated team: industrial designer, product
// strategist, mechanical engineer, material specialist, manufacturing advisor,
// cost analyst, packaging strategist, brand strategist, launch strategist, and
// supply-chain advisor. This module keeps the provider swappable (Anthropic,
// OpenAI, or the built-in mock) behind one interface.

export interface DesignSpecPatch {
  field: string;
  from?: string;
  to: string;
}

export interface DesignImpact {
  appearance?: string;
  dimensions?: string;
  materials?: string;
  unitCost?: string;
  manufacturing?: string;
  durability?: string;
  timeline?: string;
  sustainability?: string;
  compliance?: string;
}

export interface DesignReply {
  message: string;
  requiresApproval: boolean;
  proposedChanges: DesignSpecPatch[];
  impact: DesignImpact;
  openQuestions: string[];
}

export interface AiProvider {
  name: string;
  designChat(input: {
    prompt: string;
    history?: { role: "user" | "assistant"; content: string }[];
  }): Promise<DesignReply>;
}

export const AI_SYSTEM_BRIEF = `You are the Da Xing Xing product-creation assistant, acting as a coordinated team of an industrial designer, product strategist, mechanical engineer, material specialist, manufacturing advisor, cost analyst, packaging strategist, brand strategist, launch strategist, and supply-chain advisor.

Rules:
- Never claim an idea is production-ready when key information is missing.
- Ask focused follow-up questions.
- Clearly separate confirmed information from recommendations.
- Explain tradeoffs and identify missing specifications.
- Flag safety and compliance concerns; final compliance must be reviewed by qualified professionals and testing labs.
- Suggest affordable alternatives.
- Ask for approval before major design changes and keep a revision history.
- Avoid unsupported engineering guarantees.`;

/** Deterministic mock provider — realistic responses with no API key needed. */
export const mockProvider: AiProvider = {
  name: "mock",
  async designChat({ prompt }) {
    const p = prompt.toLowerCase();
    const changes: DesignSpecPatch[] = [];
    const impact: DesignImpact = {};
    let message = "";
    let requiresApproval = false;

    if (p.includes("aluminum") || p.includes("shell") || p.includes("material")) {
      changes.push({ field: "Outer shell material", from: "Recycled ABS", to: "Recycled aluminum 6061" });
      impact.materials = "Switches the shell to recycled aluminum for a premium, durable feel.";
      impact.unitCost = "Estimated unit cost rises ~$4–7 due to material and machining.";
      impact.manufacturing = "Moves from injection molding toward die casting or CNC — favors higher volumes.";
      impact.durability = "Improves impact and heat resistance; adds some weight.";
      impact.sustainability = "Recycled content keeps the sustainability score strong.";
      requiresApproval = true;
      message =
        "Switching the outer shell to recycled aluminum is a strong premium move. I've drafted the change below — it affects cost, weight, and manufacturing method, so I'd like your approval before applying it.";
    } else if (p.includes("usb-c") || p.includes("port") || p.includes("charge")) {
      changes.push({ field: "Ports", to: "Add USB-C charging + data port (IP-rated cover)" });
      impact.dimensions = "Requires a small cutout and internal clearance for the connector.";
      impact.unitCost = "Adds roughly $0.60–$1.20 per unit for the connector and seal.";
      impact.compliance = "USB-C data may add EMC considerations — flag for testing.";
      message =
        "I can add a USB-C port with a weather-resistant cover. Here's the proposed spec change and its impact.";
      requiresApproval = true;
    } else if (p.includes("price") || p.includes("cost") || p.includes("cheaper") || p.includes("$")) {
      changes.push({ field: "Target retail price", to: "$79" });
      impact.unitCost = "To protect margin at $79 retail, target unit cost near $22–26.";
      impact.materials = "Consider recycled ABS shell with a TPU bumper instead of metal.";
      impact.manufacturing = "Injection molding at 1,000+ units keeps per-unit cost low.";
      message =
        "To hit a lower retail price, I'd recommend adjusting materials and volume. Here's a proposed direction and its cost impact.";
      requiresApproval = true;
    } else if (p.includes("child") || p.includes("kid")) {
      message =
        "A children's version is possible. Note this triggers CPSIA and ASTM F963 requirements, small-parts rules, and additional testing. I've flagged compliance below — final review must be done by a qualified testing lab.";
      impact.compliance = "Children's-product safety testing (CPSIA, ASTM F963) required.";
      impact.timeline = "Add 3–5 weeks for compliance testing.";
      requiresApproval = true;
      changes.push({ field: "Product variant", to: "Children's edition (compliance-gated)" });
    } else {
      message =
        "Got it. I can help develop that. To move forward accurately, I have a couple of focused questions before I propose spec changes — see the open questions below. Nothing is applied to your specification until you approve it.";
    }

    return {
      message,
      requiresApproval,
      proposedChanges: changes,
      impact,
      openQuestions: requiresApproval
        ? ["Should I apply this change to your living specification now?"]
        : [
            "What is your target retail price?",
            "What is your expected first production quantity?",
            "Do you prefer US, overseas, or either for manufacturing?",
          ],
    };
  },
};

export function getAiProvider(): AiProvider {
  // Real adapters (Anthropic / OpenAI) can be wired here based on env vars.
  // Falls back to the deterministic mock so the app runs with zero config.
  return mockProvider;
}
