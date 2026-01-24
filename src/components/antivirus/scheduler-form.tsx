import { SchedulerType } from "@/lib/types/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { SchedulerSchema } from "@/lib/schemas";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ClipboardClock } from "lucide-react";
import { Input } from "../ui/input";
import { DAYS_OF_THE_WEEK, SCAN_OPTIONS } from "@/lib/constants";
import { ScanType } from "@/lib/types";
import { useEffect } from "react";

interface Props{
     handleSubmit: (values: SchedulerType) => void
}
export default function SchedulerForm({handleSubmit}: Props){
     const form = useForm<SchedulerType>({
          resolver: zodResolver(SchedulerSchema),
          defaultValues:{
               hours: new Date().getHours(),
               minutes: new Date().getMinutes(),
               days: DAYS_OF_THE_WEEK[new Date().getDay()],
               interval: "weekly",
               scanType: "main"
          }
     });
     const onSubmit = (values: SchedulerType) => {
          handleSubmit(values);
          const now = new Date();
          const interval = localStorage.getItem("scheduler-interval") as SchedulerType["interval"] | null;
          const scanType = localStorage.getItem("scheduler-scan-type") as ScanType | null
          form.reset({
               hours: now.getHours(),
               minutes: now.getMinutes(),
               days: DAYS_OF_THE_WEEK[now.getDay()],
               interval: interval ?? "weekly",
               scanType: scanType ?? "main",
          })
     }
     useEffect(()=>{
          localStorage.removeItem("scheduler-interval");
          localStorage.removeItem("scheduler-scan-type");
     },[])
     const time = `${form.watch("hours").toString().padStart(2,'0')}:${form.watch("minutes").toString().padStart(2,'0')}`
     const interval = form.watch("interval");
     return (
          <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField
                              control={form.control}
                              name="interval"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Interval</FormLabel>
                                        <Select
                                             onValueChange={val=>{
                                                  field.onChange(val);
                                                  localStorage.setItem("scheduler-interval",val)
                                             }}
                                             value={field.value}
                                        >
                                             <FormControl>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder="Weekly" />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                  <SelectItem value="daily">Daily</SelectItem>
                                                  <SelectItem value="weekly">Weekly</SelectItem>
                                                  <SelectItem value="monthly">Monthly</SelectItem>
                                             </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="scanType"
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Scan Type</FormLabel>
                                        <Select
                                             onValueChange={val=>{
                                                  field.onChange(val);
                                                  localStorage.setItem("scheduler-scan-type",val)
                                             }}
                                             value={field.value}
                                        >
                                             <FormControl>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder="Main Scan" />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                  {SCAN_OPTIONS.map(option=>(
                                                       <SelectItem key={option.value} value={option.value}><option.icon/> {option.content}</SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="days"
                              disabled={interval!=="weekly"}
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>Day of the Week</FormLabel>
                                        <Select
                                             onValueChange={field.onChange}
                                             value={field.value}
                                             disabled={interval!=="weekly"}
                                        >
                                             <FormControl>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder="Day of the week" />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                  <SelectItem value="mon">Monday</SelectItem>
                                                  <SelectItem value="tue">Tuesday</SelectItem>
                                                  <SelectItem value="wed">Wednesday</SelectItem>
                                                  <SelectItem value="thu">Thursday</SelectItem>
                                                  <SelectItem value="fri">Friday</SelectItem>
                                                  <SelectItem value="sat">Saturday</SelectItem>
                                                  <SelectItem value="sun">Sunday</SelectItem>
                                             </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                    </div>
                    <div className="flex gap-4 items-center justify-center">
                         <FormField
                              control={form.control}
                              name="hours"
                              render={({field})=>(
                                   <FormItem className="flex-1">
                                        <FormLabel>Hour</FormLabel>
                                        <FormControl>
                                             <Input {...field} type="number" onChange={e=>field.onChange(e.target.valueAsNumber)} placeholder="12" min={0} max={23}/>
                                        </FormControl>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="minutes"
                              render={({field})=>(
                                   <FormItem
                                        className="flex-1"
                                   >
                                        <FormLabel>Minute</FormLabel>
                                        <FormControl>
                                             <Input {...field} type="number" onChange={e=>field.onChange(e.target.valueAsNumber)} placeholder="00" min={0} max={59}/>
                                        </FormControl>
                                   </FormItem>
                              )}
                         />
                    </div>
                    {time!==":" && (
                         <p className="text-lg font-semibold text-muted-foreground">Scheduled Time: {time}</p>
                    )}
                    <Button type="submit">
                         <ClipboardClock/> Schedule
                    </Button>
               </form>
          </Form>
     )
}