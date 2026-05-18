import { Button, Form, Input } from 'antd-mobile';
import type { RuleObject } from 'antd-mobile/es/components/form';
import React, { useRef } from 'react'
import EmailVerification, { type EmailVerificationHandle } from '@/components/EmailVerification';
import { userRegister } from '@/api/user';
import { useNavigate } from 'react-router-dom';

interface VerificationProps {
  onNext: () => void;
}

interface VerificationFormValues {
  email: string;
//   code: string;
  password: string;
  nickname: string;
}
 const initialValues: VerificationFormValues & {passwordConfirm: string} = {
  email: '413114463@qq.com',
  nickname: '',
  password: '123456',
  passwordConfirm: '123456',
//   code: '',
}
const {Item, useForm, useWatch} = Form
export default function Verification(props: VerificationProps) {
    const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [form] = useForm()
  const emailVerificationRef = useRef<EmailVerificationHandle>(null)

  const handleSubmit = async (values: VerificationFormValues) => {
    try {
      setLoading(true)
      console.log('Received values:', values);
      await userRegister(values)
      navigate('/landing/login')
    //   props.onNext()
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setLoading(false)
    }
  }

  const emailValue = useWatch('email', form)

  const validateEmailVerified = (
    _rule: RuleObject,
    _value: string,
    callback: (error?: string) => void,
  ) => {
    if (emailVerificationRef.current?.passVerification) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('请先完成邮箱验证'))
  }

  const validatePasswordConfirm = (
    _rule: RuleObject,
    value: string,
    callback: (error?: string) => void,
  ) => {
    if (!value || value === form.getFieldValue('password')) {
    //   callback()
      return Promise.resolve()
    }
    return Promise.reject(new Error('两次输入的密码不一致'))
  }

  return (
    <div>
      <Form form={form} layout='horizontal' onFinish={handleSubmit} initialValues={initialValues}>
        <Item
          label='邮箱'
          name='email'
          rules={[
            { required: true, message: '请输入邮箱', validateTrigger: ['onChange', 'onBlur'] },
            { validator: validateEmailVerified, validateTrigger: 'onSubmit' },
          ]}
          extra={<EmailVerification key={emailValue} ref={emailVerificationRef} email={emailValue ?? ''}
            onUpdateResult={(result: boolean) => {
                console.log('onUpdateResult: ', result)
                form.setFields([{name: 'email', errors: result ? [] : ['邮箱验证失败']}])
            }}
          />}
        >
          <Input placeholder='请输入邮箱' />
        </Item>
        <Item label='密码' name='password' rules={[{required: true, message: '请输入密码'}, {len: 6, message: '密码长度不能小于6位'}]}>
          <Input type="password" placeholder='请输入密码' />
        </Item>
        <Item label='密码确认' name='passwordConfirm' rules={[{validator: validatePasswordConfirm}]}>
          <Input type="password" placeholder='请再次输入密码' />
        </Item>
        <Item>
          <section>
            <Button type='submit' block color="primary" loading={loading}>提交</Button>
            {/* <Button onClick={props.onNext}>
              下一步
            </Button> */}
          </section>
        </Item>
      </Form>
    </div>
  )
}
