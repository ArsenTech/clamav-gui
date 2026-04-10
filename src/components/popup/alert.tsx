import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { DesignType } from "@/lib/types";

interface Props{
     open: boolean,
     setOpen: (open: boolean) => void,
     title: string,
     description?: string,
     submitText?: string
     submitEvent: () => void,
     cancelText?: string
     type?: DesignType
}
export default function AlertBox({open, setOpen, title, description, type = "default", submitEvent, submitText = "Confirm", cancelText = "Cancel"}: Props){
     return (
          <AlertDialog open={open} onOpenChange={setOpen}>
               <AlertDialogContent>
                    <AlertDialogHeader>
                         <AlertDialogTitle>{title}</AlertDialogTitle>
                         {description && (
                              <AlertDialogDescription>{description}</AlertDialogDescription>
                         )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogAction onClick={submitEvent} variant={type==="danger" ? "destructive" : "default"}>
                              {submitText}
                         </AlertDialogAction>
                         <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}