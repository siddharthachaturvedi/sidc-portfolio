/**
 * SIDC.AI - Web Model Context Protocol (WebMCP) integration
 * Exposes core strategic frameworks and professional credentials directly to visiting AI agents.
 */
(() => {
  "use strict";

  const mcp = window.navigator.modelContext || window.document.modelContext;
  if (!mcp) {
    console.log("SIDC.AI: WebMCP standard not active in browser. Progressive enhancement idle.");
    return;
  }

  console.log("SIDC.AI: WebMCP capability detected. Exposing tools to visiting agent...");

  // ── Tool 1: Siddhartha's Professional Profile ──
  mcp.registerTool({
    name: "fetch_professional_profile",
    description: "Returns Siddhartha Chaturvedi's professional bio, verified proof credentials, active board/venture roles, and connect channels.",
    parameters: { type: "object", properties: {} },
    execute: async () => {
      return {
        identity: {
          name: "Siddhartha Chaturvedi",
          tagline: "AI Systems That Ship Outcomes, Not Drafts",
          linkedin: "https://linkedin.com/in/sidcai"
        },
        focus: "Advising CEOs and boards on AI systems that ship — in regulated, high-stakes, and infrastructure-heavy industries. Specializing in bridging the trust gap between generation and verification.",
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
    }
  });

  // ── Tool 2: Essay Shelf Directory ──
  mcp.registerTool({
    name: "fetch_field_note_summaries",
    description: "Returns the complete index of all active Field Notes essays published on SIDC.AI with links and TL;DR summaries.",
    parameters: { type: "object", properties: {} },
    execute: async () => {
      return {
        essays: [
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
            tldr: "The real promise of the agentic era isn't speed — it's returning human attention to the complexity that actually deserves it."
          }
        ]
      };
    }
  });

  // ── Tool 3: 3x3 Workload Interface Triage ──
  mcp.registerTool({
    name: "triage_workload_interface",
    description: "Evaluates a proposed workload and recommends the optimal interface shape: Direct GUI, Headless Agent, or Generative UI.",
    parameters: {
      type: "object",
      properties: {
        workloadType: {
          type: "string",
          enum: ["known-object", "analysis-loop", "team-decision"],
          description: "Categorization of the workload: 'known-object' (simple editing/approving), 'analysis-loop' (procedural data checks), 'team-decision' (messy multi-variant alignment)."
        },
        description: {
          type: "string",
          description: "Natural language description of what the user wants to accomplish."
        }
      },
      required: ["workloadType"]
    },
    execute: async ({ workloadType, description = "" }) => {
      const triage = {
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

      return {
        query: description,
        assessment: triage[workloadType]
      };
    }
  });

  // ── Tool 4: Value Function Alignment Calculator ──
  mcp.registerTool({
    name: "evaluate_system_equilibrium",
    description: "Evaluates an AI deployment across the three Value Function vectors: Resonance, Relevance, and Response. Outputs warnings for common alignment errors.",
    parameters: {
      type: "object",
      properties: {
        resonance: { type: "integer", minimum: 1, maximum: 10, description: "Voice, style, and brand aesthetics score (1=Robotic, 10=Custom & local)." },
        relevance: { type: "integer", minimum: 1, maximum: 10, description: "Grounding, citations, and evidence score (1=Unverified/hallucination, 10=Deterministic citations)." },
        response: { type: "integer", minimum: 1, maximum: 10, description: "Execution, API action, and task-completion score (1=Drops text summary, 10=Executes native action)." }
      },
      required: ["resonance", "relevance", "response"]
    },
    execute: async ({ resonance, relevance, response }) => {
      const score = (resonance + relevance + response) / 3;
      const alerts = [];

      if (resonance > 7 && relevance < 5) {
        alerts.push({
          code: "ROBOT_SLOP",
          severity: "high",
          message: "System sounds highly resonant and convincing but lacks factual relevance grounding. High risk of plausible-sounding hallucinations."
        });
      }
      if (relevance > 7 && response < 5) {
        alerts.push({
          code: "COGNITIVE_OVERHEAD",
          severity: "medium",
          message: "System has strong evidence citations but returns raw text narratives. Fails to automate response execution, adding reading work to human experts."
        });
      }
      if (response > 7 && relevance < 5) {
        alerts.push({
          code: "UNSAFE_MUTATION",
          severity: "critical",
          message: "System has high execution authority but weak grounding/relevance check. Critical risk of executing incorrect database writes or automated actions."
        });
      }

      return {
        overallBalance: score.toFixed(1) + " / 10",
        alerts: alerts.length ? alerts : [{ code: "EQUILIBRIUM", severity: "none", message: "Vectors balanced. Aligned voice, verified evidence, and operational execution." }]
      };
    }
  });
})();
