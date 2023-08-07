import Passenger from './Passenger';

class Plane {
    constructor(rows, columns, speed, rowHeight) {
        console.log(rows, columns, speed, rowHeight);
        this.rows = rows;
        this.columns = columns;
        this.seats = new Array(rows).fill(new Array(columns).fill(null));
        this.AVERAGE_WALK_SPEED_MILES_PER_HOUR = speed;
        this.AVERAGE_WALK_SPEED_MILES_PER_SECOND = this.AVERAGE_WALK_SPEED_MILES_PER_HOUR / 3600.0;
        this.AVERAGE_ROW_HEIGHT_INCHES = rowHeight;
        this.AVERAGE_ROW_HEIGHT_MILES = this.AVERAGE_ROW_HEIGHT_INCHES / 63360.0;
        this.timeSecondsToWalkPlane = this.calculateWalkTime();
    }  

    printSeats() {
        this.seats.forEach((row, i) => {
            this.arrangeMiddleOut(row).forEach(seat => {
                console.log(`${i + 1}${this.columnLabel(row.indexOf(seat))}`);
            });
        });
    }

    embark() {
        this.seats.forEach((row, i) => {
            row.forEach((_, j) => {
                const isAisleSeat = this.columnLabel(j) === 'C';
                const seatLabel = `${i + 1}${this.columnLabel(j)}`;
                this.seats[i][j] = new Passenger(isAisleSeat, seatLabel);
            });
        });
    }

    columnLabel(index) {
        return ['A', 'B', 'C', 'D', 'E', 'F'][index];
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
        
        return totalTime;
    }

    disembarkFuture() {
        let totalTime = 0;

        this.aisleColumns().forEach((column, wave) => {
            const aisle = this.seats.map(row => row[this.aisleColumns().sort().indexOf(column)]);
            const reductionFactor = 1 - wave * 0.05;
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
