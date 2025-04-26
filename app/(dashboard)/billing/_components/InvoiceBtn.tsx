import { DowloadInvoice } from '@/actions/billing/DowloadInvoice';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

const InvoiceBtn = ({id} : {
    id: string
}) => {
  return (
    <Button
      variant={'ghost'}
      size={'sm'}
      className="text-xs gap-2 text-muted-foreground px-1"

    >
    </Button>
  );
};

export default InvoiceBtn;
