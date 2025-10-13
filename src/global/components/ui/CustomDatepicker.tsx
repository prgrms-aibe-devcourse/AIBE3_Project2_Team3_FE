"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

import { CalendarIcon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function CustomDatepicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  minDate,
  maxDate,
}: {
  value: Date;
  onChange: (d: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}) {
  const [open, setOpen] = useState(false);

  const disabledMatchers = [
    ...(minDate ? [{ before: strip(minDate) }] : []),
    ...(maxDate ? [{ after: strip(maxDate) }] : []),
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarIcon className="mr-2 size-4" />
          {value
            ? format(value, "yyyy-MM-dd (EEE)", { locale: ko })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            if (!d) return;
            onChange(d);
            setOpen(false);
          }}
          disabled={disabledMatchers}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function strip(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
