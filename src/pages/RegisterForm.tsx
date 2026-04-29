import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import AuthShell from "@/components/auth/AuthShell";
import { userRegister } from "@/api/user";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = React.useState("fernando");
  const [email, setEmail] = React.useState("1123@qq.com");
  const [password, setPassword] = React.useState("12345678");
  const [confirmPassword, setConfirmPassword] = React.useState("12345678");
  const [agree, setAgree] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (password !== confirmPassword) {
      setFormError("两次输入的密码不一致");
      return;
    }
    if (!agree) {
      setFormError("请先同意服务条款与隐私政策");
      return;
    }
    setSubmitting(true);
    try {
      const result = await userRegister({
        email: email.trim(),
        password,
        nickname: displayName.trim(),
      });
      if (result.ok) {
        navigate("/login?registered=1", { replace: true });
        return;
      }
      setFormError(result.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="创建账号"
      subtitle="填写基本信息，即可开始使用私厨预约与菜单服务。"
      altCta={{ preface: "已有账号？", label: "去登录", href: "/login" }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          {formError ? (
            <Alert severity="error" onClose={() => setFormError(null)}>
              {formError}
            </Alert>
          ) : null}
          <TextField
            required
            fullWidth
            id="displayName"
            label="称呼或昵称"
            name="displayName"
            autoComplete="name"
            autoFocus
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="邮箱"
            name="email"
            type="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="确认密码"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                color="primary"
              />
            }
            label="我已阅读并同意服务条款与隐私政策"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!agree || submitting}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                提交中…
              </>
            ) : (
              "注册"
            )}
          </Button>
        </Stack>
      </Box>
    </AuthShell>
  );
}
