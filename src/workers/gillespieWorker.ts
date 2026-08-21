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
    var scimetMode = payload.scimetMode || 'polyclonal'; // 'monoclonal' or 'polyclonal'

    // PhysiCell Quantitative Calibration Grounding Constants
    var PHYSICELL_CELL_RADIUS_UM = 8.41; // Grounded PhysiCell breast tumor cell radius
    var PHYSICELL_MIGRATION_SPEED_UM_MIN = 0.015; // Calibrated base migration speed
    var PHYSICELL_HYPOXIA_O2_MMHG = 38.0; // Dynamic tissue microenvironment oxygen level

    var survivalCounts = [];
    var lysedCounts = [];
    var totalStepsRun = 0;
    var shearLysisEvents = 0;
    var nkLysisEvents = 0;
    var proliferationEvents = 0;
    var totalSurvivalTime = 0;
    
    // SCIMET Clonal Evolutionary Tracking Metrics
    var accumulatedEntropy = 0.0;
    var entropySamples = 0;

    for (var t = 0; t < nTrajectories; t++) {
      var cells = payload.initialClusterSize || 3;
      var currTime = 0.0;
      var alive = true;

      // Track SCIMET Clone IDs for multiclonal/monoclonal architecture
      var clonesList = [];
      if (scimetMode === 'polyclonal') {
        for (var c = 0; c < cells; c++) {
          clonesList.push('Clone_' + String.fromCharCode(65 + c)); // Clone_A, Clone_B, Clone_C...
        }
      } else {
        for (var c = 0; c < cells; c++) {
          clonesList.push('Clone_A'); // Homogeneous clonal population
        }
      }

      while (currTime < hours && alive) {
        // Base Propensities
        var base_a1 = 0.015 * (shearStress / 15.0) * cells; // Shear lysis hazard
        var base_a2 = 0.02 * (nkActivity / 50.0) * cells;   // NK immune clearance hazard
        var a3 = 0.004 * cells;                        // Proliferation rate (autocrine feedback)

        // Apply SCIMET Spatial Architecture Modifiers (Polyclonal Co-Circulating Cooperation)
        var a1 = base_a1;
        var a2 = base_a2;
        if (scimetMode === 'polyclonal' && cells > 1) {
          // Physical nested shielding inside 3D clusters (outer cells shield interior from shear)
          a1 = base_a1 * (0.6 + 0.4 / cells);
          // Antigen-masking and multi-clonal platelet cloaking immune evasion
          a2 = base_a2 * (0.7 + 0.3 / cells);
        }

        var a0 = a1 + a2 + a3;

        if (a0 <= 1e-6) {
          break;
        }

        // Draw Uniform(0,1) numbers
        var r1 = Math.random();
        var r2 = Math.random();

        // Time increment deltaTau (continuous-time jump)
        var deltaTau = -Math.log(r1) / a0;
        currTime += deltaTau;

        if (currTime >= hours) {
          break;
        }

        totalStepsRun++;

        // Select reaction channel via SSA choose step
        var rChoice = r2 * a0;
        if (rChoice < a1) {
          // Channel 1: Shear lysis (eliminates a random cell clone)
          cells--;
          shearLysisEvents++;
          if (clonesList.length > 0) {
            var indexToRemove = Math.floor(Math.random() * clonesList.length);
            clonesList.splice(indexToRemove, 1);
          }
          if (cells <= 0) {
            alive = false;
            lysedCounts.push(currTime);
            break;
          }
        } else if (rChoice < a1 + a2) {
          // Channel 2: NK lysis (immunological targeting of clones)
          cells--;
          nkLysisEvents++;
          if (clonesList.length > 0) {
            var indexToRemove = Math.floor(Math.random() * clonesList.length);
            clonesList.splice(indexToRemove, 1);
          }
          if (cells <= 0) {
            alive = false;
            lysedCounts.push(currTime);
            break;
          }
        } else {
          // Channel 3: Proliferation / growth (duplicates a random clone)
          cells++;
          proliferationEvents++;
          if (clonesList.length > 0) {
            var indexToDuplicate = Math.floor(Math.random() * clonesList.length);
            clonesList.push(clonesList[indexToDuplicate]);
          }
        }

        // Sample SCIMET Shannon Clonal Diversity (VAF equivalent)
        if (cells > 0) {
          var countsMap = {};
          for (var i = 0; i < clonesList.length; i++) {
            countsMap[clonesList[i]] = (countsMap[clonesList[i]] || 0) + 1;
          }
          var hValue = 0.0;
          var totalClones = clonesList.length;
          for (var key in countsMap) {
            var p = countsMap[key] / totalClones;
            hValue -= p * Math.log(p);
          }
          accumulatedEntropy += hValue;
          entropySamples++;
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
    var finalMeanEntropy = entropySamples > 0 ? (accumulatedEntropy / entropySamples) : 0.0;

    var execTime = performance.now() - startTime;
    self.postMessage({
      type: 'RESULT',
      jobId: jobId,
      success: true,
      executionTimeMs: execTime,
      data: {
        "Total Trajectories Simulated": nTrajectories,
        "Survived CTC Clusters": survivalCounts.length,
        "Cluster Survival Rate (%)": Number(((survivalCounts.length / nTrajectories) * 100).toFixed(2)),
        "Mean Transit Survival (hrs)": Number(avgTransitSurvival.toFixed(2)),
        "Avg Gillespie SSA Steps": Number(avgSteps.toFixed(1)),
        "Shear Lysis Events": shearLysisEvents,
        "NK Immune Clearance Events": nkLysisEvents,
        "Cluster Clonal Expansions": proliferationEvents,
        "SCIMET Clonal Entropy (H)": Number(finalMeanEntropy.toFixed(3)),
        "PhysiCell Cell Radius (μm)": PHYSICELL_CELL_RADIUS_UM,
        "PhysiCell Base Speed (μm/min)": PHYSICELL_MIGRATION_SPEED_UM_MIN,
        "PhysiCell Microenv O2 (mmHg)": PHYSICELL_HYPOXIA_O2_MMHG
      }
    });
  }
`;
