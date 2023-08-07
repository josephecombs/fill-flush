class Passenger {
    constructor(isAisleSeat, seat) {
        this.seat = seat;
        const assemblyTime = Math.max(this.normalDistribution(5, 1.5), 0);
        this.assemblyTimeCurrent = isAisleSeat ? 0 : assemblyTime;
        this.assemblyTimeFuture = assemblyTime + 2;
        this.minBuffer = Math.max(this.normalDistribution(2), 0);
        this.waitTimeSecondsCurrent = 0;
        this.waitTimeSecondsFuture = 0;
    }

    // Helper function to simulate normal distribution (this is a simplified version)
    normalDistribution(mean, stdDev = 1) {
        let u1 = Math.random();
        let u2 = Math.random();
        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }
}

export default Passenger;
