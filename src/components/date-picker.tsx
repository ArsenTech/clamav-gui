"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"

const isValidDate = (date: Date | undefined) => !date ? false : !isNaN(date.getTime())
const formatDate = (date: Date | undefined) => !date ? "" : format(date,"yyyy-MM-dd")

type DatePickerInputProps = Omit<React.ComponentProps<"input">,"value"|"onChange"> & {
     value: Date,
     onValueChange: (date: Date) => void,
}
export function DatePickerInput({value, onValueChange, ...props}: DatePickerInputProps) {
     const [open, setOpen] = React.useState(false)
     const [date, setDate] = React.useState<Date | undefined>(new Date("2026-06-01"))
     const [month, setMonth] = React.useState<Date | undefined>(date)
     const {t} = useTranslation()
     return (
          <InputGroup>
               <InputGroupInput
                    {...props}
                    value={formatDate(value)}
                    placeholder="01-06-2026"
                    onChange={(e) => {
                         const date = new Date(e.target.value)
                         onValueChange(date)
                         if (isValidDate(date)) {
                              setDate(date)
                              setMonth(date)
                         }
                    }}
                    onKeyDown={(e) => {
                         if (e.key === "ArrowDown") {
                              e.preventDefault()
                              setOpen(true)
                         }
                    }}
               />
               <InputGroupAddon align="inline-end">
                    <Popover open={open} onOpenChange={setOpen}>
                         <PopoverTrigger asChild>
                              <InputGroupButton
                                   id="date-picker"
                                   variant="ghost"
                                   size="icon-xs"
                                   aria-label={t("date-picker-label")}
                              >
                                   <CalendarIcon />
                                   <span className="sr-only">{t("date-picker-label")}</span>
                              </InputGroupButton>
                         </PopoverTrigger>
                         <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="end"
                              alignOffset={-8}
                              sideOffset={10}
                         >
                              <Calendar
                                   mode="single"
                                   selected={date}
                                   month={month}
                                   onMonthChange={setMonth}
                                   onSelect={(date) => {
                                        setDate(date)
                                        if(date) onValueChange(date)
                                        setOpen(false)
                                   }}
                              />
                         </PopoverContent>
                    </Popover>
               </InputGroupAddon>
          </InputGroup>
     )
}