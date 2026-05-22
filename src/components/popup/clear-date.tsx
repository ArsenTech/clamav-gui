import { useForm } from "react-hook-form";
import Popup from ".";
import { ClearByDateType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClearByDateSchema } from "@/lib/schemas";
import { useTranslation } from "react-i18next";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DatePickerInput } from "../date-picker";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Spinner } from "../ui/spinner";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/helpers";
import LoadingButton from "../loading-button";

interface Props{
     open: boolean,
     onOpen: (open: boolean) => void,
     onSuccess: (date: Date) => void
}
export default function ClearDatePopup({open, onOpen, onSuccess}: Props){
     const {t: msgTxt} = useTranslation("messages")
     const {t} = useTranslation("history")
     const [isClearing, startTransition] = useTransition()
     const form = useForm<ClearByDateType>({
          resolver: zodResolver(getClearByDateSchema(msgTxt)),
          defaultValues: {
               date: new Date()
          }
     })
     const {t: confTxt} = useTranslation("confirmation")
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
                         description: getErrorMessage(err)
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
                                        <ButtonGroup className="w-full">
                                             <FormControl>
                                                  <DatePickerInput
                                                       {...values}
                                                       onValueChange={val=>onChange(val)}
                                                  />
                                             </FormControl>
                                             <Button type="submit" variant="destructive" title="Clear" size="icon" disabled={isClearing || !form.formState.isValid}>
                                                  {isClearing ? <Spinner/> : <Trash2/>}
                                             </Button>
                                        </ButtonGroup>
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