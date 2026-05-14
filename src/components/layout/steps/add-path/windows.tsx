import CommandSnippetBlock from "@/components/command-snippet"
import { useTranslation, Trans } from "react-i18next"

export default function WindowsAddPath(){
     const {t} = useTranslation("no-clamav-page");
     const windowsSteps = t("add-to-path.windows.steps",{returnObjects: true})
     return (
          <div className="space-y-3">
               <p>{t("add-to-path.windows.cmd")}</p>
               <CommandSnippetBlock
                    command="where clamscan"
               />
               <p><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.windows.if-returns-path"
                    components={{
                         code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>
                    }}
               /></p>
               <ol className="list-decimal text-left self-start space-y-2 px-8">
                    {windowsSteps.map((step,i)=>(
                         <li key={`step-${i+1}`}>
                              <Trans
                                   components={{
                                        code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>,
                                        bold: <span className="font-semibold"/>
                                   }}
                              >
                                   {step}
                              </Trans>
                         </li>
                    ))}
               </ol>
               <p>{t("add-to-path.windows.verification")}</p>
               <CommandSnippetBlock
                    command="clamscan --version"
               />
          </div>
     )
}