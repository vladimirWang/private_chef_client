import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, Input } from "antd-mobile";
import AuthShell from "@/components/auth/AuthShell";
import {
  AuthFormShell,
  authFormSubmitButtonStyle,
} from "@/components/auth/AuthFormShell";
import { userLogin, getUserSalt, type IUserLoginRequest } from "@/api/user";
import { getNonce } from "@/api/util";
import { hashPassword } from "@/utils/algo";

const { Item, useForm } = Form;

function postLoginPathFromWindow(search: string): string {
  const raw = new URLSearchParams(search).get("from")?.trim() ?? "";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\0")) {
    return raw;
  }
  return "/";
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [form] = useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (value: IUserLoginRequest) => {
    setSubmitting(true);
    try {
      const nonce = await getNonce();
      const { email, password } = value;
      const salt = await getUserSalt(email.trim());
      const passwordHash = await hashPassword(password, nonce, salt);
      const result = await userLogin({
        email: email.trim(),
        password: passwordHash,
        nonce,
      });
      localStorage.setItem("access_token", result.token);
      navigate(postLoginPathFromWindow(search.toString()), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="欢迎回来"
      subtitle="登录后继续与 AI 膳食顾问对话，查看为你定制的成长营养建议与饮食记录。"
      altCta={{ preface: "还没有账号？", label: "免费注册", href: "/landing/register" }}
    >
      <AuthFormShell hint="使用注册邮箱登录，即可继续上次的 AI 膳食咨询。">
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSubmit}
          footer={
            <Button
              type="submit"
              block
              color="primary"
              loading={submitting}
              disabled={submitting}
              style={authFormSubmitButtonStyle}
            >
              登录
            </Button>
          }
        >
          <Item
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input placeholder="输入邮箱" />
          </Item>
          <Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="输入密码" />
          </Item>
        </Form>
      </AuthFormShell>
    </AuthShell>
  );
}
