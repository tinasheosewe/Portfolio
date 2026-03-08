/* ── Block type definitions for ⌘K Command Palette AI responses ── */

export interface ProseBlock {
  type: "prose";
  content: string; // markdown
}

export interface ProjectCardBlock {
  type: "projectCard";
  slug: string;
  emphasis: string; // which aspect to highlight
}

export interface MetricRowBlock {
  type: "metricRow";
  items: { label: string; value: string }[];
}

export interface DiagramBlock {
  type: "diagram";
  mermaid: string; // mermaid syntax
  caption: string;
}

export interface CodeBlockBlock {
  type: "codeBlock";
  language: string;
  code: string;
  caption: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface CalloutBlock {
  type: "callout";
  variant: "info" | "tip" | "insight";
  content: string;
}

export interface SkillCloudBlock {
  type: "skillCloud";
  skills: string[];
  highlight: string[];
}

export interface TimelineBlock {
  type: "timeline";
  items: { date: string; title: string; detail: string }[];
}

export interface BeforeAfterBlock {
  type: "beforeAfter";
  title: string;
  left: { heading: string; items: string[] };
  right: { heading: string; items: string[] };
}

export type Block =
  | ProseBlock
  | ProjectCardBlock
  | MetricRowBlock
  | DiagramBlock
  | CodeBlockBlock
  | TableBlock
  | CalloutBlock
  | SkillCloudBlock
  | TimelineBlock
  | BeforeAfterBlock;

/* ── SSE event types ── */
export interface StatusEvent {
  type: "status";
  message: string;
}

export interface ProseEvent {
  type: "prose";
  content: string;
}

export interface BlocksEvent {
  type: "blocks";
  blocks: Block[];
}

export type SSEEvent = StatusEvent | ProseEvent | BlocksEvent;
