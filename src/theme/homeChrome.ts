import type { SxProps, Theme } from "@mui/material/styles";

/** 与首页 Card 一致的多层阴影（接近 Ant Design Card） */
export const HOME_CARD_SHADOW =
  "0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09)";

export const HOME_CARD_SHADOW_HOVER =
  "0 3px 6px -4px rgba(0,0,0,0.18), 0 6px 16px 0 rgba(0,0,0,0.14), 0 9px 28px 8px rgba(0,0,0,0.10)";

/** 静态展示用卡片（无 hover 抬起） */
export const homeCardSurfaceSx: SxProps<Theme> = {
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: HOME_CARD_SHADOW,
  bgcolor: "background.paper",
  overflow: "hidden",
};

/** 可点击入口卡片 hover */
export const homeCardInteractiveSx: SxProps<Theme> = {
  ...homeCardSurfaceSx,
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow: HOME_CARD_SHADOW_HOVER,
    transform: "translateY(-2px)",
  },
};

export const pageShellSx: SxProps<Theme> = {
  minHeight: "100vh",
  bgcolor: "background.default",
};
