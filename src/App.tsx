import { AppLayout } from "./components/layout";
import { Button } from "./components/ui/button";

export default function App() {
  return (
    <AppLayout>
      <div className="flex justify-center items-center gap-3 min-h-screen flex-col">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">Hello World!</h1>
        <Button>Click</Button>
      </div>
    </AppLayout>
  )
}