import Plane from './Plane';
import Passenger from './Passenger';

const DEFAULT_SEED = 12345;

describe('Plane', () => {
  it('calculates disembarkation times correctly for a single-column plane', () => {
    
    // Create a new Plane with 30 rows and 1 column
    const plane = new Plane(30, 1, 3.1, 31, DEFAULT_SEED);

    // Assign passengers with known assembly times to each seat in the plane
    const fixedAssemblyTime = 5;
    const fixedMinBuffer = 2;
    
    for (let i = 0; i < plane.rows; i++) {
      // Create a new Passenger with a known assembly time
      const passenger = new Passenger(true, `${i+1}C`, DEFAULT_SEED);
      passenger.assemblyTimeCurrent = fixedAssemblyTime;
      passenger.assemblyTimeFuture = fixedAssemblyTime;
      passenger.minBuffer = fixedMinBuffer;

      // Assign the passenger to the seat in the plane
      plane.seats[i][0] = passenger;
    }
    
    //the wait for the first person on the plane in this situation will be the time it takes them to gather their belongings
    //assume the whole column is standing and has gotten their stuff ready while jet bridge is getting ready
    const firstPersonWaitTime = 5;
    
    expect(plane.disembarkCurrent()).toBe(
      firstPersonWaitTime + ((plane.rows - 1) * fixedMinBuffer) + plane.calculateWalkTime()
    );

    // Calculate the initial buffer time as the max assemblyTimeFuture of the people in the aisle
    const initialBufferTime = Math.max(...plane.seats.map(row => row[0].assemblyTimeFuture));
    
    expect(plane.disembarkFuture()).toBe(
      initialBufferTime + ((plane.rows - 1) * fixedMinBuffer) + plane.calculateWalkTime() * plane.columns
    ); 
  });
  
  it('calculates disembarkation times correctly for a two-column plane with 15 rows', () => {
    // Create a new Plane with 15 rows and 2 columns
    const plane = new Plane(15, 2, 3.1, 31, DEFAULT_SEED);

    // Assign passengers with known assembly times to each seat in the plane
    const fixedAssemblyTime = 5;
    const fixedMinBuffer = 2;
    
    for (let i = 0; i < plane.rows; i++) {
      for (let j = 0; j < plane.columns; j++) {
        // Create a new Passenger with a known assembly time

        let colCharacter = 'C'
        if (j === 1) {
          colCharacter = 'D'
        };

        const passenger = new Passenger(j === plane.columns - 1, `${i+1}${colCharacter}`);
        passenger.assemblyTimeCurrent = fixedAssemblyTime;
        passenger.assemblyTimeFuture = fixedAssemblyTime;
        passenger.minBuffer = fixedMinBuffer;

        // Assign the passenger to the seat in the plane
        plane.seats[i][j] = passenger;
      }
    }
    
    // Calculate the initial buffer time as the max assemblyTimeFuture of the people in the aisle
    const initialBufferTime1 = Math.max(...plane.seats.map(row => row[0].assemblyTimeFuture));
    
    // make sure to consider reductionFactor in this calculation - assembly time goes down in each wave
    const initialBufferTime2 = Math.max(...plane.seats.map(row => row[plane.columns - 1].assemblyTimeFuture)) * (1 - plane.assemblyTimeWaveReductionFactor * (plane.columns - 1));
    
    // as in the other scenario, the first passenger delays everyone else by 5 seconds
    const firstPersonWaitTime = 5;
    
    const expectedTimeCurrent = firstPersonWaitTime + ((plane.rows - 1) * fixedMinBuffer) + ((plane.columns - 1) * plane.rows * fixedAssemblyTime) + plane.calculateWalkTime();
    
    const expectedTimeFuture = initialBufferTime1 + initialBufferTime2 + (plane.columns * (plane.rows - 1) * fixedMinBuffer) + plane.calculateWalkTime() * plane.columns;

    // Check the output of the disembarkCurrent and disembarkFuture methods
    expect(plane.disembarkCurrent()).toBeCloseTo(expectedTimeCurrent, 10);
    expect(plane.disembarkFuture()).toBeCloseTo(expectedTimeFuture, 10);
  });

  it('calculates disembarkation times correctly for a 1 row 1 column plane', () => {
    // Create a new Plane with 1 row and 1 column
    const plane = new Plane(1, 1, 3.1, 31, DEFAULT_SEED);

    // Assign a passenger with known assembly times to the seat in the plane
    const fixedAssemblyTime = 5;
    const fixedMinBuffer = 2;
    const passenger = new Passenger(true, '1C', DEFAULT_SEED);
    passenger.assemblyTimeCurrent = fixedAssemblyTime;
    passenger.assemblyTimeFuture = fixedAssemblyTime;
    passenger.minBuffer = fixedMinBuffer;
    plane.seats[0][0] = passenger;

    // Calculate the total deplaning time for the 1 row 1 column plane
    const totalDeplaningTime = fixedAssemblyTime + plane.calculateWalkTime();

    // Check the output of the disembarkCurrent method
    expect(plane.disembarkCurrent()).toBe(totalDeplaningTime);
  });
});

