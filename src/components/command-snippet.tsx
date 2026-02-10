import { CheckCircle, Copy } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props{
     command: string
}
export default function CommandSnippetBlock({command}: Props){
     const [isCopied, setIsCopied] = useState(false);
     const {t} = useTranslation();
     const {t: messageTxt} = useTranslation("messages")
     const handleCopy = async () => {
          try{
               await window.navigator.clipboard.writeText(command);
               toast.success(messageTxt("copy-command.success"))
               setIsCopied(true);
               setTimeout(()=>setIsCopied(false),2000)
          } catch (err) {
               toast.error(messageTxt("copy-command.error"),{
                    description: String(err)
               });
          }
     }
     return (
          <div className="relative">
               <Button variant="ghost" size="icon" title={t("copy-command")} className="absolute top-1/2 right-5 z-20 -translate-y-1/2" onClick={handleCopy} disabled={isCopied}>
                    {isCopied ? <CheckCircle/> : <Copy/>}
               </Button>
               <pre className="bg-accent text-accent-foreground text-left p-4 rounded-md whitespace-pre-wrap">
                    <code className="inline-block mr-8">{command}</code>
               </pre>
          </div>
     )
}