import { DowloadInvoice } from '@/actions/billing/DowloadInvoice';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

const InvoiceBtn = ({id} : {
    id: string
}) => {
  const mutation = useMutation({
    mutationFn: DowloadInvoice,
  });
  return (
    <Button
      variant={'ghost'}
      size={'sm'}
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      Invoice
      {mutation.isPending && (
         <Loader2Icon className='w-4 h-4 animate-spin' />
      )}
    </Button>
  );
};

export default InvoiceBtn;
