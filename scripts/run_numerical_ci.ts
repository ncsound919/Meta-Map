/**
 * Automated Numerical Convergence & Biophysical Law CI Runner
 * 
 * Standalone runner executed during CI/CD workflows and pre-commit checks.
 * Enforces:
 * - 4th-order ODE truncation error < 1e-3
 * - Adaptive RK45 step-size error <= 1e-4
 * - Murray's law vascular conservation residual < 5%
 * - Extended Kalman Filter covariance positivity & bounded credible intervals
 * - MASE < 1.0 (Strict statistical superiority over persistence)
 * - Harrell's C-index >= 0.70 concordance
 * - Probability bounds [0, 100%] conservation
 */

import { AutomatedBiophysicalTestSuite } from '../src/math/automatedTestSuite';

async function runCiSuite() {
  console.log('================================================================');
  console.log('  METASTASIS TWIN: BIOPHYSICAL & NUMERICAL CONVERGENCE CI SUITE');
  console.log('================================================================\n');

  const summary = AutomatedBiophysicalTestSuite.runAllTests();

  console.log(`Executed: ${summary.totalTests} tests across ${summary.totalDurationMs} ms`);
  console.log(`Pass Rate: ${summary.passRatePct}% (${summary.passedTests}/${summary.totalTests} Passed)\n`);

  let hasFailures = false;

  summary.results.forEach((test) => {
    const statusTag = test.passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
    console.log(`${statusTag} ${test.id} - ${test.name}`);
    console.log(`       Suite:     ${test.suite}`);
    console.log(`       Actual:    ${test.actualValue}`);
    console.log(`       Tolerance: ${test.expectedThreshold}`);
    console.log(`       Duration:  ${test.executionTimeMs} ms`);
    if (test.message) console.log(`       Message:   ${test.message}`);
    console.log('');

    if (!test.passed) hasFailures = true;
  });

  if (hasFailures) {
    console.error('\x1b[31mERROR: Numerical convergence or physical conservation tolerances breached!\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[32mSUCCESS: All biophysical laws, ODE error bounds, and statistical benchmarks satisfied!\x1b[0m');
    process.exit(0);
  }
}

runCiSuite().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
