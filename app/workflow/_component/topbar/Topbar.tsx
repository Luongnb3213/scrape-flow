'use client';

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import SaveBtn from './SaveBtn';
import PublishBtn from './PublishBtn';
import NavigationTabs from './NavigationTabs';
import ExecuteBtn from './ExecuteBtn';
import UnPublishBtn from './UnPublishBtn';

interface Props {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished? : boolean;
}
const Topbar = ({
  title,
  subTitle,
  workflowId,
  hideButtons = false,
  isPublished = false,
}: Props) => {
  const router = useRouter();
  return (
    <header className="flex p-2 border-p-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="black">
          <Button variant={'ghost'} size={'icon'} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>

      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished && (<UnPublishBtn workflowId={workflowId} />)}
            {!isPublished && (
              <>
                <SaveBtn workflowId={workflowId} />
                <PublishBtn workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;
