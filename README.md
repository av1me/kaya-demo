# Kaya CEO Demo

A comprehensive CEO dashboard application with integrated QA testing framework for team health analytics, insights, and recommendations.

## 🚀 Features

- **Team Health Analytics**: Real-time team health metrics and trends
- **Weekly Podcast Insights**: AI-generated podcast summaries and key insights
- **Smart Recommendations**: Actionable recommendations for team improvement
- **Noma Assistant**: AI-powered assistant for team insights
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Comprehensive QA Testing**: Full testing suite with automated workflows

## 🧪 QA Testing Framework

This project includes a comprehensive QA testing framework that ensures code quality, functionality, and user experience across all releases.

### Test Categories

- **Unit Tests** (Vitest): Component testing, form validation, state management
- **End-to-End Tests** (Playwright): Complete user journeys, cross-browser testing
- **Critical Flow Tests**: Essential user workflows and error handling
- **Performance Tests**: Load times, memory usage, and optimization
- **Accessibility Tests**: WCAG 2.1 compliance and screen reader support
- **Security Tests**: Dependency vulnerabilities and security audits

### Quick Start

```bash
# Install dependencies
npm install

# Run all QA tests
npm run qa:flows

# Run individual test suites
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Unit tests with coverage

# Run QA agent
node scripts/qa-agent.js
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **State Management**: TanStack Query
- **Testing**: Vitest, Playwright, Testing Library
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kaya-ceo-demo.git
   cd kaya-ceo-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install --with-deps
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run headed (see browser)
npm run test:e2e:headed
```

### QA Agent
```bash
# Run comprehensive QA suite
node scripts/qa-agent.js
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📊 Performance Budgets

- **Dashboard Load Time**: < 3 seconds
- **Mobile Load Time**: < 2.5 seconds
- **Memory Usage**: < 50MB increase
- **Concurrent Interactions**: < 1 second response

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=Kaya CEO Demo
```

### Test Configuration
- **Vitest**: `vitest.config.ts`
- **Playwright**: `playwright.config.ts`
- **Coverage**: Configured in Vitest config

## 📁 Project Structure

```
kaya-ceo-demo/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── settings/        # Settings components
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and API
│   ├── hooks/              # Custom React hooks
│   └── test/               # Unit test utilities
├── tests/
│   └── e2e/                # End-to-end tests
├── scripts/
│   └── qa-agent.js         # QA testing agent
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm run test
   npm run test:e2e
   ```

3. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new dashboard widget"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 QA Checklist

Before merging any changes, ensure:

- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] Critical flows verified
- [ ] Performance within budget
- [ ] Accessibility compliance
- [ ] Security scan clean
- [ ] Documentation updated

## 🚨 Troubleshooting

### Common Issues

1. **Test Failures**
   - Check for timing issues
   - Update selectors if UI changed
   - Verify mock data is current

2. **Performance Issues**
   - Run performance tests locally
   - Check bundle size
   - Optimize images and assets

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

### Getting Help

- Check the [QA Testing Documentation](./QA_TESTING.md)
- Review test logs for specific errors
- Run tests individually to isolate issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [Vite](https://vitejs.dev/) for build tooling
- [Playwright](https://playwright.dev/) for E2E testing
- [Vitest](https://vitest.dev/) for unit testing

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the QA testing guide

---

**Built with ❤️ for better team management and QA practices**
