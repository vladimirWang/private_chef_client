import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import homeClothing from "@/assets/home-clothing.jpg";
import { homeCardSurfaceSx, pageShellSx } from "@/theme/homeChrome";
import Uploader from "@/components/uploader/Uploader";
import { useState } from "react";
import { uploadFile } from "@/api/util";
import { updateKnowledgeBase, consultKnowledgeBase } from "@/api/clothing";
import { TextField } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export default function ClothingPage() {
  const [file, setFile] = useState<null | File>(null);
  const [filepath, setFilepath] = useState<null | string>(null);
  const [question, setQuestion] = useState<null | string>("我体重160斤，尺码推荐");

  const [result, setResult] = useState<null | string>(null);
  const handleUpload = async () => {
    if (!file) return;
    try {
      const uploadResponse = await uploadFile(file);
      console.log("uploadResponse: ", uploadResponse);
      const imageUrl = uploadResponse.url;
      console.log("imageUrl 0: ", imageUrl);
      setFilepath(imageUrl);
      enqueueSnackbar("上传成功", {
        variant: "error",
        preventDuplicate: true,
      });
    } catch (error) {
      console.error("图片上传失败:", error);
      return;
    }
  };

  const onSubmitKnowledgeBase = async() => {
    console.log("----onSubmitKnowledgeBase:---- ", filepath)
    if (!filepath) return;
    try {
      const updateResponse = await updateKnowledgeBase({filepath: filepath});
      console.log("updateResponse: ", updateResponse);
      // setResult(updateResponse.data);
      enqueueSnackbar("更新成功", {
        variant: "error",
        preventDuplicate: true,
      });
    } catch (error) {
      console.error("上传更新到知识库失败:", error);
      return;
    }
  }

  const [questionLoading, setQuestionLoading] = useState(false);

  const onConsult = async() => {
    console.log("----onConsult:---- ", question)
    if (!question) return;
    setQuestionLoading(true)
    try {
      
      const consultResponse = await consultKnowledgeBase({question: '我体重178斤，尺码推荐'});
      console.log("consultResponse: ", consultResponse);
      setResult(consultResponse.data);
    } catch (error) {
      console.error("咨询失败:", error);
    } finally {
      setQuestionLoading(false)
    }
  };

  return (
    <Box
      sx={{
        ...pageShellSx,
        px: 2,
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Uploader disabled={false} handleFileChange={setFile} accept="text/plain"/>
      <Button onClick={handleUpload} disabled={!file}>
        上传文件
      </Button>
      <Button onClick={onSubmitKnowledgeBase} disabled={!filepath}>
        上传更新到知识库
      </Button>

      <TextField id="outlined-basic" label="Outlined" variant="outlined" value={question} onChange={(e) => setQuestion(e.target.value)}/>
      <Button onClick={onConsult} disabled={!question} loading={questionLoading}>
        咨询
      </Button>
      <Typography variant="body1">{result}</Typography>
    </Box>
  );
}