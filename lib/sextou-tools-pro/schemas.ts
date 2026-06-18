import { z } from "zod"

const whatsappInputSchema = z.object({
  businessType: z.string().min(1).max(120),
  situation: z.string().min(1).max(120),
  tone: z.string().min(1).max(60),
  caseDetails: z.string().min(1).max(1200),
  desiredCta: z.string().min(1).max(240),
})

const businessDiagnosisInputSchema = z.object({
  businessName: z.string().min(1).max(160),
  businessType: z.string().min(1).max(160),
  mainProductOrService: z.string().min(1).max(220),
  targetAudience: z.string().min(1).max(220),
  mainSalesChannel: z.string().min(1).max(120),
  biggestCurrentDifficulty: z.string().min(1).max(500),
  approximateRevenue: z.string().max(120).optional().or(z.literal("")),
  cityOrMarket: z.string().max(160).optional().or(z.literal("")),
})

const businessDiagnosisSevenDayStepSchema = z.object({
  day: z.string().min(1),
  action: z.string().min(1),
})

const businessDiagnosisRecommendedAppSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  reason: z.string().min(1),
})

const businessDiagnosisOutputSchema = z.object({
  title: z.string().min(1),
  diagnosisSummary: z.string().min(1),
  strengths: z.array(z.string()).length(3),
  weaknesses: z.array(z.string()).length(3),
  quickOpportunities: z.array(z.string()).length(3),
  risks: z.array(z.string()).length(3),
  sevenDayPlan: z.array(businessDiagnosisSevenDayStepSchema).length(7),
  recommendedNextApp: businessDiagnosisRecommendedAppSchema,
  nextActions: z.array(z.string()).length(3),
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

const followUpInputSchema = z.object({
  productOrService: z.string().min(1).max(200),
  leadSituation: z.string().min(1).max(160),
  timeSinceLastContact: z.string().min(1).max(120),
  knownObjection: z.string().max(320).optional().or(z.literal("")),
  tone: z.string().min(1).max(60),
  channel: z.string().min(1).max(80),
})

const followUpMessageSchema = z.object({
  stepLabel: z.string().min(1),
  suggestedDelay: z.string().min(1),
  message: z.string().min(1),
  cta: z.string().min(1),
})

const followUpOutputSchema = z.object({
  title: z.string().min(1),
  sequenceLabel: z.string().min(1),
  messages: z.array(followUpMessageSchema).length(5),
  shortFirstMessage: z.string().min(1),
  closingMessage: z.string().min(1),
  nextActions: z.array(z.string()).length(3),
})

const localAdsInputSchema = z.object({
  businessName: z.string().min(1).max(160),
  productOrService: z.string().min(1).max(200),
  cityOrRegion: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(200),
  offerOrPromotion: z.string().min(1).max(320),
  differentiator: z.string().min(1).max(320),
  adChannel: z.string().min(1).max(80),
  desiredCta: z.string().min(1).max(240),
})

const localAdsVariationSchema = z.object({
  angle: z.string().min(1),
  headline: z.string().min(1),
  description: z.string().min(1),
})

const localAdsOutputSchema = z.object({
  title: z.string().min(1),
  headline: z.string().min(1),
  description: z.string().min(1),
  cta: z.string().min(1),
  whatsappVersion: z.string().min(1),
  flyerVersion: z.string().min(1),
  variations: z.array(localAdsVariationSchema).length(3),
  nextActions: z.array(z.string()).length(3),
})

const launchPlanInputSchema = z.object({
  launchTarget: z.string().min(1).max(200),
  targetAudience: z.string().min(1).max(200),
  primaryChannel: z.string().min(1).max(80),
  offerOrBenefit: z.string().min(1).max(320),
  campaignDeadline: z.string().min(1).max(160),
  availableResources: z.string().min(1).max(800),
  campaignTone: z.string().min(1).max(60),
})

const launchPlanTaskSchema = z.object({
  label: z.string().min(1),
  owner: z.string().min(1),
  expectedOutcome: z.string().min(1),
})

const launchPlanStageSchema = z.object({
  stage: z.string().min(1),
  hourWindow: z.string().min(1),
  goal: z.string().min(1),
  actions: z.array(z.string()).min(2).max(4),
})

const launchPlanMessageSchema = z.object({
  label: z.string().min(1),
  text: z.string().min(1),
})

const launchPlanOutputSchema = z.object({
  title: z.string().min(1),
  planLabel: z.string().min(1),
  checklist: z.array(launchPlanTaskSchema).length(6),
  timeline: z.array(launchPlanStageSchema).length(4),
  keyMessages: z.array(launchPlanMessageSchema).length(3),
  announcementPost: z.string().min(1),
  whatsappMessage: z.string().min(1),
  ethicalUrgency: z.string().min(1),
  simpleMetrics: z.array(z.string()).length(4),
  nextActions: z.array(z.string()).length(3),
})

const servicePricingInputSchema = z.object({
  serviceName: z.string().min(1).max(200),
  estimatedHours: z.number().min(0.5).max(500),
  directCost: z.number().min(0).max(1000000),
  indirectCost: z.number().min(0).max(1000000),
  desiredMargin: z.number().min(0).max(300),
  experienceLevel: z.enum(["iniciante", "pleno", "experiente", "especialista"]),
  serviceComplexity: z.enum(["baixa", "media", "alta"]),
  minimumAcceptableValue: z.number().min(0).max(1000000).optional(),
})

const pricingRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
})

const servicePricingOutputSchema = z.object({
  title: z.string().min(1),
  scenarioLabel: z.string().min(1),
  baseCalculation: z.number().nonnegative(),
  minimumSuggestedRange: pricingRangeSchema,
  recommendedRange: pricingRangeSchema,
  premiumRange: pricingRangeSchema,
  pricingExplanation: z.string().min(1),
  presentationSuggestion: z.string().min(1),
  lowPriceAlerts: z.array(z.string()).min(1).max(4),
  nextActions: z.array(z.string()).length(3),
})

const creativeBriefInputSchema = z.object({
  projectType: z.string().min(1).max(120),
  businessName: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(220),
  projectGoal: z.string().min(1).max(500),
  desiredStyle: z.string().min(1).max(320),
  preferredColors: z.string().max(240).optional().or(z.literal("")),
  references: z.string().max(800).optional().or(z.literal("")),
  requiredInformation: z.string().min(1).max(1000),
})

const creativeBriefOutputSchema = z.object({
  title: z.string().min(1),
  organizedBrief: z.string().min(1),
  projectGoal: z.string().min(1),
  targetAudience: z.string().min(1),
  mainMessage: z.string().min(1),
  visualDirection: z.array(z.string()).length(4),
  requiredContent: z.array(z.string()).length(5),
  openQuestions: z.array(z.string()).length(4),
  deliveryChecklist: z.array(z.string()).length(5),
  nextActions: z.array(z.string()).length(3),
})

const localPartnershipsInputSchema = z.object({
  businessType: z.string().min(1).max(160),
  cityOrRegion: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(220),
  averageTicket: z.string().max(120).optional().or(z.literal("")),
  partnershipGoal: z.string().min(1).max(320),
  restrictionsOrPreferences: z.string().max(600).optional().or(z.literal("")),
})

const localPartnershipIdeaSchema = z.object({
  partnerCategory: z.string().min(1),
  partnershipReason: z.string().min(1),
  approachProposal: z.string().min(1),
  firstContactMessage: z.string().min(1),
  jointCampaignIdea: z.string().min(1),
  recommendedNextStep: z.string().min(1),
})

const localPartnershipsOutputSchema = z.object({
  title: z.string().min(1),
  campaignLabel: z.string().min(1),
  ideas: z.array(localPartnershipIdeaSchema).length(10),
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

const pitchInputSchema = z.object({
  businessName: z.string().min(1).max(160),
  productOrService: z.string().min(1).max(200),
  targetAudience: z.string().min(1).max(200),
  problemSolved: z.string().min(1).max(600),
  differentiator: z.string().min(1).max(320),
  tone: z.string().min(1).max(60),
})

const pitchOutputSchema = z.object({
  title: z.string().min(1),
  pitch30: z.string().min(1),
  pitch10: z.string().min(1),
  whatsappVersion: z.string().min(1),
  shortBio: z.string().min(1),
  closingLine: z.string().min(1),
  nextActions: z.array(z.string()).length(3),
})

const professionalBioInputSchema = z.object({
  businessName: z.string().min(1).max(160),
  segment: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(200),
  cityOrRegion: z.string().max(120).optional().or(z.literal("")),
  mainService: z.string().min(1).max(200),
  differentiator: z.string().min(1).max(320),
  desiredCta: z.string().min(1).max(240),
  tone: z.string().min(1).max(60),
})

const professionalBioOutputSchema = z.object({
  title: z.string().min(1),
  instagramBio: z.string().min(1),
  linkedinBio: z.string().min(1),
  googleBusinessDescription: z.string().min(1),
  shortHeadline: z.string().min(1),
  profileCta: z.string().min(1),
  positioningKeywords: z.array(z.string()).length(5),
  nextActions: z.array(z.string()).length(3),
})

const faqObjectionsInputSchema = z.object({
  businessType: z.string().min(1).max(160),
  productOrService: z.string().min(1).max(200),
  knownQuestions: z.string().max(1200).optional().or(z.literal("")),
  knownObjections: z.string().max(1200).optional().or(z.literal("")),
  responseTone: z.string().min(1).max(60),
  channel: z.string().min(1).max(80),
})

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
})

const objectionItemSchema = z.object({
  objection: z.string().min(1),
  answer: z.string().min(1),
})

const faqObjectionsOutputSchema = z.object({
  title: z.string().min(1),
  faqs: z.array(faqItemSchema).length(10),
  objections: z.array(objectionItemSchema).length(5),
  whatsappMessage: z.string().min(1),
  suggestedUsage: z.string().min(1),
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
  "business-diagnosis": {
    inputSchema: businessDiagnosisInputSchema,
    outputSchema: businessDiagnosisOutputSchema,
    schemaName: "business_diagnosis",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        diagnosisSummary: { type: "string" },
        strengths: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
        weaknesses: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
        quickOpportunities: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
        risks: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
        sevenDayPlan: {
          type: "array",
          minItems: 7,
          maxItems: 7,
          items: buildObjectJsonSchema(
            {
              day: { type: "string" },
              action: { type: "string" },
            },
            ["day", "action"]
          ),
        },
        recommendedNextApp: buildObjectJsonSchema(
          {
            slug: { type: "string" },
            label: { type: "string" },
            reason: { type: "string" },
          },
          ["slug", "label", "reason"]
        ),
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "diagnosisSummary",
        "strengths",
        "weaknesses",
        "quickOpportunities",
        "risks",
        "sevenDayPlan",
        "recommendedNextApp",
        "nextActions",
      ]
    ),
  },
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
  "follow-up-5-messages": {
    inputSchema: followUpInputSchema,
    outputSchema: followUpOutputSchema,
    schemaName: "follow_up_5_messages",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        sequenceLabel: { type: "string" },
        messages: {
          type: "array",
          minItems: 5,
          maxItems: 5,
          items: buildObjectJsonSchema(
            {
              stepLabel: { type: "string" },
              suggestedDelay: { type: "string" },
              message: { type: "string" },
              cta: { type: "string" },
            },
            ["stepLabel", "suggestedDelay", "message", "cta"]
          ),
        },
        shortFirstMessage: { type: "string" },
        closingMessage: { type: "string" },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      ["title", "sequenceLabel", "messages", "shortFirstMessage", "closingMessage", "nextActions"]
    ),
  },
  "local-ads": {
    inputSchema: localAdsInputSchema,
    outputSchema: localAdsOutputSchema,
    schemaName: "local_ads",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        headline: { type: "string" },
        description: { type: "string" },
        cta: { type: "string" },
        whatsappVersion: { type: "string" },
        flyerVersion: { type: "string" },
        variations: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: buildObjectJsonSchema(
            {
              angle: { type: "string" },
              headline: { type: "string" },
              description: { type: "string" },
            },
            ["angle", "headline", "description"]
          ),
        },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      ["title", "headline", "description", "cta", "whatsappVersion", "flyerVersion", "variations", "nextActions"]
    ),
  },
  "launch-plan-48h": {
    inputSchema: launchPlanInputSchema,
    outputSchema: launchPlanOutputSchema,
    schemaName: "launch_plan_48h",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        planLabel: { type: "string" },
        checklist: {
          type: "array",
          minItems: 6,
          maxItems: 6,
          items: buildObjectJsonSchema(
            {
              label: { type: "string" },
              owner: { type: "string" },
              expectedOutcome: { type: "string" },
            },
            ["label", "owner", "expectedOutcome"]
          ),
        },
        timeline: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: buildObjectJsonSchema(
            {
              stage: { type: "string" },
              hourWindow: { type: "string" },
              goal: { type: "string" },
              actions: {
                type: "array",
                items: { type: "string" },
                minItems: 2,
                maxItems: 4,
              },
            },
            ["stage", "hourWindow", "goal", "actions"]
          ),
        },
        keyMessages: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: buildObjectJsonSchema(
            {
              label: { type: "string" },
              text: { type: "string" },
            },
            ["label", "text"]
          ),
        },
        announcementPost: { type: "string" },
        whatsappMessage: { type: "string" },
        ethicalUrgency: { type: "string" },
        simpleMetrics: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "planLabel",
        "checklist",
        "timeline",
        "keyMessages",
        "announcementPost",
        "whatsappMessage",
        "ethicalUrgency",
        "simpleMetrics",
        "nextActions",
      ]
    ),
  },
  "creative-brief": {
    inputSchema: creativeBriefInputSchema,
    outputSchema: creativeBriefOutputSchema,
    schemaName: "creative_brief",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        organizedBrief: { type: "string" },
        projectGoal: { type: "string" },
        targetAudience: { type: "string" },
        mainMessage: { type: "string" },
        visualDirection: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
        requiredContent: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
        openQuestions: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
        deliveryChecklist: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "organizedBrief",
        "projectGoal",
        "targetAudience",
        "mainMessage",
        "visualDirection",
        "requiredContent",
        "openQuestions",
        "deliveryChecklist",
        "nextActions",
      ]
    ),
  },
  "local-partnerships": {
    inputSchema: localPartnershipsInputSchema,
    outputSchema: localPartnershipsOutputSchema,
    schemaName: "local_partnerships",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        campaignLabel: { type: "string" },
        ideas: {
          type: "array",
          minItems: 10,
          maxItems: 10,
          items: buildObjectJsonSchema(
            {
              partnerCategory: { type: "string" },
              partnershipReason: { type: "string" },
              approachProposal: { type: "string" },
              firstContactMessage: { type: "string" },
              jointCampaignIdea: { type: "string" },
              recommendedNextStep: { type: "string" },
            },
            [
              "partnerCategory",
              "partnershipReason",
              "approachProposal",
              "firstContactMessage",
              "jointCampaignIdea",
              "recommendedNextStep",
            ]
          ),
        },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      ["title", "campaignLabel", "ideas", "nextActions"]
    ),
  },
  "service-pricing": {
    inputSchema: servicePricingInputSchema,
    outputSchema: servicePricingOutputSchema,
    schemaName: "service_pricing",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        scenarioLabel: { type: "string" },
        baseCalculation: { type: "number" },
        minimumSuggestedRange: buildObjectJsonSchema(
          {
            min: { type: "number" },
            max: { type: "number" },
          },
          ["min", "max"]
        ),
        recommendedRange: buildObjectJsonSchema(
          {
            min: { type: "number" },
            max: { type: "number" },
          },
          ["min", "max"]
        ),
        premiumRange: buildObjectJsonSchema(
          {
            min: { type: "number" },
            max: { type: "number" },
          },
          ["min", "max"]
        ),
        pricingExplanation: { type: "string" },
        presentationSuggestion: { type: "string" },
        lowPriceAlerts: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "scenarioLabel",
        "baseCalculation",
        "minimumSuggestedRange",
        "recommendedRange",
        "premiumRange",
        "pricingExplanation",
        "presentationSuggestion",
        "lowPriceAlerts",
        "nextActions",
      ]
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
  "pitch-30-seconds": {
    inputSchema: pitchInputSchema,
    outputSchema: pitchOutputSchema,
    schemaName: "pitch_30_seconds",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        pitch30: { type: "string" },
        pitch10: { type: "string" },
        whatsappVersion: { type: "string" },
        shortBio: { type: "string" },
        closingLine: { type: "string" },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      ["title", "pitch30", "pitch10", "whatsappVersion", "shortBio", "closingLine", "nextActions"]
    ),
  },
  "professional-bio": {
    inputSchema: professionalBioInputSchema,
    outputSchema: professionalBioOutputSchema,
    schemaName: "professional_bio",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        instagramBio: { type: "string" },
        linkedinBio: { type: "string" },
        googleBusinessDescription: { type: "string" },
        shortHeadline: { type: "string" },
        profileCta: { type: "string" },
        positioningKeywords: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      [
        "title",
        "instagramBio",
        "linkedinBio",
        "googleBusinessDescription",
        "shortHeadline",
        "profileCta",
        "positioningKeywords",
        "nextActions",
      ]
    ),
  },
  "faq-objections": {
    inputSchema: faqObjectionsInputSchema,
    outputSchema: faqObjectionsOutputSchema,
    schemaName: "faq_objections",
    promptVersion: "1.0.0",
    jsonSchema: buildObjectJsonSchema(
      {
        title: { type: "string" },
        faqs: {
          type: "array",
          minItems: 10,
          maxItems: 10,
          items: buildObjectJsonSchema(
            {
              question: { type: "string" },
              answer: { type: "string" },
            },
            ["question", "answer"]
          ),
        },
        objections: {
          type: "array",
          minItems: 5,
          maxItems: 5,
          items: buildObjectJsonSchema(
            {
              objection: { type: "string" },
              answer: { type: "string" },
            },
            ["objection", "answer"]
          ),
        },
        whatsappMessage: { type: "string" },
        suggestedUsage: { type: "string" },
        nextActions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
      },
      ["title", "faqs", "objections", "whatsappMessage", "suggestedUsage", "nextActions"]
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
    "set-follow-up-message-sent",
    "set-launch-plan-task-completed",
    "set-local-partnership-status",
  ]),
  operationalStatus: z.string().min(1).max(60).optional(),
  postIndex: z.number().int().min(0).max(6).optional(),
  published: z.boolean().optional(),
  messageIndex: z.number().int().min(0).max(4).optional(),
  sent: z.boolean().optional(),
  section: z.enum(["checklist", "timeline"]).optional(),
  taskIndex: z.number().int().min(0).max(5).optional(),
  completed: z.boolean().optional(),
  partnerIndex: z.number().int().min(0).max(9).optional(),
  partnershipStatus: z.enum(["novo", "contatado", "interessado"]).optional(),
})
