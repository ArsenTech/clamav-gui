interface Props{
     label: string
}
export function NoData({ label }: Props) {
     return (
          <p className="text-muted-foreground text-lg text-center font-medium py-12">
               {label}
          </p>
     )
}