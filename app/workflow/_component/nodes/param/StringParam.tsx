'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/appNode';
import { TaskParam } from '@/types/task';
import React, { useEffect, useId } from 'react';

const StringParam = ({ param, value, updateNodeParamValue,disabled }: ParamProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = React.useState(value || "");
  useEffect(() => {
      setInternalValue(value || "")
  },[value])

   var Component:  any = Input
   if(param.variant === 'textarea') {
     Component = Textarea
   }
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Component
        placeholder="Enter value here"
        value={internalValue}
        className='text-xs'
        disabled={disabled}
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
        id={id}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2"> {param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
