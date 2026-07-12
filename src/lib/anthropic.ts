const BASE_URL = "https://api.anthropic.com/v1/organizations";
const ANTHROPIC_VERSION = "2023-06-01";

function getAdminKey(): string {
  const key = process.env.ANTHROPIC_ADMIN_KEY;
  if (!key) throw new Error("ANTHROPIC_ADMIN_KEY no está definida");
  return key;
}

async function adminGet<T>(path: string, params: Record<string, string | string[] | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(`${key}[]`, v);
    } else {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": getAdminKey(),
      "anthropic-version": ANTHROPIC_VERSION,
      "User-Agent": "TorunMonitor/1.0 (https://github.com/keiner17-code/torun-lab)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic Admin API ${path} → ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export interface UsageResultado {
  workspace_id: string | null;
  model: string | null;
  uncached_input_tokens: number;
  cache_read_input_tokens: number;
  cache_creation: {
    ephemeral_1h_input_tokens: number;
    ephemeral_5m_input_tokens: number;
  };
  output_tokens: number;
}

export interface UsageBucket {
  starting_at: string;
  ending_at: string;
  results: UsageResultado[];
}

interface UsageReportResponse {
  data: UsageBucket[];
  has_more: boolean;
  next_page: string | null;
}

export async function fetchUsageReport(opts: {
  startingAt: string;
  endingAt: string;
  bucketWidth?: "1m" | "1h" | "1d";
  groupBy?: string[];
}): Promise<UsageBucket[]> {
  const buckets: UsageBucket[] = [];
  let page: string | undefined;

  do {
    const resp = await adminGet<UsageReportResponse>("/usage_report/messages", {
      starting_at: opts.startingAt,
      ending_at: opts.endingAt,
      bucket_width: opts.bucketWidth ?? "1h",
      group_by: opts.groupBy ?? ["workspace_id", "model"],
      limit: "168",
      page,
    });
    buckets.push(...resp.data);
    page = resp.has_more ? resp.next_page ?? undefined : undefined;
  } while (page);

  return buckets;
}

export interface CostResultado {
  amount: string;
  currency: string;
  workspace_id: string | null;
}

export interface CostBucket {
  starting_at: string;
  ending_at: string;
  results: CostResultado[];
}

interface CostReportResponse {
  data: CostBucket[];
  has_more: boolean;
  next_page: string | null;
}

export async function fetchCostReport(opts: {
  startingAt: string;
  endingAt: string;
  groupBy?: string[];
}): Promise<CostBucket[]> {
  const buckets: CostBucket[] = [];
  let page: string | undefined;

  do {
    const resp = await adminGet<CostReportResponse>("/cost_report", {
      starting_at: opts.startingAt,
      ending_at: opts.endingAt,
      group_by: opts.groupBy ?? ["workspace_id"],
      limit: "31",
      page,
    });
    buckets.push(...resp.data);
    page = resp.has_more ? resp.next_page ?? undefined : undefined;
  } while (page);

  return buckets;
}
