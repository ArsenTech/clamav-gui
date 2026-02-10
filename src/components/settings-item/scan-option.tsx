import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TFunction } from "i18next";

interface ChoiceOptionProps{
     value: string,
     onValueChange: (val: string) => void,
     label: string,
     choiceKey: "sym-links" | "ssn-formats",
     scanTxt: TFunction<"scan-settings">,
}
export function ChoiceOption({value,onValueChange,label,choiceKey,scanTxt}: ChoiceOptionProps){
     const choices = scanTxt(`choices.${choiceKey}`,{returnObjects: true}).map((val,i)=>({
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
                         <SelectItem value={String(choice.value)}>{choice.label}</SelectItem>
                    ))}
               </SelectContent>
          </Select>
     )
}