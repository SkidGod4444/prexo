"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatListCard, { type ChatListCardProps } from "./convo.list.card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mockChats: (ChatListCardProps & { id: number })[] = [
  // Add one of isEscalated, isResolved, isUnResolved to each conversation randomly
  {
    id: 1,
    name: "Micky Doe",
    avatar:
      "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Christopher",
    flag: "🇺🇸",
    message: "I'm here to help you! What ca...",
    timestamp: "less than a minute",
    isEscalated: true,
  },
  {
    id: 2,
    name: "Amanda Doe",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Amaya",
    flag: "🇩🇰",
    message: "Conversation resolved",
    timestamp: "2 minutes",
    isResolved: true,
  },
  {
    id: 3,
    name: "John Smith",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Aiden",
    flag: "🇬🇧",
    message: "Thank you for your quick response.",
    timestamp: "5 minutes",
    isUnResolved: true,
  },
  {
    id: 4,
    name: "Emily Zhang",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Jessica",
    flag: "🇨🇳",
    message: "Can you help me with my order?",
    timestamp: "8 minutes",
    isEscalated: true,
  },
  {
    id: 5,
    name: "Carlos Ruiz",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Luis",
    flag: "🇪🇸",
    message: "Gracias por la información.",
    timestamp: "10 minutes",
    isResolved: true,
  },
  {
    id: 6,
    name: "Sophia Müller",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sarah",
    flag: "🇩🇪",
    message: "Bitte senden Sie mir Details.",
    timestamp: "12 minutes",
    isUnResolved: true,
  },
  {
    id: 7,
    name: "Liam Nguyen",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Leo",
    flag: "🇻🇳",
    message: "I'll get back to you shortly.",
    timestamp: "15 minutes",
    isEscalated: true,
  },
  {
    id: 8,
    name: "Zara Patel",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Destiny",
    flag: "🇮🇳",
    message: "Got it, thank you!",
    timestamp: "19 minutes",
    isResolved: true,
  },
  {
    id: 9,
    name: "Oliver Kwon",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Oliver",
    flag: "🇰🇷",
    message: "Is my shipment on the way?",
    timestamp: "22 minutes",
    isUnResolved: true,
  },
  {
    id: 10,
    name: "Emma Dubois",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Ryker",
    flag: "🇫🇷",
    message: "Merci pour votre aide.",
    timestamp: "25 minutes",
    isEscalated: true,
  },
  {
    id: 11,
    name: "Ivan Sokolov",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Alexander",
    flag: "🇷🇺",
    message: "Пожалуйста, уточните детали.",
    timestamp: "28 minutes",
    isResolved: true,
  },
  {
    id: 12,
    name: "Sofia Rossi",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jessica",
    flag: "🇮🇹",
    message: "Ti risponderò al più presto.",
    timestamp: "30 minutes",
    isUnResolved: true,
  },
  {
    id: 13,
    name: "Lucas Silva",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Christopher",
    flag: "🇧🇷",
    message: "Obrigado pela sua atenção.",
    timestamp: "33 minutes",
    isEscalated: true,
  },
  {
    id: 14,
    name: "Anna Johansson",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Amaya",
    flag: "🇸🇪",
    message: "Kan du hjälpa mig idag?",
    timestamp: "35 minutes",
    isResolved: true,
  },
  {
    id: 15,
    name: "David Kim",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Leo",
    flag: "🇰🇷",
    message: "Let's confirm the details.",
    timestamp: "39 minutes",
    isUnResolved: true,
  },
  {
    id: 16,
    name: "Isabella García",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Luis",
    flag: "🇲🇽",
    message: "¿Tienes más información?",
    timestamp: "41 minutes",
    isEscalated: true,
  },
  {
    id: 17,
    name: "Noah Lee",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Aiden",
    flag: "🇸🇬",
    message: "See you on our call soon.",
    timestamp: "45 minutes",
    isResolved: true,
  },
  {
    id: 18,
    name: "Mia Novak",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sarah",
    flag: "🇭🇷",
    message: "Možete li mi pomoći?",
    timestamp: "50 minutes",
    isUnResolved: true,
  },
  {
    id: 19,
    name: "William Evans",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Ryker",
    flag: "🇦🇺",
    message: "Thanks mate, appreciated.",
    timestamp: "52 minutes",
    isEscalated: true,
  },
  {
    id: 20,
    name: "Chloe Martin",
    avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Oliver",
    flag: "🇨🇦",
    message: "Looking forward to your reply.",
    timestamp: "1 hour",
    isResolved: true,
  },
];

export default function ConvoPanel() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const chatBasePath = segments.slice(0, 6).join("/");

  // /orgs/prexo-ai/apps/1/chats (dynamic app slug)
  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea>
        <div className="space-y-1">
          {mockChats.map((chat) => (
            <Link
              href={`${chatBasePath}/${chat.id}`}
              key={chat.id}
              className="block"
            >
              <ChatListCard {...chat} />
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
