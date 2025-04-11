import { TaskType } from "@/types/task";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = { 
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props : LucideProps) => {
        return (
            <GlobeIcon className="stroke-pink-400" {...props} />
        )
    },
    isEntryPoint: true,
    
}