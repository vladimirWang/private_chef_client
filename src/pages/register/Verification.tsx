import { Button, Form, Input } from "antd-mobile";
import type { RuleObject } from "antd-mobile/es/components/form";
import React, { useRef } from "react";
import EmailVerification, { type EmailVerificationHandle } from "@/components/EmailVerification";
import { userRegister } from "@/api/user";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { authColors } from "@/theme/authTheme";

interface VerificationProps {
  onNext: () => void;
}

interface VerificationFormValues {
  email: string;
  password: string;
  nickname: string;
}

const initialValues: VerificationFormValues & { passwordConfirm: string } = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const { Item, useForm, useWatch } = Form;

export default function Verification(_props: VerificationProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [form] = useForm();
  const emailVerificationRef = useRef<EmailVerificationHandle>(null);

  const handleSubmit = async (values: VerificationFormValues) => {
    try {
      setLoading(true);
      await userRegister(values);
      navigate("/landing/login?registered=1", { replace: true });
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const emailValue = useWatch("email", form);

  const validateEmailVerified = (_rule: RuleObject) => {
    if (emailVerificationRef.current?.passVerification) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请先完成邮箱验证"));
  };

  const validatePasswordConfirm = (_rule: RuleObject, value: string) => {
    if (!value || value === form.getFieldValue("password")) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("两次输入的密码不一致"));
  };

  return (
    <Box
      className="auth-mobile-form"
      sx={{
        "& .adm-list-item": { paddingLeft: 0, paddingRight: 0 },
        "& .adm-list-item-content": { borderTop: "none" },
        "& .adm-form-item-label": {
          fontWeight: 600,
          color: "#334155",
          fontSize: 14,
        },
        "& .adm-input": {
          "--font-size": "15px",
          "--placeholder-color": "#94a3b8",
          borderRadius: "10px",
          border: `1px solid ${authColors.cardBorder}`,
          padding: "10px 12px",
          background: "#f8fafc",
        },
        "& .adm-form-item.adm-form-item-horizontal .adm-form-item-label": {
          width: 72,
        },
      }}
    >
      <Typography variant="body2" sx={{ color: "#64748b", mb: 2.5, lineHeight: 1.65 }}>
        填写信息完成注册。建议由家长协助设置账号，便于共同关注孩子的饮食与成长。
      </Typography>

      <Form
        form={form}
        layout="horizontal"
        onFinish={handleSubmit}
        initialValues={initialValues}
        footer={
          <Button
            type="submit"
            block
            color="primary"
            loading={loading}
            style={{
              "--background-color": authColors.primary,
              "--border-radius": "12px",
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            注册并开启 AI 膳食咨询
          </Button>
        }
      >
        <Item
        //   label="昵称"
          name="nickname"
          rules={[{ required: true, message: "请输入昵称" }]}
        >
          <Input placeholder="输入昵称" />
        </Item>
        <Item
        //   label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱" },
            { validator: validateEmailVerified, validateTrigger: "onSubmit" },
          ]}
          extra={
            <EmailVerification
              key={emailValue}
              ref={emailVerificationRef}
              email={emailValue ?? ""}
              onUpdateResult={(result: boolean) => {
                form.setFields([
                  { name: "email", errors: result ? [] : ["邮箱验证失败"] },
                ]);
              }}
            />
          }
        >
          <Input placeholder="用于登录与接收报告" />
        </Item>
        <Item
        //   label="密码"
          name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, message: "密码至少 6 位" },
          ]}
        >
          <Input type="password" placeholder="输入密码，至少 6 位" />
        </Item>
        <Item
        //   label="确认"
          name="passwordConfirm"
          rules={[{ validator: validatePasswordConfirm }]}
        >
          <Input type="password" placeholder="再次输入密码" />
        </Item>
      </Form>
    </Box>
  );
}
