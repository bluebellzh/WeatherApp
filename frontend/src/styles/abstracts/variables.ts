export const variables = {
    colors: {
      primary: '#3498DB',
      secondary: '#2C3E50',
      white: '#FFFFFF',
      glassBackground: 'rgba(255, 255, 255, 0.1)',
      glassBackgroundHover: 'rgba(255, 255, 255, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: {
        base: '1rem',
        large: '180px',
        unit: '40px',
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
      },
      lineHeight: 1.5,
      letterSpacing: '-4px',
    },
    effects: {
      blur: '10px',
      borderRadius: '8px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    },
    layout: {
      sidebarWidth: 380,
      drawerWidth: 240,
      headerHeight: 64,
      footerHeight: 48,
    },
    spacing: {
      xs: '0.25rem',  // 4px
      sm: '0.5rem',   // 8px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
      xl: '2rem',     // 32px
    },
    zIndex: {
      background: 0,
      content: 1,
      overlay: 2,
      modal: 1000,
    },
    transitions: {
      duration: '0.3s',
      timing: 'ease-in-out',
    },
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
    grid: {
      columns: 12,
      gutter: '1rem',
      margin: '1rem',
    },
  };