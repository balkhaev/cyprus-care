module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          // Mediterranean Relief UI colors (from README.md)
          primary: '#d77040',      // Deep Orange - urgency, fire, Cypriot sunsets
          secondary: '#4a8fc9',    // Safe Blue - trust, calm, sea
          accent: '#65b365',       // Olive Green - hope, nature, recovery
          danger: '#c95555',       // Fire Red - urgent alerts
          bgsoft: '#F9F5F1',       // Soft warm background
        },
      },
    },
  };
