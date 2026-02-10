import { useState } from "react";
import { Folder, Plus, Trash2, X } from "lucide-react";
import Popup from "@/components/popup";
import SettingsItem from ".";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { ExclusionsType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclusionsSchema } from "@/lib/schemas";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { open } from "@tauri-apps/plugin-dialog";
import { useTranslation } from "react-i18next";

interface Props{
     data: string[];
     onSubmit: (values: ExclusionsType) => void
     onDelete: (path: string) => void
}
export default function DirExclusionsItem({data, onSubmit, onDelete}: Props){
     const [isOpen, setIsOpen] = useState(false);
     const [isOpenDelete, setIsOpenDelete] = useState(false)
     const [currPath, setCurrPath] = useState("")
     const form = useForm<ExclusionsType>({
          resolver: zodResolver(ExclusionsSchema),
          defaultValues: {path: ""}
     })
     const handleSubmit = (values: ExclusionsType) => {
          setIsOpen(false);
          onSubmit(values)
          form.reset()
     }
     const handleBrowse = async() => {
          const path = await open({
               multiple: false,
               directory: true
          });
          if(!path) return;
          form.setValue("path",path)
     }
     const {t} = useTranslation("settings")
     return (
          <>
          <SettingsItem
               Icon={Folder}
               title={t("exclusions.title")}
               description="--exclude-dir"
               className="space-y-2.5"
               button={(
                    <Button variant="outline" onClick={()=>setIsOpen(true)}>
                         <Plus/>
                         {t("exclusions.add-button")}
                    </Button>
               )}
          >
               {data.length > 0 ? (
                    <ul className="space-y-2">
                         {data.map((exclusion,i)=>(
                              <li key={i+1} className="flex justify-between items-center gap-2 pb-1 border-b last:pb-0 last:border-none break-all">
                                   {exclusion}
                                   <Button variant="ghost" size="icon-lg" title={t("exclusions.confirmation.remove")} onClick={()=>{
                                        setIsOpenDelete(true);
                                        setCurrPath(exclusion)
                                   }}>
                                        <Trash2/>
                                   </Button>
                              </li>
                         ))}
                    </ul>
               ) : (
                    <p className="text-muted-foreground font-medium text-center mt-1">{t("exclusions.no-exclusions")}</p>
               )}
          </SettingsItem>
          <Popup
               open={isOpen}
               onOpen={setIsOpen}
               title={t("exclusions.form.title")}
               hideButtons
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                         <FormField
                              control={form.control}
                              name="path"
                              render={({field})=>(
                                   <FormItem >
                                        <FormLabel>{t("exclusions.form.path")}</FormLabel>
                                        <FormControl>
                                             <ButtonGroup className="w-full">
                                                  <Input {...field}/>
                                                  <Button type="button" onClick={handleBrowse}>{t("exclusions.form.browse")}</Button>
                                             </ButtonGroup>
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <ButtonGroup>
                              <Button type="submit">
                                   <Plus/>
                                   {t("exclusions.form.add")}
                              </Button>
                              <Button type="reset" variant="secondary" onClick={()=>{
                                   setIsOpen(false)
                                   form.reset()
                              }}>
                                   <X/>
                                   {t("exclusions.form.close")}
                              </Button>
                         </ButtonGroup>
                    </form>
               </Form>
          </Popup>
          <Popup
               open={isOpenDelete}
               onOpen={setIsOpenDelete}
               title={t("exclusions.confirmation.title")}
               description={t("exclusions.confirmation.desc")}
               submitTxt={t("exclusions.confirmation.remove")}
               closeText={t("exclusions.confirmation.cancel")}
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