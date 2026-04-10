import { useState } from "react";
import { Folder, FolderSearch, Plus, Trash2, X } from "lucide-react";
import Popup from "@/components/popup";
import SettingsItem from ".";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { PathFormType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPathFormSchema } from "@/lib/schemas";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { open } from "@tauri-apps/plugin-dialog";
import { useTranslation } from "react-i18next";
import AlertBox from "../popup/alert";

interface Props{
     data: string[];
     title: string;
     addButtonText: string;
     confirmationTitle: string
     emptyText: string;
     formTitle: string;
     description?: string
     onSubmit: (values: PathFormType) => void
     onDelete: (path: string) => void
}
export default function FolderPathForm({data, onSubmit, onDelete, title, addButtonText, confirmationTitle, emptyText, formTitle, description}: Props){
     const [isOpen, setIsOpen] = useState(false);
     const [isOpenDelete, setIsOpenDelete] = useState(false)
     const [currPath, setCurrPath] = useState("")
     const {t} = useTranslation("settings")
     const {t: validationMsg} = useTranslation("messages")
     const {t: confirmMsg} = useTranslation("confirmation")
     const form = useForm<PathFormType>({
          resolver: zodResolver(getPathFormSchema(validationMsg)),
          defaultValues: {path: ""}
     })
     const handleSubmit = (values: PathFormType) => {
          setIsOpen(false);
          onSubmit(values)
          form.reset()
     }
     const handleBrowse = async() => {
          const path = await open({
               title: t("folder-path-form.dialog-title"),
               multiple: false,
               directory: true
          });
          if(!path) return;
          form.setValue("path",path)
     }
     return (
          <>
          <SettingsItem
               Icon={Folder}
               title={title}
               description={description}
               className="space-y-2.5"
               button={(
                    <Button variant="outline" onClick={()=>setIsOpen(true)}>
                         <Plus/>
                         {addButtonText}
                    </Button>
               )}
          >
               {data.length > 0 ? (
                    <ul className="space-y-2">
                         {data.map((path,i)=>(
                              <li key={i+1} className="flex justify-between items-center gap-2 pb-1 border-b last:pb-0 last:border-none break-all">
                                   {path}
                                   <Button variant="ghost" size="icon-lg" title={confirmMsg("actions.remove")} onClick={()=>{
                                        setIsOpenDelete(true);
                                        setCurrPath(path)
                                   }}>
                                        <Trash2/>
                                   </Button>
                              </li>
                         ))}
                    </ul>
               ) : (
                    <p className="text-muted-foreground font-medium text-center mt-1">{emptyText}</p>
               )}
          </SettingsItem>
          <Popup
               open={isOpen}
               onOpen={setIsOpen}
               title={formTitle}
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                         <FormField
                              control={form.control}
                              name="path"
                              render={({field})=>(
                                   <FormItem >
                                        <FormLabel>{t("folder-path-form.path")}</FormLabel>
                                        <FormControl>
                                             <ButtonGroup className="w-full">
                                                  <Input {...field}/>
                                                  <Button type="button" onClick={handleBrowse}>
                                                       <FolderSearch/>
                                                       {t("folder-path-form.browse")}
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
                                   {t("folder-path-form.add")}
                              </Button>
                              <Button type="reset" variant="secondary" onClick={()=>{
                                   setIsOpen(false)
                                   form.reset()
                              }}>
                                   <X/>
                                   {t("folder-path-form.close")}
                              </Button>
                         </ButtonGroup>
                    </form>
               </Form>
          </Popup>
          <AlertBox
               open={isOpenDelete}
               setOpen={setIsOpenDelete}
               title={confirmationTitle}
               description={confirmMsg("folder-path-form-desc")}
               submitText={confirmMsg("actions.remove")}
               cancelText={confirmMsg("actions.cancel")}
               submitEvent={()=>{
                    setIsOpenDelete(false);
                    onDelete(currPath);
                    setCurrPath("")
               }}
               type="danger"
          />
          </>
     )
}