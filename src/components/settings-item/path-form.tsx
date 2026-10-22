import { lazy, Suspense, useState } from "react";
import { Folder, Plus, Trash2 } from "lucide-react";
import SettingsItem from ".";
import { Button } from "../ui/button";
import { PathFormType } from "@/lib/types/schemas";
import { useTranslation } from "react-i18next";
import AlertBox from "../popup/alert";

const PathForm = lazy(()=>import("../popup/path-form"));

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
     const {t: confirmMsg} = useTranslation("confirmation")
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
          <Suspense fallback={null}>
               <PathForm
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={formTitle}
                    onSubmit={onSubmit}
               />
          </Suspense>
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