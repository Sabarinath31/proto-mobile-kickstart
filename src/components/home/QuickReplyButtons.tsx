import { Button } from "@/components/ui/button";

const quickReplies = [
  { text: "Hi", color: "bg-blue-100 hover:bg-blue-200 text-blue-700" },
  { text: "Okay", color: "bg-green-100 hover:bg-green-200 text-green-700" },
  { text: "Bye", color: "bg-purple-100 hover:bg-purple-200 text-purple-700" },
];

export const QuickReplyButtons = () => {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {quickReplies.map((reply) => (
        <Button
          key={reply.text}
          variant="ghost"
          className={`rounded-full px-6 py-2 ${reply.color} border-0 shadow-sm hover:shadow-md transition-all`}
        >
          {reply.text}
        </Button>
      ))}
    </div>
  );
};
