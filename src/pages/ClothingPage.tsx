import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import homeClothing from "@/assets/home-clothing.jpg";
import { homeCardSurfaceSx, pageShellSx } from "@/theme/homeChrome";

export default function ClothingPage() {
  return (
    <Box
      sx={{
        ...pageShellSx,
        px: 2,
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 520 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowLeft size={18} />}
          color="inherit"
          sx={{
            mb: 1,
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          返回首页
        </Button>
        <Card elevation={0} sx={{ ...homeCardSurfaceSx, width: "100%" }}>
          <CardMedia
            component="img"
            height={220}
            image={homeClothing}
            alt="服饰"
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              服饰
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              穿搭与形象相关能力将在这里逐步开放，敬请期待。
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
