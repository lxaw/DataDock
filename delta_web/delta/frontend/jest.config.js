module.exports = {
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform'
        
    },
    moduleNameMapper: {
        "/\.(css|sass)$": "identity-obj-proxy",
      },
    setupFiles:['<rootDir>/setup.js'],
};