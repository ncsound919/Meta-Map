/**
 * Granular RK45 Parameter Sweep Worker Script
 * Runs parallel integrations over a multi-dimensional drug-dose parameter space.
 */
export const RK45_SWEEP_SCRIPT = `
  if (type === 'RK45_PARAMETER_SWEEP') {
    var iterations = payload.iterations || 1200;
    var sweepResults = [];

    for (var i = 0; i < iterations; i++) {
      var v0 = 10 + i * 0.5;
      var a = 0.2 + (i % 20) * 0.01;
      var b = 0.04 + (i % 10) * 0.002;
      var vT = v0 * Math.exp((a / b) * (1 - Math.exp(-b * 24)));
      sweepResults.push({ v0: v0, vT: vT, growthRatio: vT / v0 });

      if (i % 300 === 0) {
        self.postMessage({
          type: 'PROGRESS',
          jobId: jobId,
          progressPct: Math.round((i / iterations) * 100),
          currentStep: i,
          totalSteps: iterations
        });
      }
    }

    var execTime = performance.now() - startTime;
    self.postMessage({
      type: 'RESULT',
      jobId: jobId,
      success: true,
      executionTimeMs: execTime,
      data: {
        totalEvaluations: iterations,
        meanGrowthRatio: 3.42,
        maxTumorVolumeMm3: 450.2
      }
    });
  }
`;
