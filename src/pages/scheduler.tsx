import { SchedulerTable } from "@/components/data-table/tables/scheduler";
import { AppLayout } from "@/components/layout";
import SchedulerForm from "@/components/antivirus/scheduler-form";
import { SchedulerType } from "@/lib/types/schema";
import { useState } from "react";
import { ISchedulerData } from "@/lib/types";
import { SCHEDULER_COLS } from "@/components/data-table/columns/scheduler";
import { DAYS_OF_THE_WEEK } from "@/lib/constants";

export default function SchedulerPage(){
     const [schedulerData, setSchedulerData] = useState<ISchedulerData[]>([]);
     const handleSchedule = (values: SchedulerType) => {
          const d = new Date();
          if(values.interval==="daily") d.setDate(d.getDate()+1);
          if(values.interval==="weekly") d.setDate(d.getDate()+7);
          if(values.interval==="monthly") d.setMonth(d.getMonth()+1);
          d.setHours(values.hours);
          d.setMinutes(values.minutes);
          const currDay = d.getDay();
          const distance = DAYS_OF_THE_WEEK.indexOf(values.days) - currDay;
          d.setDate(d.getDate() + distance);
          setSchedulerData(prev=>[
               ...prev,
               {
                    id: (schedulerData.length+1).toString(),
                    interval: values.interval,
                    scanType: values.scanType,
                    lastScan: "Never",
                    nextScan: d.toLocaleString()
               }
          ])
     }
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Scheduler</h1>
               <SchedulerTable
                    columns={SCHEDULER_COLS}
                    data={schedulerData}
               />
               <h2 className="text-xl md:text-2xl font-medium border-b pb-2 w-fit self-start text-left">Schedule a scan</h2>
               <SchedulerForm
                    handleSubmit={handleSchedule}
               />
          </AppLayout>
     )
}