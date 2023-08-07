class Passenger {
    constructor(isAisleSeat, seat, seed) {
        this.seat = seat;
        const assemblyTime = Math.max(this.normalDistribution(5, 1.5), 0);
        this.assemblyTimeCurrent = isAisleSeat ? 0 : assemblyTime;
        this.assemblyTimeFuture = assemblyTime + 2;
        this.minBuffer = Math.max(this.normalDistribution(2), 0);
        this.waitTimeSecondsCurrent = 0;
        this.waitTimeSecondsFuture = 0;
    }

    // Seeded random number generator using Mulberry32 algorithm
    seededRandom() {
      let t = this.seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
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
