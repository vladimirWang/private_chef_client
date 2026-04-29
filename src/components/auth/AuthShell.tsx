import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { Box, Typography } from "@mui/material";

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  altCta?: { preface: string; label: string; href: string };
};

export default function AuthShell({
  title,
  subtitle,
  children,
  altCta,
}: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "#f4f4f5",
      }}
    >
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 2,
          background:
            "linear-gradient(160deg, #1c1917 0%, #292524 45%, #44403c 100%)",
          color: "common.white",
        }}
      >
        <ChefHat size={28} strokeWidth={1.75} aria-hidden />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Private Chef
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: "0 0 42%",
          maxWidth: { md: 540 },
          flexDirection: "column",
          justifyContent: "center",
          px: { md: 6, lg: 8 },
          py: 8,
          background:
            "linear-gradient(160deg, #1c1917 0%, #292524 45%, #44403c 100%)",
          color: "common.white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            top: -80,
            right: -80,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            bottom: 40,
            left: -60,
            pointerEvents: "none",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <ChefHat size={40} strokeWidth={1.5} aria-hidden />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Private Chef
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              mb: 2,
              fontSize: { md: "2.25rem", lg: "2.75rem" },
            }}
          >
            私宴风味
            <br />
            由此开启
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.88,
              lineHeight: 1.6,
              maxWidth: 400,
              fontSize: "1rem",
            }}
          >
            为每一次家宴匹配专属菜单与主厨服务，让餐桌成为家的中心。
          </Typography>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          py: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 440 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              mb: subtitle ? 1 : 3,
              color: "#18181b",
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              {subtitle}
            </Typography>
          ) : null}
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
              p: { xs: 3, sm: 4 },
            }}
          >
            {children}
          </Box>
          {altCta ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 3, textAlign: "center" }}
            >
              {altCta.preface}{" "}
              <Typography
                component={RouterLink}
                to={altCta.href}
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {altCta.label}
              </Typography>
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
