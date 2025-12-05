export const MATCH_TYPE_OPTIONS = [
  { value: "whitelist", label: "白名单", color: "cyan" },
  { value: "header", label: "Header匹配", color: "blue" },
  { value: "cookie", label: "Cookie匹配", color: "purple" },
  { value: "ip", label: "IP匹配", color: "orange" },
] as const;

export const VALUE_TYPE_OPTIONS = [
  { value: "user_id", label: "用户ID" },
  { value: "ip", label: "IP地址" },
] as const;
