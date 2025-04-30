"use client"
import { ParamProps } from '@/types/appNode'
import React from 'react'

const BrowserInstanceParam = ({ param, value, updateNodeParamValue }: ParamProps) => {
  return (
    <div>
      {param.name}
    </div>
  )
}

export default BrowserInstanceParam
