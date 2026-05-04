import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Image, Send, X } from "lucide-react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { readAsDataURL } from "@/utils/common";

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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    console.log("----selectedFile:---- ", selectedFile)
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const base64 = await readAsDataURL(selectedFile);
      setPreviewUrl(base64);
      // const imageUrl = URL.createObjectURL(selectedFile);
      // setPreviewUrl(imageUrl);
      // URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper" }}>
      {file && previewUrl ? (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
              sx={{
                width: 96,
                height: 96,
                flexShrink: 0,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="预览缩略图"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
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
