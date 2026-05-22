import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Eye, Heart } from "lucide-react";
import {
  dishCoverImage,
  dishDisplayTitle,
  formatDishDate,
  formatViewCount,
  type Dish,
} from "@/types/dish";

type DishFeedCardProps = {
  dish: Dish;
};

export default function DishFeedCard({ dish }: DishFeedCardProps) {
  const [liked, setLiked] = useState(false);
  const title = dishDisplayTitle(dish);
  const displayName = dish.user?.display_name ?? "我";
  const dateStr = formatDishDate(dish.created_at_ms);
  const viewCount = dish.view_count ?? 0;
  const coverUrl = dishCoverImage(dish);

  return (
    <article className="mb-3 overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="relative leading-none">
        <img
          src={coverUrl}
          alt={title}
          loading="lazy"
          className="block w-full object-cover"
        />
        {viewCount > 0 ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-xs leading-snug text-white">
            <Eye size={14} strokeWidth={2} />
            {formatViewCount(viewCount)}
          </span>
        ) : null}
      </div>

      <div className="px-2.5 pb-2.5 pt-2.5">
        <h3 className="mb-2.5 line-clamp-2 text-[15px] font-semibold leading-snug text-[#1a1a1a]">
          {title}
        </h3>

        <div className="flex items-center gap-1.5">
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 13,
              bgcolor: "#ff6b6b",
              flexShrink: 0,
            }}
          >
            {displayName.slice(0, 1).toUpperCase()}
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-snug text-[#333]">
              {displayName}
            </p>
            <p className="text-[11px] leading-snug text-[#999]">{dateStr}</p>
          </div>

          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className={`inline-flex shrink-0 items-center gap-0.5 border-0 bg-transparent p-1 text-[13px] cursor-pointer ${
              liked ? "text-[#ff2442]" : "text-[#666]"
            }`}
          >
            <Heart
              size={18}
              fill={liked ? "currentColor" : "none"}
              strokeWidth={liked ? 0 : 2}
            />
            <span>赞</span>
          </button>
        </div>
      </div>
    </article>
  );
}
