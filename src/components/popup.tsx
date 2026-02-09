import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { DesignType } from "@/lib/types";

interface Props{
     open: boolean,
     onOpen: (open: boolean) => void,
     title: string,
     description?: string,
     submitTxt?: string
     submitEvent?: () => void,
     children?: React.ReactNode,
     closeText?: string
     hideButtons?: boolean,
     type?: DesignType
}
export default function Popup({open, onOpen, title, description, submitTxt = "Submit", submitEvent, children, closeText = "Close", hideButtons=false, type="default"}: Props){
     const isMobile = useIsMobile();
     return isMobile ? (
          <Drawer open={open} onOpenChange={onOpen}>
               <DrawerContent>
                    <DrawerHeader>
                         <DrawerTitle className="leading-tight">{title}</DrawerTitle>
                         {description && (
                              <DrawerDescription>{description}</DrawerDescription>
                         )}
                    </DrawerHeader>
                    {!!children && (
                         <div className="p-6">
                              {children}
                         </div>
                    )}
                    {!hideButtons &&(
                         <DrawerFooter>
                              <Button type="button" onClick={submitEvent}>{submitTxt}</Button>
                              <DrawerClose asChild>
                                   <Button variant="outline" type="button">{closeText}</Button>
                              </DrawerClose>
                         </DrawerFooter>
                    )}
               </DrawerContent>
          </Drawer>
     ) : (
          <Dialog open={open} onOpenChange={onOpen}>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle className="leading-tight">{title}</DialogTitle>
                         {description && (
                              <DialogDescription>{description}</DialogDescription>
                         )}
                    </DialogHeader>
                    {children}
                    {!hideButtons && (
                         <DialogFooter>
                              <Button variant={type==="danger" ? "destructive" : "default"} type="button" onClick={submitEvent}>{submitTxt}</Button>
                              <DialogClose asChild>
                                   <Button variant="outline" type="button">{closeText}</Button>
                              </DialogClose>
                         </DialogFooter>
                    )}
               </DialogContent>
          </Dialog>
     )
}