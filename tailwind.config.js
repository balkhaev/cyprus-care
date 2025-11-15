module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          // ENOCYPRUS Mediterranean Relief UI colors
          primary: '#E36414',      // Deep Orange - fire, urgency, Cyprus sunsets
          secondary: '#5B9BD5',    // Soft Mediterranean Blue - trust, calm, water (less aggressive)
          accent: '#4CAF50',       // Olive Green - hope, nature, recovery
          danger: '#D32F2F',       // Fire Red - error/urgent
          bgsoft: '#F9F5F1',       // Soft warm white - friendly, readable for older people
        },
      },
    },
  };
