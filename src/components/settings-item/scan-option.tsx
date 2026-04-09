import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ChoiceOptionProps{
     value: string,
     onValueChange: (val: string) => void,
     label: string,
     choiceKey: "sym-links" | "ssn-formats",
}
export function ChoiceOption({value,onValueChange,label,choiceKey}: ChoiceOptionProps){
     const {t} = useTranslation("scan-settings")
     const choices = t(`choices.${choiceKey}`,{returnObjects: true}).map((val,i)=>({
          value: i,
          label: val
     }))
     return (
          <Select
               value={value}
               onValueChange={onValueChange}
          >
               <SelectTrigger>
                    <SelectValue placeholder={label}/>
               </SelectTrigger>
               <SelectContent>
                    {choices.map(choice=>(
                         <SelectItem key={`${choice.label}-${choice.value}`} value={String(choice.value)}>{choice.label}</SelectItem>
                    ))}
               </SelectContent>
          </Select>
     )
}