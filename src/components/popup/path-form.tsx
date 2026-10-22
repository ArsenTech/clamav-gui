import { FolderSearch, Plus, X } from "lucide-react";
import Popup from "@/components/popup";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { PathFormType } from "@/lib/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPathFormSchema } from "@/lib/schemas";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { useTranslation } from "react-i18next";

interface PathFormProps{
     open: boolean,
     onOpenChange: (open: boolean) => void,
     onSubmit: (values: PathFormType) => void,
     title: string;
}
export default function PathForm({open, onOpenChange, onSubmit, title}: PathFormProps){
     const {t} = useTranslation("settings",{
          keyPrefix: "folder-path-form"
     })
     const {t: validationMsg} = useTranslation("messages",{
          keyPrefix: "form-validations"
     })
     const form = useForm<PathFormType>({
          resolver: zodResolver(getPathFormSchema(validationMsg)),
          defaultValues: {path: ""}
     })
     const handleSubmit = (values: PathFormType) => {
          onOpenChange(false);
          onSubmit(values)
          form.reset()
     }
     const handleBrowse = async() => {
          const path = await openDialog({
               title: t("dialog-title"),
               multiple: false,
               directory: true
          });
          if(!path) return;
          form.setValue("path",path)
     }
     return (
          <Popup
               open={open}
               onOpen={onOpenChange}
               title={title}
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                         <FormField
                              control={form.control}
                              name="path"
                              render={({field})=>(
                                   <FormItem >
                                        <FormLabel>{t("path")}</FormLabel>
                                        <FormControl>
                                             <ButtonGroup className="w-full">
                                                  <Input {...field}/>
                                                  <Button type="button" onClick={handleBrowse}>
                                                       <FolderSearch/>
                                                       {t("browse")}
                                                  </Button>
                                             </ButtonGroup>
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <ButtonGroup>
                              <Button type="submit">
                                   <Plus/>
                                   {t("add")}
                              </Button>
                              <Button type="reset" variant="secondary" onClick={()=>{
                                   onOpenChange(false)
                                   form.reset()
                              }}>
                                   <X/>
                                   {t("close")}
                              </Button>
                         </ButtonGroup>
                    </form>
               </Form>
          </Popup>
     )
}