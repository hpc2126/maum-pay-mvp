export type Side = "groom" | "bride";

export const THEME = {
  groom: {
    label: "신랑측",
    accent: "text-blue-700",
    pill: "bg-blue-50 text-blue-700",
    button: "bg-blue-600 text-white hover:bg-blue-700",
    card: "border-blue-100",
  },
  bride: {
    label: "신부측",
    accent: "text-rose-700",
    pill: "bg-rose-50 text-rose-700",
    button: "bg-rose-500 text-white hover:bg-rose-600",
    card: "border-rose-100",
  },
} as const;