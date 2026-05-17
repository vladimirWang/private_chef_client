import { Steps } from 'antd-mobile';
import React, { useState } from 'react'
import Verification from './Verification';
import RegisterInfo from './RegisterInfo';

const { Step } = Steps;

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
    return (
        <div>
          {currentStep === 0 && <Verification onNext={() => setCurrentStep(1)} />}
          {currentStep === 1 && <RegisterInfo onPrevious={() => setCurrentStep(0)} />}
          <Steps current={currentStep}>
            <Step title='标题1' description='描述' />
            <Step title='标题2' description='描述' />
            <Step title='标题3' description='描述' />
          </Steps>
        </div>
      )
}
