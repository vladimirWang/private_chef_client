import type { Message } from "@/types/chat";
import { User, Loader2, ChefHat } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
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
            <img
              src={message.imageUrl}
              alt="上传的图片"
              className="mb-1 block max-w-48 rounded-lg object-cover"
            />
          )}
          {isUser ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content)}
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-sm max-w-none text-sm prose-headings:font-bold prose-h1:mb-2 prose-h1:mt-4 prose-h1:text-lg prose-h2:mb-2 prose-h2:mt-4 prose-h2:text-base prose-h3:mb-1 prose-h3:mt-3 prose-h3:text-sm prose-h3:font-semibold prose-p:mb-2 prose-p:last:mb-0 prose-ul:mb-2 prose-ul:list-disc prose-ul:pl-5 prose-ol:mb-2 prose-ol:list-decimal prose-ol:pl-5 prose-li:mb-0.5 prose-a:text-blue-600 prose-a:underline prose-strong:font-semibold prose-em:italic prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.8125rem] prose-pre:mb-2 prose-pre:overflow-auto prose-pre:rounded-lg prose-pre:bg-gray-100 prose-pre:p-3 prose-pre:text-[0.8125rem] prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-gray-600 prose-table:mb-3 prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-th:border prose-th:border-gray-200 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-gray-200 prose-td:px-3 prose-td:py-2 prose-thead:bg-gray-100"
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-2 mt-4 text-lg font-bold">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 mt-4 text-base font-bold">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-1 mt-3 text-sm font-semibold">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2 text-sm last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 list-disc pl-5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 list-decimal pl-5">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-0.5 text-sm">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="text-sm font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-sm italic">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.8125rem]">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="mb-2 overflow-auto rounded-lg bg-gray-100 p-3 text-[0.8125rem]">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-2 border-l-4 border-blue-300 pl-3 italic text-gray-600">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <table className="mb-3 w-full border-collapse text-sm">
                    {children}
                  </table>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-100">{children}</thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                  <tr className="border-b border-gray-200">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-200 px-3 py-2">{children}</td>
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
