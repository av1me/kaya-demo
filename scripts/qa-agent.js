#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class QAAgent {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, errors: [] },
      e2e: { passed: 0, failed: 0, errors: [] },
      critical: { passed: 0, failed: 0, errors: [] },
      performance: { passed: 0, failed: 0, errors: [] },
      accessibility: { passed: 0, failed: 0, errors: [] },
      security: { passed: 0, failed: 0, errors: [] }
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, description) {
    try {
      this.log(`Running: ${description}`);
      const output = execSync(command, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 300000 // 5 minutes timeout
      });
      this.log(`✅ ${description} completed successfully`, 'success');
      return { success: true, output };
    } catch (error) {
      this.log(`❌ ${description} failed: ${error.message}`, 'error');
      return { success: false, error: error.message, output: error.stdout || '' };
    }
  }

  async checkDependencies() {
    this.log('Checking dependencies...');
    
    const checks = [
      { command: 'node --version', description: 'Node.js version' },
      { command: 'npm --version', description: 'npm version' },
      { command: 'npx playwright --version', description: 'Playwright version' }
    ];

    for (const check of checks) {
      await this.runCommand(check.command, check.description);
    }
  }

  async runUnitTests() {
    this.log('Running unit tests...');
    const result = await this.runCommand('npm run test:coverage', 'Unit tests with coverage');
    
    if (result.success) {
      this.results.unit.passed++;
      this.log('Unit tests passed', 'success');
    } else {
      this.results.unit.failed++;
      this.results.unit.errors.push(result.error);
    }
  }

  async runE2ETests() {
    this.log('Running end-to-end tests...');
    const result = await this.runCommand('npm run test:e2e', 'End-to-end tests');
    
    if (result.success) {
      this.results.e2e.passed++;
      this.log('E2E tests passed', 'success');
    } else {
      this.results.e2e.failed++;
      this.results.e2e.errors.push(result.error);
    }
  }

  async runCriticalFlows() {
    this.log('Running critical flow tests...');
    const result = await this.runCommand(
      'npx playwright test tests/e2e/critical-flows.spec.ts',
      'Critical flow tests'
    );
    
    if (result.success) {
      this.results.critical.passed++;
      this.log('Critical flows passed', 'success');
    } else {
      this.results.critical.failed++;
      this.results.critical.errors.push(result.error);
    }
  }

  async runPerformanceTests() {
    this.log('Running performance tests...');
    const result = await this.runCommand(
      'npx playwright test tests/e2e/performance.spec.ts',
      'Performance tests'
    );
    
    if (result.success) {
      this.results.performance.passed++;
      this.log('Performance tests passed', 'success');
    } else {
      this.results.performance.failed++;
      this.results.performance.errors.push(result.error);
    }
  }

  async runAccessibilityTests() {
    this.log('Running accessibility tests...');
    const result = await this.runCommand(
      'npx playwright test tests/e2e/accessibility.spec.ts',
      'Accessibility tests'
    );
    
    if (result.success) {
      this.results.accessibility.passed++;
      this.log('Accessibility tests passed', 'success');
    } else {
      this.results.accessibility.failed++;
      this.results.accessibility.errors.push(result.error);
    }
  }

  async runSecurityScan() {
    this.log('Running security scan...');
    const result = await this.runCommand('npm audit --audit-level moderate', 'Security audit');
    
    if (result.success) {
      this.results.security.passed++;
      this.log('Security scan passed', 'success');
    } else {
      this.results.security.failed++;
      this.results.security.errors.push(result.error);
    }
  }

  async buildApplication() {
    this.log('Building application...');
    const result = await this.runCommand('npm run build', 'Application build');
    
    if (!result.success) {
      throw new Error('Build failed - cannot proceed with tests');
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const totalTests = Object.values(this.results).reduce((sum, result) => 
      sum + result.passed + result.failed, 0
    );
    const totalPassed = Object.values(this.results).reduce((sum, result) => 
      sum + result.passed, 0
    );
    const totalFailed = Object.values(this.results).reduce((sum, result) => 
      sum + result.failed, 0
    );

    const report = {
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        duration: `${duration}s`,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'qa-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 QA TEST REPORT');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📈 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`📊 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detailed Results:');
    Object.entries(this.results).forEach(([testType, result]) => {
      const icon = result.failed > 0 ? '❌' : '✅';
      console.log(`${icon} ${testType.toUpperCase()}: ${result.passed} passed, ${result.failed} failed`);
    });

    if (totalFailed > 0) {
      console.log('\n🚨 Errors Found:');
      Object.entries(this.results).forEach(([testType, result]) => {
        if (result.errors.length > 0) {
          console.log(`\n${testType.toUpperCase()}:`);
          result.errors.forEach(error => console.log(`  - ${error}`));
        }
      });
    }

    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  - ${rec}`));

    console.log(`\n📄 Full report saved to: ${reportPath}`);
    console.log('='.repeat(60));

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.unit.failed > 0) {
      recommendations.push('Fix failing unit tests before proceeding');
    }

    if (this.results.e2e.failed > 0) {
      recommendations.push('Review and fix end-to-end test failures');
    }

    if (this.results.critical.failed > 0) {
      recommendations.push('Critical flows are failing - this is blocking for release');
    }

    if (this.results.security.failed > 0) {
      recommendations.push('Address security vulnerabilities before release');
    }

    if (this.results.performance.failed > 0) {
      recommendations.push('Performance issues detected - optimize before release');
    }

    if (this.results.accessibility.failed > 0) {
      recommendations.push('Accessibility issues found - review for compliance');
    }

    const totalFailed = Object.values(this.results).reduce((sum, result) => 
      sum + result.failed, 0
    );

    if (totalFailed === 0) {
      recommendations.push('All tests passed! Ready for release 🚀');
    }

    return recommendations;
  }

  async run() {
    try {
      this.log('🚀 Starting QA Agent...');
      
      await this.checkDependencies();
      await this.buildApplication();
      
      // Run tests in parallel where possible
      await Promise.all([
        this.runUnitTests(),
        this.runE2ETests(),
        this.runCriticalFlows()
      ]);

      // Run additional tests
      await Promise.all([
        this.runPerformanceTests(),
        this.runAccessibilityTests(),
        this.runSecurityScan()
      ]);

      const report = this.generateReport();
      
      // Exit with appropriate code
      const totalFailed = Object.values(this.results).reduce((sum, result) => 
        sum + result.failed, 0
      );
      
      if (totalFailed > 0) {
        process.exit(1);
      } else {
        this.log('🎉 All QA tests passed!', 'success');
        process.exit(0);
      }

    } catch (error) {
      this.log(`💥 QA Agent failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the QA agent
if (require.main === module) {
  const qaAgent = new QAAgent();
  qaAgent.run();
}

module.exports = QAAgent; 