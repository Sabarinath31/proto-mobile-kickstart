import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export const VoiceRecorder = ({ onSend, onCancel }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleSend = () => {
    stopRecording();
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    onSend(audioBlob);
    setDuration(0);
  };

  const handleCancel = () => {
    stopRecording();
    onCancel();
    setDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border-t bg-card p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="h-5 w-5 text-destructive" />
        </Button>

        <div className="flex-1 flex items-center gap-3">
          <div className={cn(
            "h-3 w-3 rounded-full bg-destructive",
            isRecording && "animate-pulse"
          )} />
          <span className="text-sm font-medium">{formatDuration(duration)}</span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse" style={{ width: "50%" }} />
          </div>
        </div>

        {!isRecording ? (
          <Button size="icon" onClick={startRecording} className="bg-primary">
            <Mic className="h-5 w-5" />
          </Button>
        ) : (
          <Button size="icon" onClick={handleSend} className="bg-accent">
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
