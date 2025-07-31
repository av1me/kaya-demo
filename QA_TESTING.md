# QA Testing Framework

This project includes a comprehensive QA testing framework that ensures code quality, functionality, and user experience across all releases.

## 🚀 Quick Start

### Run All QA Tests Locally
```bash
# Install dependencies
npm install

# Run the QA agent (comprehensive testing)
npm run qa:flows

# Or run individual test suites
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Unit tests with coverage
```

### Run QA Agent Script
```bash
# Make the script executable
chmod +x scripts/qa-agent.js

# Run the QA agent
node scripts/qa-agent.js
```

## 📋 Test Categories

### 1. Unit Tests (Vitest)
- **Location**: `src/test/`
- **Command**: `npm run test`
- **Coverage**: `npm run test:coverage`
- **UI**: `npm run test:ui`

**What's tested:**
- Component rendering and behavior
- Form validation
- State management
- API interactions
- Utility functions

### 2. End-to-End Tests (Playwright)
- **Location**: `tests/e2e/`
- **Command**: `npm run test:e2e`
- **UI**: `npm run test:e2e:ui`
- **Headed**: `npm run test:e2e:headed`

**What's tested:**
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Error handling
- Performance under load

### 3. Critical Flow Tests
- **Location**: `tests/e2e/critical-flows.spec.ts`
- **Command**: `npm run test:e2e tests/e2e/critical-flows.spec.ts`

**Critical flows tested:**
- Authentication flow
- Dashboard navigation
- Settings management
- Logout process
- Error recovery

### 4. Performance Tests
- **Location**: `tests/e2e/performance.spec.ts`
- **Command**: `npm run test:e2e tests/e2e/performance.spec.ts`

**Performance metrics:**
- Page load times
- Memory usage
- Large dataset handling
- Mobile performance
- Concurrent interactions

### 5. Accessibility Tests
- **Location**: `tests/e2e/accessibility.spec.ts`
- **Command**: `npm run test:e2e tests/e2e/accessibility.spec.ts`

**Accessibility checks:**
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- ARIA labels

## 🔧 Configuration

### Vitest Configuration (`vitest.config.ts`)
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Playwright Configuration (`playwright.config.ts`)
```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

## 🚀 GitHub Actions

The QA framework includes automated testing via GitHub Actions:

### Triggers
- **Push to main/develop**: Runs unit and E2E tests
- **Pull requests**: Runs all tests
- **Releases**: Runs comprehensive QA including performance and security

### Jobs
1. **Unit Tests**: Vitest with coverage
2. **E2E Tests**: Playwright across browsers
3. **Critical Flows**: Essential user journeys
4. **Performance Tests**: Load time and memory checks
5. **Security Scan**: Dependency vulnerabilities
6. **Accessibility Tests**: WCAG compliance

## 📊 QA Agent

The QA Agent (`scripts/qa-agent.js`) provides:

### Features
- **Comprehensive testing**: Runs all test suites
- **Detailed reporting**: JSON reports with recommendations
- **Performance metrics**: Load times and memory usage
- **Error analysis**: Detailed error reporting
- **Recommendations**: Actionable feedback

### Usage
```bash
# Run full QA suite
node scripts/qa-agent.js

# Output includes:
# - Test results summary
# - Performance metrics
# - Error details
# - Recommendations
# - JSON report file
```

### Report Structure
```json
{
  "summary": {
    "totalTests": 45,
    "totalPassed": 42,
    "totalFailed": 3,
    "duration": "120.5s",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "results": {
    "unit": { "passed": 15, "failed": 0, "errors": [] },
    "e2e": { "passed": 20, "failed": 2, "errors": [...] },
    "critical": { "passed": 5, "failed": 1, "errors": [...] }
  },
  "recommendations": [
    "Fix failing E2E tests before proceeding",
    "Critical flows are failing - this is blocking for release"
  ]
}
```

## 🧪 Writing Tests

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  
  await expect(page).toHaveURL('/dashboard')
})
```

## 📈 Performance Budgets

### Load Times
- **Dashboard**: < 3 seconds
- **Mobile**: < 2.5 seconds
- **Large datasets**: < 5 seconds

### Memory Usage
- **Initial load**: < 50MB increase
- **After interactions**: < 100MB total

### Concurrent Interactions
- **Multiple actions**: < 1 second response
- **Audio playback**: < 2 seconds for UI interactions

## 🔍 Debugging Tests

### Unit Tests
```bash
# Run with UI
npm run test:ui

# Run specific test
npm run test -- MyComponent.test.tsx

# Run with verbose output
npm run test -- --reporter=verbose
```

### E2E Tests
```bash
# Run with UI
npm run test:e2e:ui

# Run headed (see browser)
npm run test:e2e:headed

# Run specific test
npm run test:e2e auth.spec.ts

# Debug mode
DEBUG=pw:api npm run test:e2e
```

### View Reports
```bash
# Playwright report
npx playwright show-report

# Coverage report
open coverage/index.html
```

## 🚨 Common Issues

### Test Failures
1. **Timing issues**: Increase timeouts or add waits
2. **Selector changes**: Update test selectors
3. **API changes**: Update mock data
4. **Environment issues**: Check Node.js and dependency versions

### Performance Issues
1. **Slow tests**: Optimize test setup/teardown
2. **Memory leaks**: Check for proper cleanup
3. **Flaky tests**: Add retries or better waits

### Debugging Tips
1. Use `console.log()` in tests for debugging
2. Run tests in headed mode to see what's happening
3. Check browser console for errors
4. Use Playwright's trace viewer for E2E debugging

## 📚 Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests independent
- Clean up after each test

### Test Data
- Use mock data for consistency
- Avoid hardcoded values
- Create reusable test utilities
- Use factories for test data

### Performance
- Mock external dependencies
- Use efficient selectors
- Minimize DOM queries
- Clean up resources

### Accessibility
- Test keyboard navigation
- Verify ARIA labels
- Check color contrast
- Test with screen readers

## 🔄 Continuous Integration

### Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test",
      "pre-push": "npm run test:e2e"
    }
  }
}
```

### Release Checklist
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] Critical flows verified
- [ ] Performance within budget
- [ ] Accessibility compliance
- [ ] Security scan clean
- [ ] Documentation updated

## 📞 Support

For issues with the QA framework:

1. Check the test logs for error details
2. Review the QA report for recommendations
3. Run tests individually to isolate issues
4. Check browser console for client-side errors
5. Verify environment setup and dependencies

## 🎯 Next Steps

1. **Add more test coverage** for new features
2. **Optimize test performance** for faster feedback
3. **Enhance accessibility testing** for better compliance
4. **Add visual regression testing** for UI consistency
5. **Implement test data management** for better maintainability 