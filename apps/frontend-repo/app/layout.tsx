"use client";

import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import theme from "../theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "../store/store"; // Import Redux store

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}> {/* Tambahkan Redux Provider */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
