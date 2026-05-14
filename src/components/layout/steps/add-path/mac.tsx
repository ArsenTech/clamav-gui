import CommandSnippetBlock from "@/components/command-snippet";
import { useTranslation, Trans } from "react-i18next";

export default function MacOSAddPath(){
     const {t} = useTranslation("no-clamav-page");
     return (
          <div className="space-y-3">
               <p>{t("add-to-path.macos.info")}</p>
               <CommandSnippetBlock
                    command="which clamscan"
               />
               <p>
                    <Trans
                         ns="no-clamav-page"
                         i18nKey="add-to-path.macos.symlink-info"
                         components={{
                              code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>
                         }}
                    />
               </p>
               <CommandSnippetBlock
                    command="sudo ln -s /opt/homebrew/bin/clamscan /usr/local/bin/clamscan"
               />
               <CommandSnippetBlock
                    command="sudo ln -s /usr/local/bin/clamscan /usr/bin/clamscan"
               />
               <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-sm"><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.macos.min-requirement"
                    components={{
                         bold: <span className="font-semibold"/>
                    }}
               /></p>
          </div>
     )
}