import { IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { Image, X } from "lucide-react";
import { readAsDataURL } from "@/utils/common";

interface UploaderProps {
  disabled?: boolean;
  handleFileChange: (file: File) => void;
  accept?: string;
}
export default function Uploader({
  disabled,
  accept,
  handleFileChange,
}: UploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<null | File>(null);
    const [filename, setFilename] = useState<string | null>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    console.log("----selectedFile:---- ", selectedFile.type) 
    setFile(selectedFile);
    handleFileChange(selectedFile);
    if (accept?.startsWith("image/")) {
        const base64 = await readAsDataURL(selectedFile);
        setPreviewUrl(base64);
    } else {
        setFilename(selectedFile.name);
    }

  };
  return (
    <>
      <section style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {file && previewUrl ? (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            sx={{
              width: 52,
              height: 52,
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
            onClick={() => setFile(null)}
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              bgcolor: "error.main",
              color: "error.contrastText",
              width: 20,
              height: 20,
              "&:hover": { bgcolor: "error.dark" },
            }}
            aria-label="移除图片"
          >
            <X size={14} />
          </IconButton>
        </Box>
      ) : null}
      {file && filename ? <span>{filename}</span>: null}
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
      </section>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept={accept}
        hidden
        disabled={disabled}
      />
    </>
  );
}
