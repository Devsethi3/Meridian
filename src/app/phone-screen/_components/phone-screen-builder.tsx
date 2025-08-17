// components/phone-screen/phone-screen-builder.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Phone,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Trash2,
  Plus,
  Share2,
  Link2,
  Clipboard,
  Clock,
  User,
  Languages,
  Sparkles,
  Radio,
  Shield,
  Volume2,
  Check,
  Settings2,
} from "lucide-react";

// shadcn/ui components (ensure these exist in your project)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// If you have a toast hook, you can import it (optional):
// import { useToast } from "@/components/ui/use-toast";

type VoiceVendor = "vapi";
type Persona = "Neutral" | "Calm" | "Energetic";

const VOICE_PRESETS: {
  id: string;
  label: string;
  persona: Persona;
  vendor: VoiceVendor;
  voice: string;
  desc: string;
}[] = [
  {
    id: "neutral-ember",
    label: "Neutral • Ember",
    persona: "Neutral",
    vendor: "vapi",
    voice: "ember",
    desc: "Balanced, friendly, professional",
  },
  {
    id: "calm-luna",
    label: "Calm • Luna",
    persona: "Calm",
    vendor: "vapi",
    voice: "luna",
    desc: "Soft, steady, reassuring",
  },
  {
    id: "energetic-blaze",
    label: "Energetic • Blaze",
    persona: "Energetic",
    vendor: "vapi",
    voice: "blaze",
    desc: "Upbeat, engaging, quick",
  },
];

const SENIORITIES = ["Intern", "Junior", "Mid", "Senior", "Lead"] as const;
const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es-ES", label: "Spanish (ES)" },
  { value: "fr-FR", label: "French (FR)" },
  { value: "de-DE", label: "German (DE)" },
];

const STEPS = [
  "Basics",
  "Script & Questions",
  "Voice & Dialer",
  "Review & Share",
] as const;

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  role: z.string().min(2, "Role is required"),
  seniority: z.enum(SENIORITIES),
  durationMin: z.number().min(5).max(60),
  focusAreas: z.array(z.string()).default([]),

  openingScript: z.string().min(10, "Opening script is required"),
  questions: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(3, "Question cannot be empty"),
        weight: z.number().min(1).max(10),
      })
    )
    .min(1, "At least one question"),

  language: z.string(),
  voicePresetId: z.string(),
  speakingRate: z.number().min(0.5).max(1.5),
  recordingConsent: z.boolean().default(true),

  callMethod: z.enum(["share-link", "outbound"]),
  candidate: z.object({
    name: z.string().optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
  }),
  schedule: z.object({
    date: z.string().optional().or(z.literal("")),
    time: z.string().optional().or(z.literal("")),
    timezone: z.string(),
  }),
});

type PhoneScreenForm = z.infer<typeof schema>;

const defaultValues: PhoneScreenForm = {
  title: "Phone Screening • Frontend Engineer",
  role: "Frontend Engineer",
  seniority: "Mid",
  durationMin: 20,
  focusAreas: ["React", "Communication"],

  openingScript:
    "Hi! Thanks for taking the time today. I’ll ask a few short questions about your background and experience. This call is recorded for evaluation.",
  questions: [
    {
      id: cryptoRandomId(),
      text: "Tell me about a recent project you're proud of.",
      weight: 5,
    },
    {
      id: cryptoRandomId(),
      text: "How do you approach performance optimization in React?",
      weight: 7,
    },
    {
      id: cryptoRandomId(),
      text: "Describe a challenging bug and how you fixed it.",
      weight: 6,
    },
  ],

  language: "en-US",
  voicePresetId: "neutral-ember",
  speakingRate: 1.0,
  recordingConsent: true,

  callMethod: "share-link",
  candidate: { name: "", email: "", phone: "" },
  schedule: {
    date: "",
    time: "",
    timezone: Intl?.DateTimeFormat?.().resolvedOptions().timeZone ?? "UTC",
  },
};

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function PhoneScreenBuilder() {
  // const { toast } = useToast(); // if you have shadcn toast
  const [step, setStep] = useState(0);
  const [showTestDialog, setShowTestDialog] = useState(false);

  const form = useForm<PhoneScreenForm>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const { control, handleSubmit, watch, setValue, getValues, formState } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
    keyName: "key",
  });

  const values = watch();
  const progress = ((step + 1) / STEPS.length) * 100;

  const slug = useMemo(
    () => slugify(values.title || "phone-screening"),
    [values.title]
  );
  const mockShareUrl = `https://meridian.run/ps/${slug}`;

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  function onSubmit(data: PhoneScreenForm) {
    // You can persist later; for now this just confirms form validity.
    console.log("Create Phone Screening payload:", data);

    // Optional toast if configured
    // toast({ title: "Screening created", description: "Your phone screening is ready to share." });
    alert("Screening created (UI only). Check console for payload.");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(mockShareUrl);
    // toast?.({ title: "Link copied", description: mockShareUrl });
    alert("Share link copied to clipboard:\n" + mockShareUrl);
  }

  function addFocusArea(tag: string) {
    const current = getValues("focusAreas");
    if (tag && !current.includes(tag))
      setValue("focusAreas", [...current, tag]);
  }
  function removeFocusArea(tag: string) {
    const current = getValues("focusAreas");
    setValue(
      "focusAreas",
      current.filter((t) => t !== tag)
    );
  }

  const currentVoice =
    VOICE_PRESETS.find((v) => v.id === values.voicePresetId) ||
    VOICE_PRESETS[0];

  return (
    <div className="container py-6 md:py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Phone Screening Call
          </h1>
          <p className="text-sm text-muted-foreground">
            Design, preview, and share an AI-powered phone screen with Meridian.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="gap-2">
            <Phone className="h-4 w-4" /> Create Screening
          </Button>
        </div>
      </header>

      <Card className="border">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg">
                {STEPS[step]}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {step === 0 &&
                  "Name your screening, set role details, duration, and focus areas."}
                {step === 1 &&
                  "Write an opening script and set your question list."}
                {step === 2 &&
                  "Pick a voice persona, language, and call method."}
                {step === 3 && "Review everything, test the call, and share."}
              </CardDescription>
            </div>
            <div className="w-[160px]">
              <Progress value={progress} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[260px_1fr_360px]">
            {/* Step Sidebar */}
            <aside className="border-r p-4">
              <StepSidebar step={step} setStep={setStep} />
            </aside>

            {/* Main */}
            <section className="p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {step === 0 && (
                    <div className="space-y-6">
                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="text-base">Basics</CardTitle>
                          <CardDescription>
                            Set the essentials for this phone screening.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Screening Title</Label>
                              <Controller
                                control={control}
                                name="title"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="e.g., Phone Screening • Frontend Engineer"
                                  />
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Controller
                                control={control}
                                name="role"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="e.g., Frontend Engineer"
                                  />
                                )}
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Seniority</Label>
                              <Controller
                                control={control}
                                name="seniority"
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select seniority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {SENIORITIES.map((s) => (
                                        <SelectItem key={s} value={s}>
                                          {s}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="flex items-center justify-between">
                                <span>Duration (minutes)</span>
                                <span className="text-sm text-muted-foreground">
                                  {values.durationMin} min
                                </span>
                              </Label>
                              <Controller
                                control={control}
                                name="durationMin"
                                render={({ field }) => (
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(v) => field.onChange(v[0])}
                                    min={5}
                                    max={60}
                                    step={5}
                                  />
                                )}
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <Label>Focus Areas</Label>
                            <div className="flex flex-wrap gap-2">
                              {values.focusAreas.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="gap-1"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeFocusArea(tag)}
                                    className="ml-1 rounded px-1 text-xs text-muted-foreground hover:bg-muted"
                                    aria-label={`Remove ${tag}`}
                                  >
                                    ✕
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add a focus area (e.g., React, DS&A)"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const val = (
                                      e.target as HTMLInputElement
                                    ).value.trim();
                                    if (val) {
                                      addFocusArea(val);
                                      (e.target as HTMLInputElement).value = "";
                                    }
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  const el =
                                    document.querySelector<HTMLInputElement>(
                                      'input[placeholder^="Add a focus area"]'
                                    );
                                  if (el && el.value.trim()) {
                                    addFocusArea(el.value.trim());
                                    el.value = "";
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Opening Script
                          </CardTitle>
                          <CardDescription>
                            Set the call’s introduction and consent message.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Label>Intro / Consent</Label>
                          <Controller
                            control={control}
                            name="openingScript"
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                rows={4}
                                className="resize-none"
                                placeholder="Hi! Thanks for taking the time today..."
                              />
                            )}
                          />
                          <div className="flex items-center gap-2 rounded-md border p-3">
                            <Shield className="h-4 w-4 text-primary" />
                            <div className="text-sm text-muted-foreground">
                              Be sure your script includes a disclosure that the
                              call is AI-powered and recorded (if enabled).
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="text-base">Questions</CardTitle>
                          <CardDescription>
                            Reorder with drag, set weights, and add/remove
                            items.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Reorder.Group
                            axis="y"
                            values={fields}
                            onReorder={(newOrder) => {
                              // Map to indexes and reorder accordingly
                              // fieldArray helper doesn't accept objects directly, so we find new index order and move items
                              const oldIds = fields.map((f) => f.id);
                              const newIds = newOrder.map((f) => f.id);
                              newIds.forEach((id, newIndex) => {
                                const oldIndex = oldIds.indexOf(id);
                                if (oldIndex !== -1 && oldIndex !== newIndex) {
                                  move(oldIndex, newIndex);
                                  // Update reference arrays
                                  oldIds.splice(oldIndex, 1);
                                  oldIds.splice(newIndex, 0, id);
                                }
                              });
                            }}
                            className="space-y-3"
                          >
                            {fields.map((field, index) => (
                              <Reorder.Item
                                key={field.id}
                                value={field}
                                className="rounded-lg border bg-muted/50"
                              >
                                <div className="flex items-start gap-3 p-3">
                                  <div className="mt-1 cursor-grab text-muted-foreground">
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <div className="grow space-y-2">
                                    <Label className="text-xs text-muted-foreground">
                                      Question {index + 1}
                                    </Label>
                                    <Controller
                                      control={control}
                                      name={`questions.${index}.text` as const}
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          placeholder="Type your question..."
                                        />
                                      )}
                                    />
                                    <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
                                      <div>
                                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                          <span>Weight</span>
                                          <Controller
                                            control={control}
                                            name={
                                              `questions.${index}.weight` as const
                                            }
                                            render={({ field }) => (
                                              <span>{field.value}/10</span>
                                            )}
                                          />
                                        </div>
                                        <Controller
                                          control={control}
                                          name={
                                            `questions.${index}.weight` as const
                                          }
                                          render={({ field }) => (
                                            <Slider
                                              min={1}
                                              max={10}
                                              step={1}
                                              value={[field.value]}
                                              onValueChange={(v) =>
                                                field.onChange(v[0])
                                              }
                                            />
                                          )}
                                        />
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          className="w-full md:w-auto"
                                          onClick={() =>
                                            append({
                                              id: cryptoRandomId(),
                                              text: "New question",
                                              weight: 5,
                                            })
                                          }
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          className="text-destructive hover:bg-muted"
                                          onClick={() => remove(index)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>

                          <div className="pt-2">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                append({
                                  id: cryptoRandomId(),
                                  text: "New question",
                                  weight: 5,
                                })
                              }
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Question
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Voice & Language
                          </CardTitle>
                          <CardDescription>
                            Choose the voice persona and speaking style.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid gap-3 md:grid-cols-3">
                            {VOICE_PRESETS.map((v) => {
                              const active = values.voicePresetId === v.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() =>
                                    setValue("voicePresetId", v.id, {
                                      shouldDirty: true,
                                    })
                                  }
                                  className={[
                                    "group w-full rounded-lg border p-4 text-left transition",
                                    active
                                      ? "border-primary bg-primary/10"
                                      : "hover:bg-muted",
                                  ].join(" ")}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Radio
                                        className={[
                                          "h-4 w-4",
                                          active
                                            ? "text-primary"
                                            : "text-muted-foreground",
                                        ].join(" ")}
                                      />
                                      <div className="font-medium">
                                        {v.label}
                                      </div>
                                    </div>
                                    {active && (
                                      <Badge className="bg-primary text-primary-foreground">
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    {v.desc}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Language</Label>
                              <Controller
                                control={control}
                                name="language"
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {LANGUAGES.map((lang) => (
                                        <SelectItem
                                          key={lang.value}
                                          value={lang.value}
                                        >
                                          {lang.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center justify-between">
                                <span>Speaking Rate</span>
                                <span className="text-sm text-muted-foreground">
                                  {values.speakingRate.toFixed(2)}x
                                </span>
                              </Label>
                              <Controller
                                control={control}
                                name="speakingRate"
                                render={({ field }) => (
                                  <Slider
                                    min={0.5}
                                    max={1.5}
                                    step={0.05}
                                    value={[field.value]}
                                    onValueChange={(v) =>
                                      field.onChange(Number(v[0].toFixed(2)))
                                    }
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Dialer & Consent
                          </CardTitle>
                          <CardDescription>
                            Choose how candidates join and configure recording.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Link2 className="h-4 w-4 text-primary" />
                                  <div className="font-medium">Share Link</div>
                                </div>
                                <Controller
                                  control={control}
                                  name="callMethod"
                                  render={({ field }) => (
                                    <Switch
                                      checked={field.value === "share-link"}
                                      onCheckedChange={(checked) =>
                                        field.onChange(
                                          checked ? "share-link" : "outbound"
                                        )
                                      }
                                      aria-label="Toggle share link"
                                    />
                                  )}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Generate a link candidates can open to start
                                their screening.
                              </p>
                              <div className="mt-3 flex items-center gap-2">
                                <Input value={mockShareUrl} readOnly />
                                <Button
                                  variant="secondary"
                                  onClick={copyLink}
                                  className="gap-1"
                                >
                                  <Clipboard className="h-4 w-4" />
                                  Copy
                                </Button>
                              </div>
                            </div>

                            <div className="rounded-lg border p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-primary" />
                                  <div className="font-medium">
                                    Outbound Call
                                  </div>
                                </div>
                                <Controller
                                  control={control}
                                  name="callMethod"
                                  render={({ field }) => (
                                    <Switch
                                      checked={field.value === "outbound"}
                                      onCheckedChange={(checked) =>
                                        field.onChange(
                                          checked ? "outbound" : "share-link"
                                        )
                                      }
                                      aria-label="Toggle outbound"
                                    />
                                  )}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Automatically dial the candidate at the
                                scheduled time.
                              </p>

                              <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Candidate Name</Label>
                                  <Controller
                                    control={control}
                                    name="candidate.name"
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="e.g., Alex Kim"
                                      />
                                    )}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Candidate Email</Label>
                                  <Controller
                                    control={control}
                                    name="candidate.email"
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="alex@email.com"
                                      />
                                    )}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Candidate Phone</Label>
                                  <Controller
                                    control={control}
                                    name="candidate.phone"
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="+1 555 000 0000"
                                      />
                                    )}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Timezone</Label>
                                  <Controller
                                    control={control}
                                    name="schedule.timezone"
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        placeholder="e.g., America/Los_Angeles"
                                      />
                                    )}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Date</Label>
                                  <Controller
                                    control={control}
                                    name="schedule.date"
                                    render={({ field }) => (
                                      <Input type="date" {...field} />
                                    )}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Time</Label>
                                  <Controller
                                    control={control}
                                    name="schedule.time"
                                    render={({ field }) => (
                                      <Input type="time" {...field} />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                              <Volume2 className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Record Call</div>
                                <div className="text-sm text-muted-foreground">
                                  Recording requires candidate consent in your
                                  intro.
                                </div>
                              </div>
                            </div>
                            <Controller
                              control={control}
                              name="recordingConsent"
                              render={({ field }) => (
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <Card className="bg-card">
                        <CardHeader>
                          <CardTitle className="text-base">Review</CardTitle>
                          <CardDescription>
                            Confirm details before sharing or testing.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-primary" />
                                <div className="font-medium">Basics</div>
                              </div>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>Title: {values.title}</li>
                                <li>Role: {values.role}</li>
                                <li>Seniority: {values.seniority}</li>
                                <li>Duration: {values.durationMin} min</li>
                                <li>
                                  Focus: {values.focusAreas.join(", ") || "—"}
                                </li>
                              </ul>
                            </div>

                            <div className="rounded-lg border p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <Languages className="h-4 w-4 text-primary" />
                                <div className="font-medium">
                                  Voice & Language
                                </div>
                              </div>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>Voice: {currentVoice?.label}</li>
                                <li>Persona: {currentVoice?.persona}</li>
                                <li>
                                  Language:{" "}
                                  {
                                    LANGUAGES.find(
                                      (l) => l.value === values.language
                                    )?.label
                                  }
                                </li>
                                <li>Rate: {values.speakingRate.toFixed(2)}x</li>
                                <li>
                                  Recording:{" "}
                                  {values.recordingConsent
                                    ? "Enabled"
                                    : "Disabled"}
                                </li>
                              </ul>
                            </div>

                            <div className="rounded-lg border p-4 md:col-span-2">
                              <div className="mb-2 flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <div className="font-medium">Call Method</div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {values.callMethod === "share-link" ? (
                                  <>
                                    Share link:{" "}
                                    <span className="font-medium text-foreground">
                                      {mockShareUrl}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    Outbound to{" "}
                                    {values.candidate.name || "Candidate"} at{" "}
                                    {values.candidate.phone || "—"} on{" "}
                                    {values.schedule.date || "—"}{" "}
                                    {values.schedule.time || ""} (
                                    {values.schedule.timezone || "—"})
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="rounded-lg border p-4 md:col-span-2">
                              <div className="mb-2 flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <div className="font-medium">
                                  Opening Script
                                </div>
                              </div>
                              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {values.openingScript}
                              </p>
                            </div>

                            <div className="rounded-lg border p-4 md:col-span-2">
                              <div className="mb-2 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <div className="font-medium">Questions</div>
                              </div>
                              <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                                {values.questions.map((q, i) => (
                                  <li key={q.id}>
                                    {q.text}{" "}
                                    <span className="text-xs">
                                      ({q.weight}/10)
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <Button
                              variant="secondary"
                              className="gap-2"
                              onClick={() => setShowTestDialog(true)}
                            >
                              <Phone className="h-4 w-4" />
                              Start Test Call
                            </Button>
                            <Button
                              variant="secondary"
                              className="gap-2"
                              onClick={copyLink}
                            >
                              <Share2 className="h-4 w-4" />
                              Copy Share Link
                            </Button>
                            <Button
                              className="gap-2"
                              onClick={handleSubmit(onSubmit)}
                            >
                              <Check className="h-4 w-4" />
                              Create Screening
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button
                      variant="secondary"
                      onClick={prevStep}
                      disabled={step === 0}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </Button>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground hidden md:block">
                        Step {step + 1} of {STEPS.length}
                      </div>
                      {step < STEPS.length - 1 ? (
                        <Button onClick={nextStep} className="gap-2">
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          className="gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Create
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Live Preview */}
            <aside className="border-l bg-muted/40 p-4">
              <LivePreview
                title={values.title}
                role={values.role}
                seniority={values.seniority}
                durationMin={values.durationMin}
                focusAreas={values.focusAreas}
                openingScript={values.openingScript}
                questions={values.questions}
                voice={currentVoice}
                language={
                  LANGUAGES.find((l) => l.value === values.language)?.label ||
                  values.language
                }
                rate={values.speakingRate}
                recording={values.recordingConsent}
                callMethod={values.callMethod}
                shareUrl={mockShareUrl}
                candidate={values.candidate}
                schedule={values.schedule}
              />
            </aside>
          </div>
        </CardContent>
      </Card>

      {/* Test call dialog (UI only) */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Call</DialogTitle>
            <DialogDescription>
              Simulate your AI call experience. This is a UI preview only.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <div className="font-medium">
                  AI Voice: {currentVoice?.label}
                </div>
              </div>
              <Badge variant="secondary">
                {LANGUAGES.find((l) => l.value === values.language)?.label}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Intro: “{values.openingScript.slice(0, 140)}
                {values.openingScript.length > 140 ? "..." : ""}”
              </p>
              <p>
                Rate: {values.speakingRate.toFixed(2)}x • Recording:{" "}
                {values.recordingConsent ? "On" : "Off"}
              </p>
              <p>First question: {values.questions[0]?.text}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() =>
                  alert("Would start Vapi preview (frontend only)")
                }
              >
                <Radio className="h-4 w-4" />
                Play Sample
              </Button>
              <Button
                className="gap-2"
                onClick={() =>
                  alert("Would initiate outbound via your API (frontend only)")
                }
              >
                <Phone className="h-4 w-4" />
                Place Test Call
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowTestDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StepSidebar({
  step,
  setStep,
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  return (
    <div className="space-y-1">
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={[
              "w-full rounded-md border px-3 py-2 text-left transition",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "hover:bg-muted",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              {done ? <Check className="h-4 w-4 text-primary" /> : <></>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function LivePreview(props: {
  title: string;
  role: string;
  seniority: string;
  durationMin: number;
  focusAreas: string[];
  openingScript: string;
  questions: { id: string; text: string; weight: number }[];
  voice?: { label: string; persona: Persona; desc: string };
  language: string;
  rate: number;
  recording: boolean;
  callMethod: "share-link" | "outbound";
  shareUrl: string;
  candidate: { name?: string; email?: string; phone?: string };
  schedule: { date?: string; time?: string; timezone?: string };
}) {
  const qCount = props.questions.length;

  return (
    <div className="sticky top-4 space-y-4">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 rounded-md bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent p-3">
          <div className="text-sm font-medium">
            {props.title || "Untitled Screening"}
          </div>
          <div className="text-xs text-muted-foreground">
            {props.role} • {props.seniority} • {props.durationMin} min
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {props.focusAreas.map((f) => (
            <Badge key={f} variant="secondary">
              {f}
            </Badge>
          ))}
          {props.focusAreas.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No focus areas
            </span>
          )}
        </div>

        <div className="grid gap-3">
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Opening Script
            </div>
            <p className="text-sm text-foreground">
              {props.openingScript || "—"}
            </p>
          </div>

          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Questions ({qCount})
            </div>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {props.questions.slice(0, 5).map((q) => (
                <li key={q.id} className="text-foreground">
                  {q.text}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({q.weight}/10)
                  </span>
                </li>
              ))}
              {qCount > 5 && (
                <li className="text-xs text-muted-foreground">
                  +{qCount - 5} more…
                </li>
              )}
            </ol>
          </div>

          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Voice
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary">
                {props.voice?.label || "Neutral"}
              </Badge>
              <span className="text-muted-foreground">
                • {props.language} • {props.rate.toFixed(2)}x
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                Recording: {props.recording ? "On" : "Off"}
              </span>
            </div>
          </div>

          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              Call Method
            </div>
            {props.callMethod === "share-link" ? (
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <span className="truncate text-sm">{props.shareUrl}</span>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Outbound</span>
                </div>
                <div className="text-muted-foreground">
                  {props.candidate.name || "Candidate"} •{" "}
                  {props.candidate.phone || "—"}
                </div>
                <div className="text-muted-foreground">
                  {props.schedule.date || "—"} {props.schedule.time || ""} (
                  {props.schedule.timezone || "—"})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-2 text-sm font-medium">Preview Status</div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Basics</span>
            <Badge variant="secondary">Ready</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Script & Questions</span>
            <Badge variant="secondary">
              {qCount > 0 ? "Ready" : "Incomplete"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Voice & Dialer</span>
            <Badge variant="secondary">Configured</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// make it responsive and improve the drag and drop (for questions)
// Separates the codes in various component (this component has 1400+ lines of codes) in different files, and share all the file components with proper type interface defined properly