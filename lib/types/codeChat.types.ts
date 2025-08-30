export interface CodeFile {
  path: string;
  content: string;
}

export interface CodeConfig {
  files: CodeFile[]
}

export interface BotMessage {
  messages: string[];
  code?: CodeFile[];
}

export interface ChatTurn {
  user: string[];
  bot: BotMessage;
}

export interface ChatSession {
  turns: ChatTurn[];
}
