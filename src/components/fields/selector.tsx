import { Noop } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectType } from "@/lib/types";

interface SelectorFieldProps{
     onChange: (value: string) => void;
     onBlur?: Noop;
     value: string;
     disabled?: boolean;
     name?: string;
     invalid?: boolean,
     items: SelectType[],
     placeholder?: string,
     defaultValue?: string
}
export default function SelectorField({name, value, onChange, invalid, disabled, onBlur, items, defaultValue, placeholder="Select"}: SelectorFieldProps){
     return (
          <Select
               name={name}
               value={value}
               onValueChange={onChange}
               disabled={disabled}
               defaultValue={defaultValue}
          >
               <SelectTrigger
                    id={name}
                    name={name}
                    aria-invalid={invalid}
                    className="min-w-30"
                    onBlur={onBlur}
               >
                    <SelectValue placeholder={placeholder} />
               </SelectTrigger>
               <SelectContent position="item-aligned">
                    {items.map(item => (
                         <SelectItem key={item.value} value={item.value}>
                              {item.label}
                         </SelectItem>
                    ))}
               </SelectContent>
          </Select>
     )
}