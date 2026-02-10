import { SchedulerType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { getSchedulerSchema } from "@/lib/schemas";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ClipboardClock } from "lucide-react";
import { Input } from "../ui/input";
import { DAYS_OF_THE_WEEK, INTERVALS, SCAN_OPTIONS } from "@/lib/constants";
import { ScanType } from "@/lib/types/enums";
import { ISchedulerFormValues } from "@/lib/types/settings"
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useTranslation } from "react-i18next";
import { IntervalType } from "@/lib/types/data";

interface Props{
     handleSubmit: (values: SchedulerType) => void,
     isSubmitting: boolean
}
export default function SchedulerForm({handleSubmit, isSubmitting}: Props){
     const [data, setData] = useState<ISchedulerFormValues>({ interval: null, scanType: null })
     const {t: validationMsg} = useTranslation("messages")
     const form = useForm<SchedulerType>({
          resolver: zodResolver(getSchedulerSchema(validationMsg)),
          defaultValues:{
               hours: new Date().getHours(),
               minutes: new Date().getMinutes(),
               days: DAYS_OF_THE_WEEK[new Date().getDay()],
               interval: "weekly",
               scanType: ScanType.Main
          }
     });
     const onSubmit = (values: SchedulerType) => {
          handleSubmit(values);
          const now = new Date();
          const {interval, scanType} = data
          form.reset({
               hours: now.getHours(),
               minutes: now.getMinutes(),
               days: DAYS_OF_THE_WEEK[now.getDay()],
               interval: interval ?? values.interval,
               scanType: scanType ?? values.scanType,
          })
     }
     const time = `${form.watch("hours").toString().padStart(2,'0')}:${form.watch("minutes").toString().padStart(2,'0')}`
     const interval = form.watch("interval");
     const {t} = useTranslation("scan");
     const {t: formTxt} = useTranslation("scheduler")
     return (
          <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField
                              control={form.control}
                              name="interval"
                              disabled={isSubmitting}
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>{formTxt("form.interval.label")}</FormLabel>
                                        <Select
                                             onValueChange={val=>{
                                                  field.onChange(val);
                                                  setData(prev=>({
                                                       ...prev,
                                                       interval: val as IntervalType
                                                  }))
                                             }}
                                             value={field.value}
                                             disabled={isSubmitting}
                                        >
                                             <FormControl>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder={formTxt("form.interval.placeholder")} />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                  {INTERVALS.map(interval=>(
                                                       <SelectItem key={interval} value={interval}>
                                                            {formTxt(`form.interval.values.${interval}`)}
                                                       </SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="scanType"
                              disabled={isSubmitting}
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>{formTxt("form.scan-type.label")}</FormLabel>
                                        <Select
                                             onValueChange={val=>{
                                                  field.onChange(val);
                                                  setData(prev=>({
                                                       ...prev,
                                                       scanType: val as ScanType
                                                  }))
                                             }}
                                             value={field.value}
                                             disabled={isSubmitting}
                                        >
                                             <FormControl>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder={formTxt("form.scan-type.placeholder")} />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                  {SCAN_OPTIONS.map(option=> option.value !== ScanType.None && (
                                                       <SelectItem key={option.value} value={option.value}>
                                                            <option.icon/>
                                                            {t(`scan-type.${option.value}.name`)}
                                                       </SelectItem>
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
                              disabled={interval!=="weekly" || isSubmitting}
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>{formTxt("form.days.label")}</FormLabel>
                                        <Select
                                             onValueChange={field.onChange}
                                             value={field.value}
                                             disabled={interval!=="weekly" || isSubmitting}
                                        >
                                             <FormControl>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder={formTxt("form.days.placeholder")} />
                                                  </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                  {DAYS_OF_THE_WEEK.map(day=>(
                                                       <SelectItem key={day} value={day}>
                                                            {formTxt(`form.days.values.${day}`)}
                                                       </SelectItem>
                                                  ))}
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
                              disabled={isSubmitting}
                              render={({field})=>(
                                   <FormItem className="flex-1">
                                        <FormLabel>{formTxt("form.hour")}</FormLabel>
                                        <FormControl>
                                             <Input {...field} type="number" onChange={e=>field.onChange(e.target.valueAsNumber)} placeholder="12" min={0} max={23} disabled={isSubmitting}/>
                                        </FormControl>
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="minutes"
                              disabled={isSubmitting}
                              render={({field})=>(
                                   <FormItem
                                        className="flex-1"
                                   >
                                        <FormLabel>{formTxt("form.minute")}</FormLabel>
                                        <FormControl>
                                             <Input {...field} type="number" onChange={e=>field.onChange(e.target.valueAsNumber)} placeholder="00" min={0} max={59} disabled={isSubmitting}/>
                                        </FormControl>
                                   </FormItem>
                              )}
                         />
                    </div>
                    {time!==":" && (
                         <p className="text-lg font-semibold text-muted-foreground">
                              {formTxt("form.scheduled-time",{ time })}
                         </p>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting ? <Spinner/> : <ClipboardClock/>}
                         {isSubmitting ? formTxt("form.button.pending") : formTxt("form.button.original")}
                    </Button>
               </form>
          </Form>
     )
}