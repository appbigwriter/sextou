import { z } from "zod"

const whatsappInputSchema = z.object({
  businessType: z.string().min(1).max(120),
  situation: z.string().min(1).max(120),
  tone: z.string().min(1).max(60),
  caseDetails: z.string().min(1).max(1200),
  desiredCta: z.string().min(1).max(240),
})

const whatsappOutputSchema = z.object({
  title: z.string().min(1),
  shortReply: z.string().min(1),
  fullReply: z.string().min(1),
  warmerReply: z.string().min(1),
  firmerReply: z.string().min(1),
  ctaReply: z.string().min(1),
  nextActions: z.array(z.string()).length(3),
})

const offerInputSchema = z.object({
  productOrService: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(200),
  problemSolved: z.string().min(1).max(600),
  mainBenefit: z.string().min(1).max(320),
  priceRange: z.string().max(120).optional().or(z.literal("")),
  bonus: z.string().max(320).optional().or(z.literal("")),
  guarantee: z.string().max(320).optional().or(z.literal("")),
  tone: z.string().min(1).max(60),
})

const offerOutputSchema = z.object({
  title: z.string().min(1),
  offerName: z.string().min(1),
  headline: z.string().min(1),
  promise: z.string().min(1),
  structure: z.array(z.string()).min(3).max(6),
  suggestedBonuses: z.array(z.string()).max(5),
  suggestedGuarantee: z.string().min(1),
  ethicalUrgency: z.string().min(1),
  whatsappCta: z.string().min(1),
  shortPostVersion: z.string().min(1),
  nextActions: z.array(z.string()).length(3),
})

const contentCalendarInputSchema = z.object({
  businessType: z.string().min(1).max(160),
  mainProductOrService: z.string().min(1).max(200),
  targetAudience: z.string().min(1).max(200),
  weeklyGoal: z.string().min(1).max(60),
  primaryChannel: z.string().min(1).max(60),
  tone: z.string().min(1).max(60),
})

const contentCalendarOutputSchema = z.object({
  title: z.string().min(1),
  weekLabel: z.string().min(1),
  posts: z.array(
    z.object({
      day: z.string().min(1),
      theme: z.string().min(1),
      format: z.string().min(1),
      caption: z.string().min(1),
      cta: z.string().min(1),
      visualIdea: z.string().min(1),
      hashtags: z.array(z.string()).max(5),
    })
  ).length(7),
  nextActions: z.array(z.string()).length(3),
})

const onePageProposalInputSchema = z.object({
  clientName: z.string().max(160).optional().or(z.literal("")),
  businessName: z.string().min(1).max(160),
  proposedService: z.string().min(1).max(200),
  clientProblem: z.string().min(1).max(600),
  scope: z.string().min(1).max(1200),
  deadline: z.string().min(1).max(160),
  price: z.string().max(120).optional().or(z.literal("")),
  paymentTerms: z.string().max(320).optional().or(z.literal("")),
  guaranteesOrNotes: z.string().max(600).optional().or(z.literal("")),
})

const onePageProposalOutputSchema = z.object({
  title: z.string().min(1),
  clientContext: z.string().min(1),
  proposedSolution: z.string().min(1),
  scopeBullets: z.array(z.string()).min(3).max(8),
  timeline: z.string().min(1),
  investment: z.string().min(1),
  nextSteps: z.array(z.string()).min(2).max(5),
  deliveryMessage: z.string().min(1),
  nextActions: z.array(z.string()).length(3),
})

const reelsInputSchema = z.object({
  videoTheme: z.string().min(1).max(160),
  productOrService: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(160),
  objective: z.string().min(1).max(80),
  tone: z.string().min(1).max(80),
  duration: z.enum(["15s", "30s", "45s"]),
})

const reelsOutputSchema = z.object({
  title: z.string().min(1),
  openingHook: z.string().min(1),
  spokenScript: z.array(z.string()).min(3).max(6),
  sceneSuggestions: z.array(z.string()).min(3).max(6),
  onScreenText: z.array(z.string()).min(2).max(5),
  finalCta: z.string().min(1),
  publishDescription: z.string().min(1),
  nextActions: z.array(z.string()).length(3),
})

function buildObjectJsonSchema(
  properties: Record<string, unknown>,
  required: string[]
) {
  return {
    type: "object",
    additionalProperties: false,
    properties,
    required,
  }
}

export const sextouToolsProDefinitions = {
  "respostas-prontas-whatsapp": {
    inputSchema: whatsappInputSchema,
    outputSchema: whatsappOutputSchema,
    schemaName: "whatsapp_replies",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        shortReply: { type: "string" },
        fullReply: { type: "string" },
        warmerReply: { type: "string" },
        firmerReply: { type: "string" },
        ctaReply: { type: "string" },
        nextActions: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
          maxItems: 3,
        },
      },
      ["title", "shortReply", "fullReply", "warmerReply", "firmerReply", "ctaReply", "nextActions"]
    ),
  },
  "gerador-oferta-irresistivel": {
    inputSchema: offerInputSchema,
    outputSchema: offerOutputSchema,
    schemaName: "offer_generator",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        offerName: { type: "string" },
        headline: { type: "string" },
        promise: { type: "string" },
        structure: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
        suggestedBonuses: { type: "array", items: { type: "string" }, maxItems: 5 },
        suggestedGuarantee: { type: "string" },
        ethicalUrgency: { type: "string" },
        whatsappCta: { type: "string" },
        shortPostVersion: { type: "string" },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "offerName",
        "headline",
        "promise",
        "structure",
        "suggestedBonuses",
        "suggestedGuarantee",
        "ethicalUrgency",
        "whatsappCta",
        "shortPostVersion",
        "nextActions",
      ]
    ),
  },
  "calendario-conteudo-7-dias": {
    inputSchema: contentCalendarInputSchema,
    outputSchema: contentCalendarOutputSchema,
    schemaName: "content_calendar",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        weekLabel: { type: "string" },
        posts: {
          type: "array",
          minItems: 7,
          maxItems: 7,
          items: buildObjectJsonSchema(
            {
              day: { type: "string" },
              theme: { type: "string" },
              format: { type: "string" },
              caption: { type: "string" },
              cta: { type: "string" },
              visualIdea: { type: "string" },
              hashtags: {
                type: "array",
                items: { type: "string" },
                maxItems: 5,
              },
            },
            ["day", "theme", "format", "caption", "cta", "visualIdea", "hashtags"]
          ),
        },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      ["title", "weekLabel", "posts", "nextActions"]
    ),
  },
  "proposta-comercial-one-page": {
    inputSchema: onePageProposalInputSchema,
    outputSchema: onePageProposalOutputSchema,
    schemaName: "one_page_proposal",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        clientContext: { type: "string" },
        proposedSolution: { type: "string" },
        scopeBullets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
        timeline: { type: "string" },
        investment: { type: "string" },
        nextSteps: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
        deliveryMessage: { type: "string" },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "clientContext",
        "proposedSolution",
        "scopeBullets",
        "timeline",
        "investment",
        "nextSteps",
        "deliveryMessage",
        "nextActions",
      ]
    ),
  },
  "roteiro-reels-shorts-30s": {
    inputSchema: reelsInputSchema,
    outputSchema: reelsOutputSchema,
    schemaName: "reels_script",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        openingHook: { type: "string" },
        spokenScript: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
        sceneSuggestions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
        onScreenText: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
        finalCta: { type: "string" },
        publishDescription: { type: "string" },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "openingHook",
        "spokenScript",
        "sceneSuggestions",
        "onScreenText",
        "finalCta",
        "publishDescription",
        "nextActions",
      ]
    ),
  },
} as const

export type SextouToolsProAppId = keyof typeof sextouToolsProDefinitions

export function getSextouToolsProDefinition(appId: string) {
  return sextouToolsProDefinitions[appId as SextouToolsProAppId] ?? null
}

export const sextouToolsProGenerateSchema = z.object({
  appId: z.string().min(1),
  input: z.record(z.string(), z.unknown()),
  language: z.string().min(2).max(16).optional(),
  sourceGenerationId: z.string().uuid().optional(),
  sourceAction: z.enum(["GENERATE", "REGENERATE", "DUPLICATE"]).optional(),
})

export const sextouToolsProGenerationActionSchema = z.object({
  action: z.enum([
    "favorite",
    "unfavorite",
    "archive",
    "restore",
    "delete",
    "set-operational-status",
    "set-calendar-post-published",
  ]),
  operationalStatus: z.string().min(1).max(60).optional(),
  postIndex: z.number().int().min(0).max(6).optional(),
  published: z.boolean().optional(),
})
