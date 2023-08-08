import Passenger from './Passenger';

describe('Passenger class', () => {

    it('should produce consistent results with the same seed', () => {
        const seed = 12345;
        const isAisleSeat = false; // or true, doesn't matter for this test
        const seat = "1A"; // placeholder, adjust if needed

        const passenger1 = new Passenger(isAisleSeat, seat, seed);
        const passenger2 = new Passenger(isAisleSeat, seat, seed);

        const results1 = Array(1000).fill(null).map(() => passenger1.normalDistribution(5, 1.5));
        const results2 = Array(1000).fill(null).map(() => passenger2.normalDistribution(5, 1.5));

        for (let i = 0; i < results1.length; i++) {
            expect(results1[i]).toEqual(results2[i]);
        }
    });

    it('should produce different results with different seeds', () => {
        const seed1 = 12345;
        const seed2 = 54321;
        const isAisleSeat = false; // or true, doesn't matter for this test
        const seat = "1A"; // placeholder, adjust if needed

        const passenger1 = new Passenger(isAisleSeat, seat, seed1);
        const passenger2 = new Passenger(isAisleSeat, seat, seed2);

        const result1 = passenger1.normalDistribution(5, 1.5);
        const result2 = passenger2.normalDistribution(5, 1.5);

        expect(result1).not.toEqual(result2);
    });

});
