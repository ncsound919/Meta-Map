/**
 * Granular Gillespie Monte Carlo Simulation Worker Script
 * Runs parallelized stochastic trajectories for shear stress & immune cell interaction dynamics.
 */
export const GILLESPIE_SCRIPT = `
  if (type === 'MONTE_CARLO_GILLESPIE') {
    var nTrajectories = payload.trajectories || 2500;
    var hours = payload.hours || 48;
    var shearStress = payload.shearStress || 18.0;
    var nkActivity = payload.nkActivity || 75.0;

    var survivalCounts = [];
    var lysedCounts = [];
    var totalStepsRun = 0;
    var shearLysisEvents = 0;
    var nkLysisEvents = 0;
    var proliferationEvents = 0;
    var totalSurvivalTime = 0;

    for (var t = 0; t < nTrajectories; t++) {
      var cells = payload.initialClusterSize || 3;
      var currTime = 0.0;
      var alive = true;

      while (currTime < hours && alive) {
        // Calculate dynamic propensities
        var a1 = 0.015 * (shearStress / 15.0) * cells; // Shear lysis
        var a2 = 0.02 * (nkActivity / 50.0) * cells;   // NK lysis
        var a3 = 0.004 * cells;                        // Aggregation/Proliferation rate
        var a0 = a1 + a2 + a3;

        if (a0 <= 1e-6) {
          break;
        }

        // Draw Uniform(0,1) numbers
        var r1 = Math.random();
        var r2 = Math.random();

        // Time increment deltaTau
        var deltaTau = -Math.log(r1) / a0;
        currTime += deltaTau;

        if (currTime >= hours) {
          break;
        }

        totalStepsRun++;

        // Select reaction channel
        var rChoice = r2 * a0;
        if (rChoice < a1) {
          // Channel 1: Shear lysis
          cells--;
          shearLysisEvents++;
          if (cells <= 0) {
            alive = false;
            lysedCounts.push(currTime);
            break;
          }
        } else if (rChoice < a1 + a2) {
          // Channel 2: NK lysis
          cells--;
          nkLysisEvents++;
          if (cells <= 0) {
            alive = false;
            lysedCounts.push(currTime);
            break;
          }
        } else {
          // Channel 3: Proliferation / growth
          cells++;
          proliferationEvents++;
        }
      }

      if (alive) {
        survivalCounts.push(cells);
        totalSurvivalTime += hours;
      } else {
        totalSurvivalTime += currTime;
      }

      if (t % 500 === 0) {
        self.postMessage({
          type: 'PROGRESS',
          jobId: jobId,
          progressPct: Math.round((t / nTrajectories) * 100),
          currentStep: t,
          totalSteps: nTrajectories
        });
      }
    }

    var avgTransitSurvival = totalSurvivalTime / nTrajectories;
    var avgSteps = totalStepsRun / nTrajectories;

    var execTime = performance.now() - startTime;
    self.postMessage({
      type: 'RESULT',
      jobId: jobId,
      success: true,
      executionTimeMs: execTime,
      data: {
        totalTrajectories: nTrajectories,
        survivedClusters: survivalCounts.length,
        survivalRatePct: Number(((survivalCounts.length / nTrajectories) * 100).toFixed(2)),
        meanTransitSurvivalHours: Number(avgTransitSurvival.toFixed(2)),
        gillespieExactSteps: Number(avgSteps.toFixed(1)),
        shearLysisCount: shearLysisEvents,
        nkClearanceCount: nkLysisEvents,
        clusterExpansionCount: proliferationEvents
      }
    });
  }
`;
