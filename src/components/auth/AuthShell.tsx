import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Apple, Sparkles, Sprout, TrendingUp } from "lucide-react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { authBrand, authColors, authHighlights } from "@/theme/authTheme";

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  altCta?: { preface: string; label: string; href: string };
};

const highlightIcons = [Sprout, TrendingUp, Apple] as const;

function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.28)",
      }}
    >
      <Sprout size={size * 0.55} strokeWidth={2} aria-hidden />
    </Box>
  );
}

function HeroPanel() {
  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <BrandMark />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {authBrand.name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85, display: "block", mt: 0.25 }}>
            青少年成长 · AI 膳食助手
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          mb: 2,
          fontSize: { md: "2.1rem", lg: "2.5rem" },
        }}
      >
        吃得对，
        <br />
        长得稳
      </Typography>

      <Typography
        variant="body1"
        sx={{
          opacity: 0.92,
          lineHeight: 1.75,
          maxWidth: 380,
          mb: 3.5,
          fontSize: "0.95rem",
        }}
      >
        {authBrand.tagline}
      </Typography>

      <Stack spacing={1.5}>
        {authHighlights.map((text, index) => {
          const Icon = highlightIcons[index] ?? Sparkles;
          return (
            <Stack key={text} direction="row" spacing={1.25} alignItems="flex-start">
              <Box
                sx={{
                  mt: 0.25,
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255,255,255,0.14)",
                  flexShrink: 0,
                }}
              >
                <Icon size={15} strokeWidth={2.25} aria-hidden />
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.55, opacity: 0.95 }}>
                {text}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

function DecorativeBlobs() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: -72,
          right: -64,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          bottom: 48,
          left: -48,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "24px",
          rotate: "12deg",
          background: "rgba(251, 191, 36, 0.15)",
          bottom: 120,
          right: 32,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
  altCta,
}: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        background: authColors.pageBg,
      }}
    >
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 2,
          background: authColors.heroGradient,
          color: "common.white",
        }}
      >
        <BrandMark size={36} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {authBrand.name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.88 }}>
            {authBrand.tagline}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: "0 0 44%",
          maxWidth: { md: 520 },
          flexDirection: "column",
          justifyContent: "center",
          px: { md: 5, lg: 7 },
          py: 8,
          background: authColors.heroGradient,
          color: "common.white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecorativeBlobs />
        <HeroPanel />
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
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Chip
              size="small"
              icon={<Sparkles size={14} />}
              label="AI 膳食顾问"
              sx={{
                bgcolor: "rgba(5, 150, 105, 0.1)",
                color: authColors.primaryDark,
                fontWeight: 600,
                border: `1px solid ${authColors.cardBorder}`,
                "& .MuiChip-icon": { color: authColors.primary },
              }}
            />
            <Chip
              size="small"
              label="4–10 岁成长营养"
              sx={{
                bgcolor: "rgba(56, 189, 248, 0.1)",
                color: "#0369a1",
                fontWeight: 600,
                border: "1px solid rgba(56, 189, 248, 0.2)",
              }}
            />
          </Stack>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
              mb: subtitle ? 1 : 3,
              color: "#0f172a",
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body1"
              sx={{ mb: 3, lineHeight: 1.7, color: "#64748b" }}
            >
              {subtitle}
            </Typography>
          ) : null}
          <Box
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 3,
              border: "1px solid",
              borderColor: authColors.cardBorder,
              boxShadow: authColors.cardShadow,
              p: { xs: 2.5, sm: 3.5 },
            }}
          >
            {children}
          </Box>
          {altCta ? (
            <Typography
              variant="body2"
              sx={{ mt: 3, textAlign: "center", color: "#64748b" }}
            >
              {altCta.preface}{" "}
              <Typography
                component={RouterLink}
                to={altCta.href}
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: authColors.primary,
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
