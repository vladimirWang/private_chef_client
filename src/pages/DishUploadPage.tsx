import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { ImageUploader, type ImageUploadItem } from "antd-mobile";
import { BarChart3, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadFile } from "@/api/util";
import { createDish } from "@/api/dish";
import { extractHashtags } from "@/types/dish";

const PLACEHOLDER_COLOR = "#c4c4c4";
const CHIP_BG = "#f5f5f5";
const CHIP_TEXT = "#333";

const borderlessInputSx = {
  fontSize: 16,
  lineHeight: 1.5,
  "& input::placeholder, & textarea::placeholder": {
    color: PLACEHOLDER_COLOR,
    opacity: 1,
  },
};

function isUploadedUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

export default function DishUploadPage() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const tags = useMemo(() => extractHashtags(body), [body]);

  const uploadedUrls = useMemo(
    () => fileList.map((item) => item.url).filter(isUploadedUrl),
    [fileList],
  );

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    const res = await uploadFile(file);
    return {
      url: res.url,
      thumbnailUrl: URL.createObjectURL(file),
    };
  };

  const insertAtBody = (snippet: string) => {
    setBody((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const handlePublish = async () => {
    if (uploadedUrls.length === 0) {
      toast.error("请先添加并上传菜品图片");
      return;
    }
    const content = body.trim();
    if (!content) {
      toast.error("请填写正文");
      return;
    }

    setSubmitting(true);
    try {
      await createDish({
        image_urls: uploadedUrls,
        title: title.trim() || undefined,
        content,
      });
      navigate("/gallery");
    } catch {
      // 错误由 axios 拦截器提示
    } finally {
      setSubmitting(false);
    }
  };

  const canPublish =
    uploadedUrls.length > 0 && body.trim().length > 0 && !submitting;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        pb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 0.5,
          py: 0.75,
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="返回"
          sx={{ color: "#1a1a1a" }}
        >
          <ChevronLeft size={26} strokeWidth={1.75} />
        </IconButton>
        <button
          type="button"
          onClick={handlePublish}
          disabled={!canPublish}
          className={`border-0 bg-transparent px-3 py-1 text-base font-semibold ${
            canPublish
              ? "cursor-pointer text-[var(--adm-color-primary)]"
              : "cursor-default text-[#c4c4c4]"
          }`}
        >
          {submitting ? "发布中…" : "发布"}
        </button>
      </Box>

      <Box
        sx={{
          px: 2,
          pt: 0.5,
          pb: 2,
          "& .adm-image-uploader-cell": {
            width: 96,
            height: 96,
          },
        }}
      >
        <ImageUploader
          value={fileList}
          onChange={setFileList}
          upload={handleUpload}
          accept="image/*"
          multiple
          maxCount={9}
          onCountExceed={(exceed) => {
            toast.error(`最多上传 9 张，已超出 ${exceed} 张`);
          }}
        />
      </Box>

      <Box sx={{ px: 2, flex: 1 }}>
        <InputBase
          fullWidth
          placeholder="添加标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            ...borderlessInputSx,
            fontSize: 18,
            fontWeight: 500,
            mb: 1.5,
            "& .MuiInputBase-input": { p: 0 },
          }}
        />

        <InputBase
          fullWidth
          multiline
          minRows={6}
          placeholder="添加正文"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          sx={{
            ...borderlessInputSx,
            alignItems: "flex-start",
            "& .MuiInputBase-input": {
              p: 0,
              minHeight: 140,
            },
          }}
        />
      </Box>

      {tags.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            px: 2,
            pt: 1,
            pb: 2,
          }}
        >
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: CHIP_BG,
                color: CHIP_TEXT,
                fontSize: 14,
                height: 32,
                borderRadius: 2,
                "& .MuiChip-label": { px: 1.25 },
              }}
            />
          ))}
        </Box>
      ) : null}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          px: 2,
          pt: tags.length > 0 ? 0 : 2,
        }}
      >
        <ActionChip label="# 话题" onClick={() => insertAtBody("#")} />
        <ActionChip label="@ 用户" onClick={() => toast("暂未开放")} />
        <ActionChip
          icon={<BarChart3 size={16} color="#666" />}
          label="投票"
          onClick={() => toast("暂未开放")}
        />
      </Box>
    </Box>
  );
}

function ActionChip({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        border: "none",
        bgcolor: CHIP_BG,
        color: CHIP_TEXT,
        borderRadius: 2,
        px: 1.5,
        py: 0.875,
        fontSize: 14,
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      {icon}
      {label}
    </Box>
  );
}
