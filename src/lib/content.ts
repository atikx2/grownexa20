import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["Website", "YouTube", "Spotify", "SEO"] as const;
export const CATEGORY_PAGES = [
  { slug: "website", category: "Website", title: "Website Services", blurb: "Fast, modern websites designed and built for your business." },
  { slug: "youtube", category: "YouTube", title: "YouTube Services", blurb: "Editing, thumbnails and channel optimisation for creators." },
  { slug: "spotify", category: "Spotify", title: "Spotify & Music Promotion", blurb: "Release support and honest promotion for artists." },
  { slug: "seo", category: "SEO", title: "SEO Services", blurb: "Audits, on-page fixes and local SEO — no ranking guarantees." },
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Service = {
  id: string;
  category: string;
  slug: string;
  title: string;
  summary: string;
  details: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export type Package = {
  id: string;
  category: string;
  name: string;
  price: number;
  currency: string;
  price_note: string;
  description: string;
  features: string[];
  is_highlighted: boolean;
  sort_order: number;
  is_active: boolean;
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Review = {
  id: string;
  author_name: string;
  author_role: string;
  author_image: string | null;
  rating: number;
  content: string;
  category: string | null;
  is_published: boolean;
  sort_order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
};

export type Statistic = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  is_active: boolean;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  package_name: string;
  budget: string;
  message: string;
  status: string;
  admin_notes: string;
  created_at: string;
};

export type SettingRow = { key: string; value: string; label: string; sort_order: number };
export type Settings = Record<string, string>;


export const servicesQuery = {
  queryKey: ["services"],
  queryFn: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Service[];
  },
};

export const packagesQuery = {
  queryKey: ["packages"],
  queryFn: async (): Promise<Package[]> => {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("category")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Package[];
  },
};

export const portfolioQuery = {
  queryKey: ["portfolio_items"],
  queryFn: async (): Promise<PortfolioItem[]> => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as PortfolioItem[];
  },
};

export const reviewsQuery = {
  queryKey: ["reviews"],
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase.from("reviews").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Review[];
  },
};

export const faqsQuery = {
  queryKey: ["faqs"],
  queryFn: async (): Promise<Faq[]> => {
    const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Faq[];
  },
};

export const statisticsQuery = {
  queryKey: ["statistics"],
  queryFn: async (): Promise<Statistic[]> => {
    const { data, error } = await supabase.from("statistics").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Statistic[];
  },
};

export const settingsQuery = {
  queryKey: ["site_settings"],
  queryFn: async (): Promise<Settings> => {
    const { data, error } = await supabase.from("site_settings").select("*").order("sort_order");
    if (error) throw error;
    const map: Settings = {};
    for (const row of (data ?? []) as SettingRow[]) map[row.key] = row.value;
    return map;
  },
};

export const settingRowsQuery = {
  queryKey: ["site_settings_rows"],
  queryFn: async (): Promise<SettingRow[]> => {
    const { data, error } = await supabase.from("site_settings").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as SettingRow[];
  },
};

export function formatPrice(pkg: Pick<Package, "price" | "currency">) {
  const symbol = pkg.currency === "USD" ? "$" : "";
  const amount = Number(pkg.price).toLocaleString("en-US", { maximumFractionDigits: 0 });
  return symbol ? `${symbol}${amount}` : `${amount} ${pkg.currency}`;
}

export function whatsappLink(number: string, text: string) {
  const digits = (number || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
