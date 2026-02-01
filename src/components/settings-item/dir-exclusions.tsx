import { useState } from "react";
import { Folder, Plus, Trash2, X } from "lucide-react";
import Popup from "@/components/popup";
import SettingsItem from ".";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { DirExclusionsType } from "@/lib/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DirExclusionsSchema } from "@/lib/schemas";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { open } from "@tauri-apps/plugin-dialog";

interface Props{
     data: string[];
     onSubmit: (values: DirExclusionsType) => void
     onDelete: (path: string) => void
}
export default function DirExclusionsItem({data, onSubmit, onDelete}: Props){
     const [isOpen, setIsOpen] = useState(false);
     const [isOpenDelete, setIsOpenDelete] = useState(false)
     const [currPath, setCurrPath] = useState("")
     const form = useForm<DirExclusionsType>({
          resolver: zodResolver(DirExclusionsSchema),
          defaultValues: {path: ""}
     })
     const handleSubmit = (values: DirExclusionsType) => {
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
     return (
          <>
          <SettingsItem
               Icon={Folder}
               title="Directory Exclusions"
               description="--exclude-dir"
               className="space-y-2.5"
               button={(
                    <Button variant="outline" onClick={()=>setIsOpen(true)}>
                         <Plus/>
                         Add an exclusion
                    </Button>
               )}
          >
               {data.length > 0 ? (
                    <ul className="space-y-2">
                         {data.map((exclusion,i)=>(
                              <li key={i+1} className="flex justify-between items-center gap-2 pb-1 border-b last:pb-0 last:border-none break-all">
                                   {exclusion}
                                   <Button variant="ghost" size="icon-lg" title="Remove" onClick={()=>{
                                        setIsOpenDelete(true);
                                        setCurrPath(exclusion)
                                   }}>
                                        <Trash2/>
                                   </Button>
                              </li>
                         ))}
                    </ul>
               ) : (
                    <p className="text-muted-foreground font-medium text-center mt-1">No Folder Exclusions yet</p>
               )}
          </SettingsItem>
          <Popup
               open={isOpen}
               onOpen={setIsOpen}
               title="Add a Directory to Exclusions"
               hideButtons
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                         <FormField
                              control={form.control}
                              name="path"
                              render={({field})=>(
                                   <FormItem >
                                        <FormLabel>Directory Path</FormLabel>
                                        <FormControl>
                                             <ButtonGroup className="w-full">
                                                  <Input {...field}/>
                                                  <Button type="button" onClick={handleBrowse}>Browse</Button>
                                             </ButtonGroup>
                                        </FormControl>
                                        <FormMessage/>
                                   </FormItem>
                              )}
                         />
                         <ButtonGroup>
                              <Button type="submit"><Plus/> Add</Button>
                              <Button type="reset" variant="secondary" onClick={()=>{
                                   setIsOpen(false)
                                   form.reset()
                              }}><X/> Close</Button>
                         </ButtonGroup>
                    </form>
               </Form>
          </Popup>
          <Popup
               open={isOpenDelete}
               onOpen={setIsOpenDelete}
               title="This will remove the directory path from exclusions"
               description="Continue?"
               submitTxt="Remove"
               closeText="Cancel"
               submitEvent={()=>{
                    setIsOpenDelete(false);
                    onDelete(currPath);
                    setCurrPath("")
               }}
          />
          </>
     )
}