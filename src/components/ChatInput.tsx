import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import { Image, Send, X } from "lucide-react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

interface ChatInputProps {
  onSend: (text: string, file?: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (!file) {
  //     setPreviewUrl(null);
  //     return undefined;
  //   }
  //   const url = URL.createObjectURL(file);
  //   setPreviewUrl(url);
  //   return () => URL.revokeObjectURL(url);
  // }, [file]);

  const handleSend = () => {
    if (text.trim() || file) {
      onSend(text.trim(), file);
      setText("");
      setFile(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper" }}>
      {file && previewUrl ? (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
              component="img"
              src={previewUrl}
              alt="预览"
              sx={{
                maxWidth: 96,
                maxHeight: 96,
                borderRadius: 2,
                objectFit: "cover",
                display: "block",
              }}
            />
            <IconButton
              type="button"
              size="small"
              onClick={() => setFile(undefined)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "error.main",
                color: "error.contrastText",
                width: 28,
                height: 28,
                "&:hover": { bgcolor: "error.dark" },
              }}
              aria-label="移除图片"
            >
              <X size={14} />
            </IconButton>
          </Box>
        </Box>
      ) : null}
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
        <IconButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover", color: "primary.main" },
          }}
          aria-label="上传图片"
        >
          <Image size={20} />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          hidden
          disabled={disabled}
        />
        <TextField
          multiline
          minRows={1}
          maxRows={6}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="描述你有的食材..."
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
              "&.Mui-focused": { bgcolor: "background.paper" },
            },
          }}
        />
        <IconButton
          type="button"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !file)}
          color="primary"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2,
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
          aria-label="发送"
        >
          <Send size={20} />
        </IconButton>
      </Box>
    </Box>
  );
}
