import { createGlobalStyle } from "antd-style";
export * from "./customTheme";

import antdOverride from "./antdOverride";
import global from "./global";

const prefixCls = process.env.APP_NAME ?? "ant";

export const GlobalStyle = createGlobalStyle(({ theme }) => [
  global({ prefixCls, token: theme }),
  antdOverride({ prefixCls, token: theme }),
]);

export * from "./text";
export * from "./highlighter";
export * from "./mermaid";

export { generateCustomStylish as lobeCustomStylish } from "./theme/customStylish";
export { generateCustomToken as lobeCustomToken } from "./theme/customToken";
export {
  generateColorNeutralPalette,
  generateColorPalette,
} from "./theme/generateColorPalette";
