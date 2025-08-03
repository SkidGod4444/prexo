import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, RotateCcw, MoreHorizontal, Equal } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface DatabaseViewerProps {
  data?: ChatMessage[];
}

const mockData: ChatMessage[] = [
  { id: "1753431679715", role: "user", content: "hi" },
  {
    id: "msg-WHiAcpW9fbpIgLTS6iiEcOaU",
    role: "assistant",
    content: "Hello! How can I help you today?",
  },
  { id: "1753392099183", role: "user", content: "Am i audible?" },
  { id: "1753392050585", role: "user", content: "Hyy" },
  {
    id: "msg-hyj55MZbj64BGp5OEiEB2TyV",
    role: "assistant",
    content: "Yes, I can see your messages clearly! How can I assist you?",
  },
  { id: "1753378140546", role: "user", content: "Hello " },
  { id: "1753378117970", role: "user", content: "Who's ur owner?" },
  {
    id: "msg-mKZmX4hecmPKMLERTJGQuTsS",
    role: "assistant",
    content:
      "I'm Claude, an AI assistant created by Anthropic. How can I help you today?",
  },
  { id: "1753378094724", role: "user", content: "Hello " },
  {
    id: "msg-SlQOxVwGdqDQtrfnRkgj6i0i",
    role: "assistant",
    content: "Hello! I'm here to help. What would you like to know or discuss?",
  },
  { id: "1753290841278", role: "user", content: "" },
  { id: "1753290840111", role: "user", content: "" },
];

export const HistoryViewer: React.FC<DatabaseViewerProps> = ({
  data = mockData,
}) => {
  const [selectedKey, setSelectedKey] = React.useState(
    "prexo-chat-session/1234",
  );
  const [searchValue, setSearchValue] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const formatContent = (content: string, role: string) => {
    if (!content) return '""';
    const truncated =
      content.length > 50 ? content.substring(0, 50) + "..." : content;
    return `{"id":"...","role":"${role}","content":"${truncated}"}`;
  };

  const formatContentMobile = (content: string, role: string) => {
    if (!content) return '""';
    const truncated =
      content.length > 25 ? content.substring(0, 25) + "..." : content;
    return `{"role":"${role}","content":"${truncated}"}`;
  };

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="p-2 border-b border-viewer-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <Badge>1 History</Badge>
          <div className="flex">
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex w-full">
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Key List */}
      <div className="p-2">
        <div
          className="p-3 rounded-lg bg-viewer-item-selected border border-primary flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setSelectedKey("prexo-chat-session/1234");
            setDrawerOpen(isMobile || window.innerWidth <= 1024);
          }}
        >
          <div className="size-5 border rounded flex items-center justify-center">
            <Equal />
          </div>
          <span className="text-sm font-mono text-foreground break-all">
            prexo-chat-session/12349
          </span>
        </div>
      </div>
    </div>
  );

  const TableContent = () => (
    <>
      {/* Content Header */}
      <div className="bg-viewer-header-bg border-b border-viewer-row-border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <h2 className="font-mono text-sm sm:text-lg text-foreground truncate">
              {selectedKey}
            </h2>
          </div>
          <div className="flex">
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-6 mt-2 text-xs sm:text-sm text-muted-foreground">
          <span>
            Size: <span className="font-medium">34.25 KB</span>
          </span>
          <span>
            Length: <span className="font-medium">{data.length}</span>
          </span>
          <span>
            TTL: <span className="font-medium">2 months</span>
          </span>
        </div>
      </div>

      {/* Table Content */}
      <ScrollArea className="w-full h-full overflow-hidden">
        <div className="min-w-full px-2 space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex h-full w-full items-center border-b border-viewer-row-border hover:bg-viewer-item-hover group"
            >
              <div className="w-10 text-xs md:text-sm text-muted-foreground text-center">
                {index}
              </div>
              <div className="flex-1 p-2 md:p-4">
                <span className="text-sm text-foreground break-all font-sans">
                  <span className="hidden sm:inline">
                    {formatContent(item.content, item.role)}
                  </span>
                  <span className="sm:hidden">
                    {formatContentMobile(item.content, item.role)}
                  </span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive p-1 sm:p-2"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {/* Desktop Sidebar */}
        <div className="w-96 bg-viewer-sidebar-bg border-r border-dashed border-viewer-sidebar-border">
          <SidebarContent />
        </div>
        {/* Desktop Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TableContent />
        </div>
      </div>

      {/* Mobile Layout - Show sidebar content by default */}
      <div className="lg:hidden w-full h-full bg-viewer-sidebar-bg">
        <SidebarContent />
      </div>

      {/* Mobile Bottom Drawer for Table Content */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[80vh] p-0">
          <div className="h-full overflow-y-auto">
            <TableContent />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
