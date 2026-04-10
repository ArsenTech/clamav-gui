import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props{
     open: boolean,
     onOpen: (open: boolean) => void,
     title: string,
     description?: string,
     children: React.ReactNode,
}
export default function Popup({open, onOpen, title, description, children}: Props){
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
               </DialogContent>
          </Dialog>
     )
}