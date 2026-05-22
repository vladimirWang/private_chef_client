import Box from "@mui/material/Box";
import Masonry from "react-masonry-css";
import DishFeedCard from "@/components/DishFeedCard";
import type { Dish } from "@/types/dish";

const breakpointColumns = {
  default: 2,
  480: 2,
  320: 1,
};

type DishWaterfallProps = {
  dishes: Dish[];
};

export default function DishWaterfall({ dishes }: DishWaterfallProps) {
  return (
    <Box sx={{ px: 1.25, pt: 0.5 }}>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {dishes.map((dish) => (
          <DishFeedCard key={dish.id} dish={dish} />
        ))}
      </Masonry>
    </Box>
  );
}
