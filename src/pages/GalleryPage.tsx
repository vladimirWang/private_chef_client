import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DishWaterfall from "@/components/DishWaterfall";
import { getDishList } from "@/api/dish";
import { pageShellSx } from "@/theme/homeChrome";
import type { Dish } from "@/types/dish";

export default function GalleryPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getDishList();
        if (!cancelled) setDishes(res.dishes);
      } catch {
        if (!cancelled) setError("加载失败，请确认已登录");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ ...pageShellSx, pb: 10, minHeight: "100vh", bgcolor: "#f7f7f7" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : error ? (
        <p className="px-2 py-6 text-center text-red-600">{error}</p>
      ) : dishes.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
          <p className="mb-2 text-gray-500">还没有上传菜品</p>
          <Button component={Link} to="/dish/upload" variant="contained">
            去上传
          </Button>
        </Box>
      ) : (
        <DishWaterfall dishes={dishes} />
      )}

      {!loading && !error ? (
        <Fab
          component={Link}
          to="/dish/upload"
          color="primary"
          aria-label="上传菜品"
          sx={{
            position: "fixed",
            right: 16,
            bottom: 72,
            bgcolor: "#ff2442",
            "&:hover": { bgcolor: "#e01f3a" },
          }}
        >
          <Plus size={24} color="#fff" />
        </Fab>
      ) : null}
    </Box>
  );
}
