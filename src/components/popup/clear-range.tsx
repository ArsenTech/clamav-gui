import { useForm } from "react-hook-form";
import Popup from ".";
import { ClearByRangeType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClearByRangeSchema } from "@/lib/schemas";
import { useTranslation } from "react-i18next";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import RangePicker from "../range-picker"
import { useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/helpers";
import { DateRange } from "react-day-picker";
import LoadingButton from "../loading-button";

interface Props{
     open: boolean,
     onOpen: (open: boolean) => void,
     onSuccess: (range: DateRange) => void
}
export default function ClearRangePopup({open, onOpen, onSuccess}: Props){
     const {t: msgTxt} = useTranslation("messages")
     const {t} = useTranslation("history")
     const [isClearing, startTransition] = useTransition()
     const form = useForm<ClearByRangeType>({
          resolver: zodResolver(getClearByRangeSchema(msgTxt)),
     })
     const {t: confTxt} = useTranslation("confirmation")
     const onSubmit = (values: ClearByRangeType) => {
          if(isClearing) return;
          startTransition(async() => {
               try {
                    await invoke("clear_by_range",{
                         from: values.dateRange.from.toISOString(),
                         to: values.dateRange.to.toISOString()
                    })
                    toast.success(t("clear-messages.by-range"))
                    onSuccess(values.dateRange)
                    onOpen(false);
                    form.reset();
               } catch (err) {
                    toast.error(msgTxt("history-clear-errror"),{
                         description: getErrorMessage(err)
                    })
               }
          })
     }
     return (
          <Popup
               open={open}
               onOpen={onOpen}
               title={t("clear-range.title")}
               description={t("clear-range.desc")}
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                              control={form.control}
                              name="dateRange"
                              disabled={isClearing}
                              render={({field})=>(
                                   <FormItem>
                                        <FormLabel>{t("clear-range.range-label")}</FormLabel>
                                        <FormControl>
                                             <RangePicker
                                                  name="dateRange"
                                                  onBlur={field.onBlur}
                                                  value={field.value}
                                                  disabled={field.disabled}
                                                  onChange={val=>field.onChange(val)}
                                             />
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <LoadingButton isLoading={isClearing} type="submit" variant="destructive">
                              {confTxt("actions.clear")}
                         </LoadingButton>
                    </form>
               </Form>
          </Popup>
     )
}