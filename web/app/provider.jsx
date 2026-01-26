import React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
const Provider = ({ children, ...props }) => {
  return (
    <NextThemeProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div>{children}</div>
    </NextThemeProvider>
  );
};

export default Provider;
