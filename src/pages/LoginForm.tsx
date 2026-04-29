import * as React from "react";
import { Suspense } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AuthShell from "@/components/auth/AuthShell";
import { loginAccount } from "@/lib/auth/loginAccount";
import axios from 'axios'

function postLoginPathFromWindow(search: string): string {
  const raw = new URLSearchParams(search).get("from")?.trim() ?? "";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\0")) {
    return raw;
  }
  return "/assistant";
}

function RegisteredBanner() {
  const [params] = useSearchParams();
  if (params.get("registered") !== "1") {
    return null;
  }
  return <Alert severity="success">注册成功，请使用邮箱登录。</Alert>;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const result = await loginAccount({
        email: email.trim(),
        password,
        remember,
      });
      if (result.ok) {
        navigate(postLoginPathFromWindow(search.toString()), { replace: true });
        return;
      }
      setFormError(result.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="欢迎回来"
      subtitle="登录后可同步偏好、管理预约与家宴计划。"
      altCta={{ preface: "还没有账号？", label: "立即注册", href: "/register" }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <Suspense fallback={null}>
            <RegisteredBanner />
          </Suspense>
          {formError ? (
            <Alert severity="error" onClose={() => setFormError(null)}>
              {formError}
            </Alert>
          ) : null}
          <TextField
            required
            fullWidth
            id="email"
            label="邮箱"
            name="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  color="primary"
                />
              }
              label="记住我"
            />
            <Typography
              variant="body2"
              component={RouterLink}
              to="#"
              sx={{
                fontWeight: 500,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              忘记密码？
            </Typography>
          </Box>
          <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting}>
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                登录中…
              </>
            ) : (
              "登录"
            )}
          </Button>
          <button onClick={() => {
            axios.get("/api").then(res => {
              console.log("success: ", res)
            }).catch(e => {
              console.log("fail: ", e)
            })
          }}>test</button>
        </Stack>
      </Box>
    </AuthShell>
  );
}
