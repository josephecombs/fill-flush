import Plane from './Plane';
import Passenger from './Passenger';

describe('Plane', () => {
  it('calculates disembarkation times correctly for a single-column plane', () => {
    // Create a new Plane with 30 rows and 1 column
    const plane = new Plane(30, 1, 2.8, 31);

    // Assign passengers with known assembly times to each seat in the plane
    const fixedAssemblyTime = 5;
    const fixedMinBuffer = 2;
    
    for (let i = 0; i < plane.rows; i++) {
      // Create a new Passenger with a known assembly time
      const passenger = new Passenger(true, `${i+1}C`);
      passenger.assemblyTimeCurrent = fixedAssemblyTime;
      passenger.assemblyTimeFuture = fixedAssemblyTime;
      passenger.minBuffer = fixedMinBuffer;

      // Assign the passenger to the seat in the plane
      plane.seats[i][0] = passenger;
    }

    // Check the output of the disembarkCurrent method
    
    //the wait for the first person on the plane in this situation will be zero
    //assume the whole column is standing and has gotten their stuff ready while jetbridge is getting ready
    const firstPersonWaitTime = 0;
    
    expect(plane.disembarkCurrent()).toBe(
      firstPersonWaitTime + ((plane.rows - 1) * fixedMinBuffer) + plane.calculateWalkTime()
    );

    // Calculate the initial buffer time as the max assemblyTimeFuture of the people in the aisle
    const initialBufferTime = Math.max(...plane.seats.map(row => row[0].assemblyTimeFuture));

    // Check the output of the disembarkFuture method
    
    //likely falsely passing
    expect(plane.disembarkFuture()).toBe(
      initialBufferTime + (plane.rows * fixedMinBuffer) + plane.calculateWalkTime()
    ); 
  });
});
