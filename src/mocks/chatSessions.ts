import type { ChatSession } from "@/types/chatSession";

const HOUR = 3_600_000;
const DAY = 86_400_000;
const now = Date.now();

/** 仅用于 UI 演示的模拟会话，threadId 以 mock- 开头 */
export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    threadId: "mock-thread-today-1",
    title: "冰箱里有鸡蛋和番茄，能做什么？",
    preview: "可以试试番茄炒蛋、西式烘蛋，或者做一碗番茄蛋花汤，都很快手～",
    updatedAt: now - 25 * 60_000,
  },
  {
    threadId: "mock-thread-today-2",
    title: "三人份家常晚餐推荐",
    preview: "建议一荤一素一汤：红烧排骨、蒜蓉西兰花、紫菜蛋花汤，30 分钟左右能上桌。",
    updatedAt: now - 3 * HOUR,
  },
  {
    threadId: "mock-thread-yesterday-1",
    title: "低卡减脂午餐吃什么",
    preview: "鸡胸肉沙拉配藜麦饭不错，或者用豆腐、虾仁做清淡小炒，少油少盐。",
    updatedAt: now - DAY - 2 * HOUR,
  },
  {
    threadId: "mock-thread-yesterday-2",
    title: "牛排几分熟合适？",
    preview: "家庭煎牛排推荐 medium（五分熟），外焦里嫩；喜欢嫩一点可以三分熟。",
    updatedAt: now - DAY - 5 * HOUR,
  },
  {
    threadId: "mock-thread-3d",
    title: "帮我看看这张食材图",
    preview: "识别到牛肉、洋葱、青椒，可以做黑椒牛柳或青椒炒牛肉，需要调味建议吗？",
    updatedAt: now - 3 * DAY - 4 * HOUR,
  },
  {
    threadId: "mock-thread-5d",
    title: "周末 brunch 菜单",
    preview: "班尼迪克蛋、牛油果吐司、鲜榨橙汁，再配一壶手冲咖啡，很适合慢节奏早晨。",
    updatedAt: now - 5 * DAY - 1 * HOUR,
  },
];

export function isMockThreadId(threadId: string): boolean {
  return threadId.startsWith("mock-");
}

export function mergeWithMockSessions(real: ChatSession[]): ChatSession[] {
  const realIds = new Set(real.map((s) => s.threadId));
  const mocks = MOCK_CHAT_SESSIONS.filter((m) => !realIds.has(m.threadId));
  return [...real, ...mocks].sort((a, b) => b.updatedAt - a.updatedAt);
}
