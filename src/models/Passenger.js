class Passenger {
    constructor(isAisleSeat, seat, seed) {
        this.seat = seat;
        this.seeds = this.generateSeeds(seed);
        const assemblyTime = Math.max(this.normalDistribution(5, 1.5), 0);
        // const assemblyTime = 5;
        this.assemblyTimeCurrent = false ? 0 : assemblyTime;
        this.assemblyTimeFuture = assemblyTime + 2;
        this.minBuffer = Math.max(this.normalDistribution(2), 0);
        // this.minBuffer = 2;
        this.waitTimeSecondsCurrent = 0;
        this.waitTimeSecondsFuture = 0;

        this.statusQuoTracker = {
          seatedStart: 0,
          seatedEnd: 0,
          gatheringBelongingsStart: 0,
          gatheringBelongingsEnd: 0,
          standingStoppedStart: 0,
          standingStoppedEnd: 0,
          standingWaitingStart: 0,
          standingWaitingEnd: 0,
          walkingStart: 0,
          walkingEnd: 0,
        };
        this.fillAndFlushTracker = {
          seatedStart: 0,
          seatedEnd: 0,
          gatheringBelongingsStart: 0,
          gatheringBelongingsEnd: 0,
          standingStoppedStart: 0,
          standingStoppedEnd: 0,
          standingWaitingStart: 0,
          standingWaitingEnd: 0,
          walkingStart: 0,
          walkingEnd: 0,
        }
    }

    statusQuoBenefit() {
      return Math.round(this.statusQuoTracker.walkingEnd - this.fillAndFlushTracker.walkingEnd);
    }

    statusQuoDeplaningPhase(animationSecond) {
      return this.deplaningPhase(this.statusQuoTracker, animationSecond);
    }

    fillAndFlushDeplaningPhase(animationSecond) {
      return this.deplaningPhase(this.fillAndFlushTracker, animationSecond);
    }

    deplaningPhase(tracker, animationSecond) {
      if (animationSecond < tracker.seatedEnd) {
        return 'seated';
      } else if (animationSecond < tracker.gatheringBelongingsEnd) {
        return 'gatheringBelongings';
      } else if (animationSecond < tracker.standingStoppedEnd) {
        return 'standingStopped';
      } else if (animationSecond < tracker.standingWaitingEnd) {
        return 'standingWaiting';
      } else if (animationSecond < tracker.walkingEnd) {
        return 'walking';
      } else {
        return 'exited';
      }
    }

    // Seeded random number generator using Mulberry32 algorithm
    seededRandom() {
      let seed = this.seeds.shift(); // Shift a seed from the seeds array
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    
    generateSeeds(seed) {
      return Array.from({ length: 10 }, (_, i) => seed + i);
    }

    // Helper function to simulate normal distribution (this is a simplified version)
    normalDistribution(mean, stdDev = 1) {
      let u1 = this.seededRandom();      
      let u2 = this.seededRandom();
      let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return z0 * stdDev + mean;
    }
}

export default Passenger;
