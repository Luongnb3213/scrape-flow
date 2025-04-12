'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParamProps } from '@/types/appNode';
import { TaskParam } from '@/types/task';
import React, { useId } from 'react';

const StringParam = ({ param, value, updateNodeParamValue }: ParamProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = React.useState(value || "");
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <Input
        placeholder="Enter value here"
        value={internalValue}
        className='text-xs'
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
        id={id}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2"> {param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
