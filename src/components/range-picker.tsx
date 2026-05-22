"use client"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Noop } from "react-hook-form"

type RangePickerProps = {
     value?: DateRange
     onChange?: (range?: DateRange) => void,
     onBlur: Noop;
     disabled?: boolean;
     name: string;
}
export default function RangePicker({ value, onChange, onBlur, disabled }: RangePickerProps) {
     const { t } = useTranslation()
     return (
          <Popover>
               <PopoverTrigger asChild>
                    <Button
                         variant="outline"
                         className="w-full justify-between font-normal"
                         onBlur={onBlur}
                         disabled={disabled}
                    >
                         {value?.from && value?.to ? `${format(value.from, "PPP")} - ${format(value.to, "PPP")}` : t("date-picker-label")}
                         <ChevronDownIcon className="size-4 opacity-50" />
                    </Button>
               </PopoverTrigger>
               <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                    onBlur={onBlur}
               >
                    <Calendar
                         disabled={disabled}
                         mode="range"
                         selected={value}
                         onSelect={onChange}
                         numberOfMonths={2}
                    />
               </PopoverContent>
          </Popover>
     )
}