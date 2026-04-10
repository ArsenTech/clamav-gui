import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo } from "react";

interface Props{
     cols: number,
     rows: number,
     actionsAtStart?: boolean,
     actionsAtEnd?: boolean
}
export default function TableLoader({cols, rows, actionsAtEnd=false,actionsAtStart=false}: Props){
     const colsArr = useMemo(()=>Array.from({length: cols}).map((_,i)=>i),[cols]);
     const rowsArr = useMemo(()=>Array.from({length: rows}).map((_,i)=>i),[rows]);
     return (
          <>
          <Table>
               <TableHeader>
                    <TableRow>
                         {actionsAtStart && (
                              <TableHead/>
                         )}
                         {colsArr.map((_,col)=>(
                              <TableHead key={`col-${col+1}`}>
                                   <Skeleton className="h-4 w-full" aria-label={`col-${col+1}`}/>
                              </TableHead>
                         ))}
                         {actionsAtEnd && (
                              <TableHead/>
                         )}
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {rowsArr.map(row=>(
                         <TableRow key={`row-${row+1}`}>
                              {actionsAtStart && (
                                   <TableCell className="w-9">
                                        <Skeleton className="size-9"/>
                                   </TableCell>
                              )}
                              {Array.from({length: cols}).map((_,col)=>(
                                   <TableCell key={`cell-${row+1}-${col+1}`}>
                                        <Skeleton className="h-4 w-full" aria-label={`cell-${row+1}-${col+1}`}/>
                                   </TableCell>
                              ))}
                              {actionsAtEnd && (
                                   <TableCell className="w-9">
                                        <Skeleton className="size-9"/>
                                   </TableCell>
                              )}
                         </TableRow>
                    ))}
               </TableBody>
          </Table>
          <div className="flex items-center justify-between px-2 w-full">
               <div className="w-full">
                    <Skeleton className="h-4 w-1/3"/>
               </div>
               <div className="flex items-center gap-x-6 lg:gap-x-8">
                    <div className="flex items-center gap-x-2">
                         <Skeleton className="h-3.5 w-24"/>
                         <Skeleton className="h-9 w-[70px]"/>
                    </div>
                    <Skeleton className="w-[100px] h-4"/>
                    <div className="flex items-center gap-x-2">
                         <Skeleton className="size-8"/>
                         <Skeleton className="size-8"/>
                         <Skeleton className="size-8"/>
                         <Skeleton className="size-8"/>
                    </div>
               </div>
          </div>
          </>
     )
}