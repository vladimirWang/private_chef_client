import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Button, Divider, Input, Modal } from "antd-mobile";
import { sendEmailVerificationCode, verifyEmail } from "@/api/util";
import { CheckCircleOutline } from 'antd-mobile-icons';

interface EmailVerificationProps {
  email: string;
}
export interface EmailVerificationHandle {
  sendCode: () => Promise<void>;
}

const COUNTDOWN_TIME = 60;
function EmailVerification(
  props: EmailVerificationProps,
  ref: React.Ref<EmailVerificationHandle>
) {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    sendCode: async () => {
      return Promise.resolve();
    },
  }));
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const txt =useMemo(() => {
    if (countdown > 0) {
      return `${countdown}s`;
    }
    return "重新发送";
  }, [countdown])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
        setVisible(true);
        setLoading(true)
    try {
        await sendEmailVerificationCode(props.email)
    } finally {
        setLoading(false)
    }
    setCountdown(COUNTDOWN_TIME);
    if (timer.current != null) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
        if (countdown <= 0) {
            if (timer.current != null) {
                clearInterval(timer.current);
                timer.current = null;
            }
            return;
        }
      setCountdown((prev) => {
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (timer.current != null) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, []);
  const handleSubmit = async() => {
    setSubmitLoading(true)
    try {
      await verifyEmail({email: props.email, code})
    //   message.success("验证码正确")
        setVisible(false)
        setPassVerification(true)
    } finally {
      setSubmitLoading(false)
    }
  }
  const [submitLoading, setSubmitLoading] = useState(false);
  const [passVerification, setPassVerification] = useState(false);
  return (
    <div>
      {
        passVerification ? (
          <CheckCircleOutline style={{color: "green"}}/>
        ) : (
          <Button size="mini" onClick={handleSend}>发送验证码</Button>
        )
      }
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="邮箱验证"
        content={
          <>
            <p className="text-xs text-gray-500">验证码已发送至<span className="text-sm font-bold">&nbsp;{props.email}&nbsp;</span></p>
            {/* <p>请在邮箱中查看验证码，并输入验证码</p> */}
            {/* <Divider /> */}
            <div className="p-2 mt-2 border-t border-gray-300">
                <section className="py-4 flex items-center gap-2">
                    <Input
                    placeholder="请输入验证码"
                    value={code}
                    onChange={setCode}
                    />
                    <Button size="mini" style={{width: 110}} disabled={countdown > 0 || loading} onClick={handleSend}>{loading ? '发送中...': txt}</Button>
                    {/* <span style={{width: 85}} className="text-center bg-amber-500 text-sm text-gray-500">{txt}</span> */}
                </section>
                <Button color="primary" block size="small" onClick={handleSubmit} loading={submitLoading}>提交</Button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default forwardRef(EmailVerification);
