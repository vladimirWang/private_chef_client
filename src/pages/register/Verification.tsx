import { Button, Form, Input } from 'antd-mobile';
import React, { useRef } from 'react'
import EmailVerification, { type EmailVerificationHandle } from '@/components/EmailVerification';
interface VerificationProps {
  onNext: () => void;
}

interface VerificationFormValues {
  email: string;
  code: string;
}
 const initialValues: VerificationFormValues = {
  email: '413114463@qq.com',
  code: '',
}
const {Item, useForm, useWatch} = Form
export default function Verification(props: VerificationProps) {
  const [sendingCode, setSendingCode] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [form] = useForm()

  const handleSubmit = (values: VerificationFormValues) => {
    try {
      setLoading(true)
      console.log('Received values:', values);
      props.onNext()
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setLoading(false)
    }
  }

  const handleSendVerificationCode = async () => {
    
  }

  const emailValue = useWatch('email', form)
  const emailVerificationRef = useRef<EmailVerificationHandle>(null)
  
  return (
    <div>
      <Form form={form} layout='horizontal' onFinish={handleSubmit} initialValues={initialValues}>
        <Item label='邮箱' name='email' rules={[{required: true, message: '请输入邮箱'}]} 
            extra={<EmailVerification email={emailValue} />}
        >
          <Input placeholder='请输入邮箱' />
        </Item>
        <Item label='验证码' name='code' rules={[{required: true, message: '请输入验证码'}]}>
          <Input placeholder='请输入验证码' />
        </Item>
        <Item>
          <section>
            <Button type='submit' block color="primary" loading={loading}>提交</Button>
            <Button onClick={props.onNext}>
              下一步
            </Button>
          </section>
        </Item>
      </Form>
    </div>
  )
}
