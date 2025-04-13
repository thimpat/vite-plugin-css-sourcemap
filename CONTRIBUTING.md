# Contributing to vite-plugin-css-sourcemap

Thank you for your interest in contributing to vite-plugin-css-sourcemap! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Run tests to ensure your changes work as expected
5. Submit a pull request

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/vite-plugin-css-sourcemap.git
   cd vite-plugin-css-sourcemap
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run tests:

   ```bash
   npm test
   ```

4. Run integration tests:

   ```bash
   npm run test:integration
   ```

5. Format code:
   ```bash
   npm run format
   ```

## Testing

We use Vitest for testing. There are two types of tests:

1. Unit tests: Located in `src/*.test.ts` files
2. Integration tests: Located in `src/integration.test.ts`

Make sure all tests pass before submitting a pull request.

## Playground

The project includes a playground for testing the plugin in a real Vite project:

```bash
# Start the playground development server
npm run playground:dev

# Build the playground
npm run playground:build

# Preview the built playground
npm run playground:preview
```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with details of changes
3. The PR will be merged once you have the sign-off of at least one maintainer

## Release Process

1. Update the version in package.json
2. Update the CHANGELOG.md
3. Create a new release on GitHub
4. Publish to npm

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
