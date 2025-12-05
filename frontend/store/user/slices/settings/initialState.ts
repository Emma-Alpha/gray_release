export type AnimationMode = "disabled" | "agile" | "elegant";
export type ResponseAnimationStyle = "smooth" | "fadeIn" | "none";
export type ThemeMode = "auto" | "dark" | "light";
import type {
  HighlighterProps,
  MermaidProps,
  NeutralColors,
  PrimaryColors,
} from "@/styles";

export interface UserSettingsState {
  animationMode?: AnimationMode;
  neutralColor?: NeutralColors;
  primaryColor?: PrimaryColors;
  fontSize: number;
  transitionMode?: ResponseAnimationStyle;
  highlighterTheme?: HighlighterProps["theme"];
  mermaidTheme?: MermaidProps["theme"];

  themeMode?: ThemeMode;
}

export const initialState: UserSettingsState = {
  animationMode: "agile",
  neutralColor: undefined,
  primaryColor: undefined,
  fontSize: 14,
  transitionMode: "fadeIn",
  highlighterTheme: "lobe-theme",
  mermaidTheme: "lobe-theme",
  themeMode: "auto",
};
