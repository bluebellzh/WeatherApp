module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    setupFiles: ['jest-localstorage-mock'],
    setupFilesAfterEnv: [
      '<rootDir>/src/setupTests.ts',
      '@testing-library/jest-dom'
    ],
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
      '\\.svg$': '<rootDir>/__mocks__/fileMock.js',
      '^@/(.*)$': '<rootDir>/src/$1',
      '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
    },
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript'
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ]
      }],
      '\\.scss$': 'jest-transform-stub'
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(@mui)/)',
    ],
    testMatch: [   
      "**/*.test.(ts|tsx)"
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironmentOptions: {
      customExportConditions: [''],
    },
    projects: [
      {
        displayName: 'dom',
        testEnvironment: 'jsdom',
        testMatch: [
          "<rootDir>/src/components/**/*.test.(ts|tsx)"
        ],
      },
      {
        displayName: 'node',
        testEnvironment: 'node',
        setupFiles: ['jest-localstorage-mock'],
        setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
        testMatch: [
         "**/__tests__/**/*.test.(ts|tsx)",
        ],
      }
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/index.tsx',
      '!src/test/**/*',
      '!src/**/__tests__/**/*',
      '!src/**/__mocks__/**/*',
      // Exclude proto files
      '!src/proto/**/*',
      '!src/proto/WeatherServiceClientPb.ts',
      '!src/proto/weather_pb.js',
      // Exclude test setup files
      '!src/setupTests.ts',
      // Exclude other common test-related files
      '!src/**/*.test.{js,jsx,ts,tsx}',
      // Exclude theme files
      '!src/theme/**/*',
      '!src/theme/index.ts',
      '!src/theme/theme.ts',
      '!src/theme/palette.ts',
      '!src/theme/components.ts',
      // Exclude other mock files
      '!src/services/serviceFactory.ts',
      '!src/services/mockWeatherService.ts',
      '!src/styles/**/*',
      // Exclude App component and other component (add them later)
      '!src/components/CitySearch.tsx',
      '!src/components/WeatherIcon.tsx',
      '!src/App.tsx',
      // Exclude other configuration files
      '!src/**/types/**/*',
      '!src/weather.ts',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: 'coverage',
};