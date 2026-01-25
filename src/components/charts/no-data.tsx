export function NoData({ label = "No Data yet" }: { label?: string }) {
     return (
          <p className="text-muted-foreground text-lg text-center font-medium py-12">
               {label}
          </p>
     )
}