import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { homeCardSurfaceSx, pageShellSx } from "@/theme/homeChrome";

export default function NotFound() {
  return (
    <Box
      sx={{
        ...pageShellSx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Card elevation={0} sx={{ ...homeCardSurfaceSx, maxWidth: 420, width: "100%" }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            404
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            找不到该页面，可能链接已失效或路径有误。
          </Typography>
          <Button component={Link} to="/" variant="contained" size="large" fullWidth>
            回到首页
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
