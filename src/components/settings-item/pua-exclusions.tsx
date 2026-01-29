import { Plus, ShieldOff, Trash2, X } from "lucide-react";
import Popup from "@/components/popup";
import SettingsItem from ".";
import { Button } from "../ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PuaExclusionsType } from "@/lib/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PuaExclusionsSchema } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ButtonGroup } from "../ui/button-group";

interface Props{
     data: string[],
     onSubmit: (values: PuaExclusionsType) => void
     onDelete: (category: string) => void
}
export default function PuaExclusionsItem({data, onSubmit, onDelete}: Props){
     const [isOpen, setIsOpen] = useState(false);
     const [isOpenDelete, setIsOpenDelete] = useState(false);
     const [currCategory, setCurrCategory] = useState("")
     const form = useForm<PuaExclusionsType>({
          resolver: zodResolver(PuaExclusionsSchema),
          defaultValues: {category: ""}
     })
     const handleSubmit = (values: PuaExclusionsType) => {
          setIsOpen(false);
          onSubmit(values)
          form.reset()
     }
     return (
          <>
          <SettingsItem
               Icon={ShieldOff}
               title="PUA Exclusions"
               description="--exclude-pua"
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
                                        setCurrCategory(exclusion)
                                   }}>
                                        <Trash2/>
                                   </Button>
                              </li>
                         ))}
                    </ul>
               ) : (
                    <p className="text-muted-foreground font-medium text-center mt-1">No PUA Category Exclusions yet</p>
               )}
          </SettingsItem>
          <Popup
               open={isOpen}
               onOpen={setIsOpen}
               title="Add a PUA Category to Exclusions"
               hideButtons
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                         <FormField
                              control={form.control}
                              name="category"
                              render={({field})=>(
                                   <FormItem >
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                             <Input {...field}/>
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
               title="This will remove the PUA category from exclusions"
               description="Continue?"
               submitTxt="Remove"
               closeText="Cancel"
               submitEvent={()=>{
                    setIsOpenDelete(false);
                    onDelete(currCategory);
                    setCurrCategory("")
               }}
          />
          </>
     )
}