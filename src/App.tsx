import { AppLayout } from "./components/layout";
import { Button } from "./components/ui/button";

export default function App() {
  return (
    <AppLayout className="flex justify-center items-center gap-3 flex-col">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">Hello World!</h1>
      <Button>Click</Button>
    </AppLayout>
  )
}