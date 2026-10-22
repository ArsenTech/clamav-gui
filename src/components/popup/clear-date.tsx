import { useForm } from "react-hook-form";
import Popup from ".";
import { ClearByDateType } from "@/lib/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClearByDateSchema } from "@/lib/schemas";
import { useTranslation } from "react-i18next";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { lazy, Suspense, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/helpers";
import LoadingButton from "../loading-button";
import { Skeleton } from "../ui/skeleton";

const DatePickerInput = lazy(()=>import("../date-picker"));

interface Props{
     open: boolean,
     onOpen: (open: boolean) => void,
     onSuccess: (date: Date) => void
}
export default function ClearDatePopup({open, onOpen, onSuccess}: Props){
     const {t: msgTxt} = useTranslation("messages")
     const {t: validationTxt} = useTranslation("messages",{
          keyPrefix: "form-validations"
     })
     const {t} = useTranslation("history")
     const [isClearing, startTransition] = useTransition()
     const form = useForm<ClearByDateType>({
          resolver: zodResolver(getClearByDateSchema(validationTxt)),
          defaultValues: {
               date: new Date()
          }
     })
     const {t: confTxt} = useTranslation("confirmation");
     const {t: backendTxt} = useTranslation("backend-errors");
     const onSubmit = (values: ClearByDateType) => {
          if(isClearing) return;
          startTransition(async() => {
               try {
                    await invoke("clear_by_date", {
                         date: values.date.toISOString(),
                    });
                    toast.success(t("clear-messages.by-date"))
                    onSuccess(values.date)
                    onOpen(false);
                    form.reset();
               } catch (err) {
                    toast.error(msgTxt("history-clear-errror"),{
                         description: getErrorMessage(err,backendTxt)
                    })
               }
          })
     }
     return (
          <Popup
               open={open}
               onOpen={onOpen}
               title={t("clear-date.title")}
               description={t("clear-date.desc")}
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                              control={form.control}
                              name="date"
                              disabled={isClearing}
                              render={({field: {onChange, ...values}})=>(
                                   <FormItem>
                                        <FormLabel>{t("clear-date.date-label")}</FormLabel>
                                        <Suspense fallback={<Skeleton className="h-9 w-full"/>}>
                                             <FormControl>
                                                  <DatePickerInput
                                                       {...values}
                                                       onValueChange={val=>onChange(val)}
                                                  />
                                             </FormControl>
                                        </Suspense>
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