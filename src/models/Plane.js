import Passenger from './Passenger';

class Plane {
    constructor(rows, columns, speed, rowHeight, seed) {
        this.rows = rows;
        this.columns = columns;
        this.seats = Array.from({ length: rows }, () => new Array(columns).fill(null));
        this.AVERAGE_WALK_SPEED_MILES_PER_HOUR = speed;
        this.AVERAGE_WALK_SPEED_MILES_PER_SECOND = this.AVERAGE_WALK_SPEED_MILES_PER_HOUR / 3600.0;
        this.AVERAGE_ROW_HEIGHT_INCHES = rowHeight;
        this.AVERAGE_ROW_HEIGHT_MILES = this.AVERAGE_ROW_HEIGHT_INCHES / 63360.0;
        this.timeSecondsToWalkPlane = this.calculateWalkTime();
        this.assemblyTimeWaveReductionFactor = 0.05;
        this.seatsHash = {}; //to let the animations look up their passengers
        this.seed = seed;
    } 

    printSeats() {
        this.seats.forEach((row, i) => {
            this.arrangeMiddleOut(row).forEach(seat => {
            });
        });
    }

    embark() {
        let count = 0;
        this.seats.forEach((row, i) => {
            row.forEach((_, j) => {
                const isAisleSeat = this.columnLabel(j) === 'C';
                const seatLabel = `${this.columnLabel(j)}${i + 1}`;
                // we can take 10 random samples inside Passenger without overlap. not sure if this is necessary or not. pretty low cost.
                let curPassenger = new Passenger(isAisleSeat, seatLabel, this.seed + (10 * count));
                this.seats[i][j] = curPassenger;
                this.seatsHash[seatLabel] = curPassenger;
                count += 1;
            });
        });

        // this.putSeatsIntoSeatsHash();
    }

    putSeatsIntoSeatsHash() {
        this.seats.forEach((row, i) => {
            row.forEach((passenger, j) => {
                const seatLabel = `${i + 1}${this.columnLabel(j)}`;

                this.seatsHash[seatLabel] = passenger;
            });
        });
    }

    columnLabel(index) {
        switch (this.columns) {
            case 1: return ['C'][index];
            case 2: return ['C', 'D'][index];
            case 3: return ['A', 'C', 'D'][index];
            case 4: return ['A', 'C', 'D', 'F'][index];
            case 5: return ['A', 'B', 'C', 'D', 'F'][index];
            case 6: return ['A', 'B', 'C', 'D', 'E', 'F'][index];
            default: return null;
        }
    }

    arrangeMiddleOut(row) {
        switch (this.columns) {
            case 1: return [row[0]];
            case 2: return [row[0], row[1]];
            case 3: return [row[0], row[1], row[2]];
            case 4: return [row[1], row[0], row[2], row[3]];
            case 5: return [row[2], row[1], row[0], row[3], row[4]];
            case 6: return [row[2], row[1], row[0], row[3], row[4], row[5]];
        }
    }

    calculateWalkTime() {
        return this.rows * this.AVERAGE_ROW_HEIGHT_MILES / this.AVERAGE_WALK_SPEED_MILES_PER_SECOND;
    }
    
    disembarkCurrent() {
        let totalTime = 0;
        this.seats.forEach((row, rowIdx) => {
            const middleOutRow = this.arrangeMiddleOut(row);
            middleOutRow.forEach((passenger, idx) => {
                const assemblyTime = passenger.assemblyTimeCurrent;
                const minBuffer = passenger.minBuffer;
                let time;
                
                if (idx === 0) {
                    if (rowIdx === 0) {
                        // the very first person on the plane waits 0 seconds to get off
                        time = 0;
                    } else {
                        time = minBuffer;
                    }
                } else {
                    time = Math.max(assemblyTime, minBuffer);
                }

                totalTime += time;
                passenger.waitTimeSecondsCurrent = totalTime;
            });
        });
        
        //must finally consider the amount of time it takes the last person on the plane to walk the plane
        totalTime += this.timeSecondsToWalkPlane;

        // this.putSeatsIntoSeatsHash();
        
        return totalTime;
    }

    disembarkFuture() {
        let totalTime = 0;

        this.aisleColumns().forEach((column, wave) => {
            const aisle = this.seats.map(row => row[this.aisleColumns().sort().indexOf(column)]);
            const reductionFactor = 1 - wave * this.assemblyTimeWaveReductionFactor;
            const maxAssemblyTime = aisle.reduce((max, passenger) => Math.max(max, passenger.assemblyTimeFuture), 0) * reductionFactor;
            
            totalTime += maxAssemblyTime;

            aisle.forEach((passenger, idx) => {
                if (idx === 0) {
                    passenger.waitTimeSecondsFuture = totalTime;
                } else {
                    passenger.waitTimeSecondsFuture = aisle[idx - 1].waitTimeSecondsFuture + passenger.minBuffer;
                }
                
                if (idx === 0) {
                  // the first person in the aisle does not maintain a buffer
                  totalTime += 0;
                } else {
                  totalTime += passenger.minBuffer;
                }
            });

            totalTime += this.timeSecondsToWalkPlane;
        });

        // this.putSeatsIntoSeatsHash();

        return totalTime;
    }

    aisleColumns() {
        switch (this.columns) {
            case 1: return ['C'];
            case 2: return ['C', 'D'];
            case 3: return ['C', 'A', 'D'];
            case 4: return ['C', 'D', 'A', 'F'];
            case 5: return ['C', 'D', 'B', 'F', 'A'];
            case 6: return ['C', 'D', 'B', 'E', 'A', 'F'];
            default: return [];
        }
    }
}

export default Plane;
