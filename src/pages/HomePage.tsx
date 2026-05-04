import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import homeFood from "@/assets/home-food.jpg";
import homeClothing from "@/assets/home-clothing.jpg";

const cardShadow =
  "0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09)";

const cardShadowHover =
  "0 3px 6px -4px rgba(0,0,0,0.18), 0 6px 16px 0 rgba(0,0,0,0.14), 0 9px 28px 8px rgba(0,0,0,0.10)";

export default function HomePage() {
  return (
    <Box
      className="min-h-screen"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 2,
        py: 4,
        bgcolor: "background.default",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: cardShadow,
          overflow: "hidden",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: cardShadowHover,
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardActionArea component={Link} to="/yum" sx={{ display: "block" }}>
          <CardMedia
            component="img"
            height={200}
            image={homeFood}
            alt="美食"
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              美食
            </Typography>
            <Typography variant="body2" color="text.secondary">
              美食助手与相关能力入口
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: cardShadow,
          overflow: "hidden",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: cardShadowHover,
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardActionArea component={Link} to="/clothing" sx={{ display: "block" }}>
          <CardMedia
            component="img"
            height={200}
            image={homeClothing}
            alt="服饰"
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              服饰
            </Typography>
            <Typography variant="body2" color="text.secondary">
              穿搭与服饰相关入口
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
