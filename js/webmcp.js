/**
 * SIDC.AI WebMCP integration.
 * Registers static profile and framework tools when modelContext is available.
 */
(() => {
  "use strict";

  const context =
    globalThis.navigator?.modelContext || globalThis.document?.modelContext;

  if (!context?.registerTool) {
    return;
  }

  const emptyParameters = { type: "object", properties: {} };

  const professionalProfile = {
    identity: {
      name: "Siddhartha Chaturvedi",
      tagline: "AI Systems That Ship Outcomes, Not Drafts",
      linkedin: "https://linkedin.com/in/sidcai"
    },
    focus: "Advising CEOs and boards on AI systems that ship - in regulated, high-stakes, and infrastructure-heavy industries. Specializing in bridging the trust gap between generation and verification.",
    proofPoints: [
      { metric: "$60M investment", details: "Global Program Architect for Microsoft's AI for Health initiative addressing global child mortality, genomics, and health equity." },
      { award: "World Changing Ideas 2021", details: "Product team for Microsoft Premonition, a biothreat detection platform securing multi-million government contracts." },
      { scale: "300+ Use Cases", details: "Led Azure Gov GenAI program audits across US Federal civilian agencies." }
    ],
    advisoryAndVentures: [
      { entity: "StratCorp.AI", role: "Partner", description: "Board Advisory & AI Governance" },
      { entity: "rpv.global", role: "Limited Partner", description: "Deep Tech VC" },
      { entity: "Loyal VC", role: "Advisor", description: "Pre-seed Mentorship" }
    ]
  };

  const fieldNotes = [
    {
      title: "The Enterprise Refactor",
      kicker: "Software 3.0",
      url: "https://sidc.ai/essays/justai/",
      tldr: "Software 3.0 is a shift from deterministic code to probabilistic intent. Moats shift from generic intelligence to context (MCP), and operating discipline moves to verification systems."
    },
    {
      title: "The App That Builds Itself",
      kicker: "Generative UI",
      url: "https://sidc.ai/essays/interface-triage/",
      tldr: "Chat gave every problem the same text box. Real work triages into three interface shapes: Direct GUI (clicking), Headless Agent (background), and Generative UI (on-the-fly custom layouts)."
    },
    {
      title: "The Value Function",
      kicker: "Framework",
      url: "https://sidc.ai/essays/value-function/",
      tldr: "Enterprise AI fails when optimizing along a single axis. Alignment is a three-body problem balancing Resonance (voice), Relevance (evidence), and Response (workflow execution)."
    },
    {
      title: "AI Won't Simplify Work. It Might Finally Restore It.",
      kicker: "Future of Work",
      url: "https://sidc.ai/essays/fow/",
      tldr: "The real promise of the agentic era isn't speed - it's returning human attention to the complexity that actually deserves it."
    }
  ];

  const workloadTriage = {
    "known-object": {
      recommendedShape: "Direct GUI",
      rationale: "Best when the action is small, local, and requires precise direct manipulation. Generative UI is overkill here; conversational agents add unnecessary reading loop overhead.",
      executiveTest: "If the user can say 'change this line,' give them the line directly."
    },
    "analysis-loop": {
      recommendedShape: "Headless Agent",
      rationale: "Best when tasks are long-running, multi-system, and procedural. Hiding the screen prevents click fatigue, leaving the user to audit results or exceptions.",
      executiveTest: "If the job is 'do the analysis and report errors,' hide the screen completely."
    },
    "team-decision": {
      recommendedShape: "Generative UI",
      rationale: "Best when multiple stakeholders need to simulate and steer tradeoffs live. The interface dynamically constructs custom visual slides or sliders tailored to that specific meeting.",
      executiveTest: "If each team needs a custom lens on the same plan, generate the layout dynamically."
    }
  };

  const scoreParameter = (description) => ({
    type: "integer",
    minimum: 1,
    maximum: 10,
    description
  });

  const normalizeScore = (value) => {
    const score = Number(value);
    return Number.isFinite(score) ? Math.min(10, Math.max(1, Math.round(score))) : null;
  };

  const alertRules = [
    {
      when: ({ resonance, relevance }) => resonance > 7 && relevance < 5,
      code: "ROBOT_SLOP",
      severity: "high",
      message: "System sounds highly resonant and convincing but lacks factual relevance grounding. High risk of plausible-sounding hallucinations."
    },
    {
      when: ({ relevance, response }) => relevance > 7 && response < 5,
      code: "COGNITIVE_OVERHEAD",
      severity: "medium",
      message: "System has strong evidence citations but returns raw text narratives. Fails to automate response execution, adding reading work to human experts."
    },
    {
      when: ({ response, relevance }) => response > 7 && relevance < 5,
      code: "UNSAFE_MUTATION",
      severity: "critical",
      message: "System has high execution authority but weak grounding/relevance check. Critical risk of executing incorrect database writes or automated actions."
    }
  ];

  const evaluateEquilibrium = ({ resonance, relevance, response } = {}) => {
    const scores = {
      resonance: normalizeScore(resonance),
      relevance: normalizeScore(relevance),
      response: normalizeScore(response)
    };

    const missing = Object.entries(scores)
      .filter(([, value]) => value === null)
      .map(([name]) => name);

    if (missing.length) {
      return {
        scores,
        overallBalance: null,
        alerts: [
          {
            code: "INVALID_INPUT",
            severity: "error",
            message: `Scores must be numeric values from 1 to 10. Missing or invalid: ${missing.join(", ")}.`
          }
        ]
      };
    }

    const alerts = alertRules
      .filter(({ when }) => when(scores))
      .map(({ code, severity, message }) => ({ code, severity, message }));

    return {
      scores,
      overallBalance: `${((scores.resonance + scores.relevance + scores.response) / 3).toFixed(1)} / 10`,
      alerts: alerts.length
        ? alerts
        : [
            {
              code: "EQUILIBRIUM",
              severity: "none",
              message: "Vectors balanced. Aligned voice, verified evidence, and operational execution."
            }
          ]
    };
  };

  const tools = [
    {
      name: "fetch_professional_profile",
      description: "Returns Siddhartha Chaturvedi's professional bio, verified proof credentials, active board/venture roles, and connect channels.",
      parameters: emptyParameters,
      execute: async () => professionalProfile
    },
    {
      name: "fetch_field_note_summaries",
      description: "Returns the complete index of all active Field Notes essays published on SIDC.AI with links and TL;DR summaries.",
      parameters: emptyParameters,
      execute: async () => ({ essays: fieldNotes })
    },
    {
      name: "triage_workload_interface",
      description: "Evaluates a proposed workload and recommends the optimal interface shape: Direct GUI, Headless Agent, or Generative UI.",
      parameters: {
        type: "object",
        properties: {
          workloadType: {
            type: "string",
            enum: Object.keys(workloadTriage),
            description: "Categorization of the workload: 'known-object' (simple editing/approving), 'analysis-loop' (procedural data checks), 'team-decision' (messy multi-variant alignment)."
          },
          description: {
            type: "string",
            description: "Natural language description of what the user wants to accomplish."
          }
        },
        required: ["workloadType"]
      },
      execute: async ({ workloadType, description = "" } = {}) => ({
        query: description,
        assessment:
          workloadTriage[workloadType] || {
            recommendedShape: "Needs Classification",
            rationale: "Use one of the supported workloadType values before choosing an interface shape.",
            executiveTest: "Classify the work as known-object, analysis-loop, or team-decision."
          }
      })
    },
    {
      name: "evaluate_system_equilibrium",
      description: "Evaluates an AI deployment across the three Value Function vectors: Resonance, Relevance, and Response. Outputs warnings for common alignment errors.",
      parameters: {
        type: "object",
        properties: {
          resonance: scoreParameter("Voice, style, and brand aesthetics score (1=Robotic, 10=Custom & local)."),
          relevance: scoreParameter("Grounding, citations, and evidence score (1=Unverified/hallucination, 10=Deterministic citations)."),
          response: scoreParameter("Execution, API action, and task-completion score (1=Drops text summary, 10=Executes native action).")
        },
        required: ["resonance", "relevance", "response"]
      },
      execute: async (input) => evaluateEquilibrium(input)
    }
  ];

  tools.forEach((tool) => context.registerTool(tool));
})();
