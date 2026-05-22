export type DishUser = {
  email: string;
  display_name: string;
};

export type Dish = {
  id: number;
  image_urls: string[];
  title: string | null;
  content: string;
  view_count?: number;
  created_at_ms: number;
  updated_at_ms: number;
  deleted_at_ms?: number | null;
  user?: DishUser;
};

/** 列表封面：取第一张图 */
export function dishCoverImage(dish: Dish): string {
  return dish.image_urls[0] ?? "";
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\u4e00-\u9fa5\w]+/g) ?? [];
  return [...new Set(matches)];
}

export function dishDisplayTitle(dish: Dish): string {
  if (dish.title?.trim()) return dish.title.trim();
  const tags = extractHashtags(dish.content);
  if (tags[0]) return tags[0];
  const line = dish.content.split("\n")[0].trim();
  if (!line) return "未命名菜品";
  return line.length > 28 ? `${line.slice(0, 28)}…` : line;
}

export function formatDishDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatViewCount(n: number): string {
  if (n >= 10000) {
    const w = n / 10000;
    return w >= 10 ? `${Math.round(w)}万` : `${w.toFixed(1)}万`;
  }
  return String(n);
}
