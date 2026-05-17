import { Button } from 'antd-mobile';
import React from 'react'

interface RegisterInfoProps {
  onPrevious: () => void;
}
export default function RegisterInfo(props: RegisterInfoProps) {
  return (
    <div>RegisterInfo
      <Button onClick={props.onPrevious}>
        上一步
      </Button>
    </div>
  )
}
