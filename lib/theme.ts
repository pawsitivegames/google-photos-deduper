import { createTheme } from "@mui/material/styles"

export const photoSweepColors = {
  canvasTop: "#F6FAF8",
  canvasBottom: "#EDF6F3",
  surface: "#FFFFFF",
  surfaceSoft: "#F4F8F6",
  surfaceTint: "rgba(255,255,255,0.9)",
  border: "#D6E2DD",
  borderStrong: "#B8CBC4",
  ink: "#17201C",
  muted: "#66736D",
  primary: "#0B6E69",
  primaryDark: "#084F4B",
  primarySoft: "#E4F3F1",
  primaryBorder: "#9ECBC6",
  primaryShadow: "rgba(11, 110, 105, 0.18)",
  success: "#248A4B",
  successDark: "#176535",
  successSoft: "#E5F4EA",
  warning: "#B7791F",
  warningSoft: "#FFF3D8",
  error: "#E25148",
  errorDark: "#B9362F",
  errorSoft: "#FDEBE8",
  shadow: "rgba(23, 32, 28, 0.09)"
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: photoSweepColors.primary,
      dark: photoSweepColors.primaryDark,
      light: photoSweepColors.primarySoft,
      contrastText: "#FFFFFF"
    },
    success: {
      main: photoSweepColors.success,
      light: photoSweepColors.successSoft,
      dark: photoSweepColors.successDark
    },
    warning: {
      main: photoSweepColors.warning,
      light: photoSweepColors.warningSoft,
      dark: "#8A5A14"
    },
    error: {
      main: photoSweepColors.error,
      light: photoSweepColors.errorSoft,
      dark: photoSweepColors.errorDark,
      contrastText: "#FFFFFF"
    },
    background: {
      default: photoSweepColors.canvasTop,
      paper: photoSweepColors.surfaceTint
    },
    divider: photoSweepColors.border,
    text: {
      primary: photoSweepColors.ink,
      secondary: photoSweepColors.muted
    }
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"SF Pro Text"',
      '"SF Pro Display"',
      '"DM Sans"',
      '"Segoe UI"',
      "Arial",
      "sans-serif"
    ].join(","),
    h5: {
      fontWeight: 700,
      letterSpacing: 0
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0
    },
    caption: {
      letterSpacing: 0
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(246,250,248,0.82)",
          color: photoSweepColors.ink,
          boxShadow: `0 1px 0 ${photoSweepColors.shadow}`,
          backdropFilter: "saturate(180%) blur(22px)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
          boxShadow: "none",
          minHeight: 36,
          letterSpacing: 0,
          transition:
            "background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease",
          "&:hover": {
            transform: "translateY(-1px)"
          },
          "&:active": {
            transform: "translateY(0)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          borderColor: photoSweepColors.border,
          transition:
            "background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease",
          "&.Mui-selected": {
            color: photoSweepColors.primary,
            backgroundColor: photoSweepColors.primarySoft,
            borderColor: photoSweepColors.primaryBorder
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 7,
          backgroundColor: "#E2EBE7"
        }
      }
    }
  }
})

export default theme
