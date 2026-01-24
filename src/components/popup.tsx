import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface Props{
     open: boolean,
     onOpen: (open: boolean) => void,
     title: string,
     description?: string,
     submitTxt?: string
     submitEvent?: () => void,
     children?: React.ReactNode,
     closeText?: string
}
export default function Popup({open, onOpen, title, description, submitTxt = "Submit", submitEvent, children, closeText = "Close"}: Props){
     const isMobile = useIsMobile();
     return isMobile ? (
          <Drawer open={open} onOpenChange={onOpen}>
               <DrawerContent>
                    <DrawerHeader>
                         <DrawerTitle>{title}</DrawerTitle>
                         {description && (
                              <DrawerDescription>{description}</DrawerDescription>
                         )}
                    </DrawerHeader>
                    {children}
                    <DrawerFooter>
                         <Button type="button" onClick={submitEvent}>{submitTxt}</Button>
                         <DrawerClose asChild>
                              <Button variant="outline">{closeText}</Button>
                         </DrawerClose>
                    </DrawerFooter>
               </DrawerContent>
          </Drawer>
     ) : (
          <Dialog open={open} onOpenChange={onOpen}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>{title}</DialogTitle>
                         {description && (
                              <DialogDescription>{description}</DialogDescription>
                         )}
                    </DialogHeader>
                    {children}
                    <DialogFooter>
                         <Button variant={["delete","clear","remove"].some(val=>submitTxt.toLowerCase().includes(val)) ? "destructive" : "default"} type="button" onClick={submitEvent}>{submitTxt}</Button>
                         <DialogClose asChild>
                              <Button variant="outline">{closeText}</Button>
                         </DialogClose>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}