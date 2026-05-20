import { Button, Form, Input } from "antd-mobile";
import type { RuleObject } from "antd-mobile/es/components/form";
import React, { useRef } from "react";
import EmailVerification, {
  type EmailVerificationHandle,
} from "@/components/EmailVerification";
import {
  AuthFormShell,
  authFormSubmitButtonStyle,
} from "@/components/auth/AuthFormShell";
import { userRegister } from "@/api/user";
import { useNavigate } from "react-router-dom";

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
    <AuthFormShell hint="填写信息完成注册。建议由家长协助设置账号，便于共同关注孩子的饮食与成长。">
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
            disabled={loading}
            style={authFormSubmitButtonStyle}
          >
            注册并开启 AI 膳食咨询
          </Button>
        }
      >
        <Item
          name="nickname"
          rules={[{ required: true, message: "请输入昵称" }]}
        >
          <Input placeholder="输入昵称" />
        </Item>
        <Item
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
          name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, message: "密码至少 6 位" },
          ]}
        >
          <Input type="password" placeholder="输入密码，至少 6 位" />
        </Item>
        <Item
          name="passwordConfirm"
          rules={[{ validator: validatePasswordConfirm }]}
        >
          <Input type="password" placeholder="再次输入密码" />
        </Item>
      </Form>
    </AuthFormShell>
  );
}
