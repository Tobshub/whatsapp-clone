import { createContext } from "react";

// themes setup to use with/as bootstrap classes
export const themes = {
  dark: {
    background: "bg-dark",
    middleground: "bg-black",
    foreground: "text-light",
    misc: "warning",
    standout: "primary",
    buttons: "btn btn-outline-success",
  },
  light: {
    background: "bg-light",
    middleground: "bg-white",
    foreground: "text-black",
    misc: "secondary",
    standout: "success",
    buttons: "btn btn-outline-primary",
  },
} as const;

export type Themes = typeof themes.dark | typeof themes.light;

const ThemeContext = createContext<{
  theme: Themes;
  toggleTheme: () => void;
}>({ theme: themes.dark, toggleTheme: () => {} });

export default ThemeContext;
