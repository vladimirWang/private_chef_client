import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import homeFood from "@/assets/home-food.jpg";
import homeClothing from "@/assets/home-clothing.jpg";
import {
  homeCardInteractiveSx,
  pageShellSx,
} from "@/theme/homeChrome";

export default function HomePage() {
  return (
    <Box
      className="min-h-screen"
      sx={{
        ...pageShellSx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 2,
        py: 4,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          ...homeCardInteractiveSx,
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
          ...homeCardInteractiveSx,
        }}
      >
        <CardActionArea component={Link} to="/fileupload" sx={{ display: "block" }}>
          <CardMedia
            component="img"
            height={200}
            image={homeClothing}
            alt="资料上传"
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              资料上传
            </Typography>
            <Typography variant="body2" color="text.secondary">
              资料上传入口
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
