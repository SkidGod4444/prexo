import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConvoPanel() {
  return (
    <div className='flex flex-col h-full w-full'>
     <ScrollArea>
      <div className='p-2'>
        {/* Conversation list goes here */}
        <p className="text-muted-foreground">Conversation Panel Content</p>
      </div>
     </ScrollArea>
    </div>
  )
}
