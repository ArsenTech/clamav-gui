import CommandSnippetBlock from "@/components/command-snippet";
import { KbdGroup, Kbd } from "@/components/ui/kbd";
import { useTranslation, Trans } from "react-i18next";

export default function LinuxAddPath(){
     const {t} = useTranslation("no-clamav-page");
     return (
          <div className="space-y-3">
               <p>{t("add-to-path.linux.cmd")}</p>
               <CommandSnippetBlock
                    command="which clamscan"
               />
               <p><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.linux.nano"
                    components={{
                         code: <code className="bg-accent text-accent-foreground px-1 py-0.5 rounded-sm"/>,
                         bold: <span className="font-semibold"/>
                    }}
               /></p>
               <CommandSnippetBlock
                    command="sudo nano ~/.bashrc"
               />
               <p><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.linux.snippet"
                    components={{
                         bold: <span className="font-semibold"/>
                    }}
               /></p>
               <CommandSnippetBlock
                    command='export PATH="$PATH:/path/to/clamav/bin"'
               />
               <p><Trans
                    ns="no-clamav-page"
                    i18nKey="add-to-path.linux.kbd-shortcut"
                    components={{
                         save: <KbdGroup>
                              <Kbd>Ctrl</Kbd>
                              <span>+</span>
                              <Kbd>S</Kbd>
                         </KbdGroup>,
                         exit: <KbdGroup>
                              <Kbd>Ctrl</Kbd>
                              <span>+</span>
                              <Kbd>X</Kbd>
                         </KbdGroup>
                    }}
               /></p>
               <CommandSnippetBlock
                    command='source ~/.bashrc'
               />
               <p>{t("add-to-path.linux.verification")}</p>
               <CommandSnippetBlock
                    command="clamscan --version"
               />
          </div>
     )
}