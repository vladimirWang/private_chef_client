import type { Message } from "@/types/chat";
import { User, Loader2, ChefHat } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { HOME_CARD_SHADOW } from "@/theme/homeChrome";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          maxWidth: "85%",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-start",
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            bgcolor: isUser ? "primary.dark" : "primary.main",
            boxShadow: HOME_CARD_SHADOW,
          }}
        >
          {message.loading || message.streaming ? (
            <Loader2 size={16} color="white" className="animate-spin" />
          ) : isUser ? (
            <User size={16} color="white" />
          ) : (
            <ChefHat size={16} color="white" />
          )}
        </Avatar>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1.5,
            ...(isUser
              ? {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }
              : {
                  bgcolor: "background.paper",
                  color: "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: HOME_CARD_SHADOW,
                }),
          }}
        >
          {message.imageUrl && (
            <Box
              component="img"
              src={message.imageUrl}
              alt="上传的图片"
              sx={{
                borderRadius: 2,
                mb: 1,
                maxWidth: 192,
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
          {isUser ? (
            <Typography
              component="div"
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
            >
              {typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content)}
            </Typography>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <Typography component="h1" variant="h6" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                    {children}
                  </Typography>
                ),
                h2: ({ children }) => (
                  <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                    {children}
                  </Typography>
                ),
                h3: ({ children }) => (
                  <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, mt: 1.5 }}>
                    {children}
                  </Typography>
                ),
                p: ({ children }) => (
                  <Typography component="p" variant="body2" sx={{ mb: 1, "&:last-child": { mb: 0 } }}>
                    {children}
                  </Typography>
                ),
                ul: ({ children }) => (
                  <Box component="ul" sx={{ pl: 2.5, mb: 1, listStyleType: "disc" }}>
                    {children}
                  </Box>
                ),
                ol: ({ children }) => (
                  <Box component="ol" sx={{ pl: 2.5, mb: 1, listStyleType: "decimal" }}>
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Typography component="li" variant="body2" sx={{ mb: 0.5, display: "list-item" }}>
                    {children}
                  </Typography>
                ),
                a: ({ href, children }) => (
                  <Typography
                    component="a"
                    variant="body2"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    {children}
                  </Typography>
                ),
                strong: ({ children }) => (
                  <Typography component="strong" variant="body2" sx={{ fontWeight: 600 }}>
                    {children}
                  </Typography>
                ),
                em: ({ children }) => (
                  <Typography component="em" variant="body2" sx={{ fontStyle: "italic" }}>
                    {children}
                  </Typography>
                ),
                code: ({ children }) => (
                  <Box
                    component="code"
                    sx={{
                      bgcolor: "action.hover",
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {children}
                  </Box>
                ),
                pre: ({ children }) => (
                  <Box
                    component="pre"
                    sx={{
                      bgcolor: "action.hover",
                      p: 1.5,
                      borderRadius: 2,
                      overflow: "auto",
                      mb: 1,
                      fontSize: "0.8125rem",
                    }}
                  >
                    {children}
                  </Box>
                ),
                blockquote: ({ children }) => (
                  <Box
                    component="blockquote"
                    sx={{
                      borderLeft: 4,
                      borderColor: "primary.light",
                      pl: 1.5,
                      fontStyle: "italic",
                      color: "text.secondary",
                      mb: 1,
                    }}
                  >
                    {children}
                  </Box>
                ),
                table: ({ children }) => (
                  <Box
                    component="table"
                    sx={{ width: "100%", borderCollapse: "collapse", mb: 1.5, fontSize: "0.875rem" }}
                  >
                    {children}
                  </Box>
                ),
                thead: ({ children }) => (
                  <Box component="thead" sx={{ bgcolor: "action.hover" }}>
                    {children}
                  </Box>
                ),
                tbody: ({ children }) => <Box component="tbody">{children}</Box>,
                tr: ({ children }) => (
                  <Box component="tr" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                    {children}
                  </Box>
                ),
                th: ({ children }) => (
                  <Box
                    component="th"
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      px: 1.5,
                      py: 1,
                      textAlign: "left",
                      fontWeight: 600,
                    }}
                  >
                    {children}
                  </Box>
                ),
                td: ({ children }) => (
                  <Box component="td" sx={{ border: "1px solid", borderColor: "divider", px: 1.5, py: 1 }}>
                    {children}
                  </Box>
                ),
              }}
            >
              {String(message.content || "")}
            </ReactMarkdown>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
