import Passenger from './Passenger';

class Plane {
    constructor(rows, columns, speed, rowHeight, seed) {
        this.rows = rows;
        this.columns = columns;
        this.seats = Array.from({ length: rows }, () => new Array(columns).fill(null));
        this.AVERAGE_WALK_SPEED_MILES_PER_HOUR = speed;
        this.AVERAGE_WALK_SPEED_MILES_PER_SECOND = this.AVERAGE_WALK_SPEED_MILES_PER_HOUR / 3600.0;
        this.AVERAGE_WALK_SPEED_INCHES_PER_SECOND = this.AVERAGE_WALK_SPEED_MILES_PER_SECOND * 63360;
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
                const seatLabel = `${i + 1}${this.columnLabel(j)}`;
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

    // calculateWalkTime() {
    //     return this.rows * this.AVERAGE_ROW_HEIGHT_MILES / this.AVERAGE_WALK_SPEED_MILES_PER_SECOND;
    // }

    calculateWalkTime() {
        return this.AVERAGE_ROW_HEIGHT_INCHES * this.rows / this.AVERAGE_WALK_SPEED_INCHES_PER_SECOND;
    }
    
    disembarkCurrent() {
        let totalTime = 0;
        this.seats.forEach((row, rowIdx) => {
            const middleOutRow = this.arrangeMiddleOut(row);
            middleOutRow.forEach((passenger, idx) => {
                const assemblyTime = passenger.assemblyTimeCurrent;
                const minBuffer = passenger.minBuffer;

                // set the tracker stuff
                passenger.statusQuoTracker.seatedStart = 0;

                if (passenger.seat.indexOf('C') >= 0) {
                    passenger.statusQuoTracker.seatedEnd = 0;
                    passenger.statusQuoTracker.gatheringBelongingsStart = 0;
                } else {
                    passenger.statusQuoTracker.seatedEnd = totalTime;
                    passenger.statusQuoTracker.gatheringBelongingsStart = totalTime;
                }

                passenger.statusQuoTracker.gatheringBelongingsEnd = passenger.statusQuoTracker.gatheringBelongingsStart + passenger.assemblyTimeCurrent;

                passenger.statusQuoTracker.standingStoppedStart = passenger.statusQuoTracker.gatheringBelongingsEnd
                // the very first person off the plane does not wait minBuffer for anyone in front to leave
                if (idx === 0 && rowIdx === 0) {
                    passenger.statusQuoTracker.standingStoppedEnd = passenger.statusQuoTracker.standingStoppedStart;
                    passenger.statusQuoTracker.standingWaitingStart = passenger.statusQuoTracker.standingStoppedEnd;
                    passenger.statusQuoTracker.standingWaitingEnd = passenger.statusQuoTracker.standingWaitingStart;
                } else if (passenger.seat.indexOf('C') >= 0) { 
                    // account for the fact that the aisle has been standing this whole time, so they wait the minBuffer
                    passenger.statusQuoTracker.standingStoppedEnd = totalTime;
                    passenger.statusQuoTracker.standingWaitingStart = passenger.statusQuoTracker.standingStoppedEnd;
                    passenger.statusQuoTracker.standingWaitingEnd = passenger.statusQuoTracker.standingWaitingStart + passenger.minBuffer;
                } else {
                    passenger.statusQuoTracker.standingStoppedEnd = passenger.statusQuoTracker.standingStoppedStart;
                    passenger.statusQuoTracker.standingWaitingStart = passenger.statusQuoTracker.standingStoppedEnd;
                    // look up the passenger who deplaned before within this row, in rare cases your gather belongings step will be faster than min buffer, so if there's a delta wait until the buffer is met.

                    let precedingNeighbor = middleOutRow[idx - 1];
                    passenger.statusQuoTracker.standingWaitingEnd = passenger.statusQuoTracker.standingWaitingStart + Math.max(passenger.minBuffer - precedingNeighbor.assemblyTimeCurrent, 0);
                }
                
                passenger.statusQuoTracker.walkingStart = passenger.statusQuoTracker.standingWaitingEnd;
                passenger.statusQuoTracker.walkingEnd = passenger.statusQuoTracker.walkingStart + this.timeSecondsToWalkPlane * (rowIdx + 1) / this.rows;
                
                totalTime = passenger.statusQuoTracker.walkingStart; //if this is the last member of a row, this will be used to establish standingStoppedEnd of the first aisle member of the next row
                passenger.waitTimeSecondsCurrent = passenger.statusQuoTracker.walkingEnd;
            });
        });
        
        //must finally consider the amount of time it takes the last person on the plane to walk the plane
        totalTime += this.timeSecondsToWalkPlane;

        let maxWalkEndFromTrackers = 0;

        this.seats.forEach((row) => {
            row.forEach((passenger) => {
                // ... existing code for processing passengers ...

                // Update the maximum walk end time if the current passenger's walk end time is greater
                if (passenger.statusQuoTracker.walkingEnd > maxWalkEndFromTrackers) {
                    maxWalkEndFromTrackers = passenger.statusQuoTracker.walkingEnd;
                }
            });
        });

        return maxWalkEndFromTrackers;
    }

    disembarkFuture() {
        let totalTime = 0;

        this.aisleColumns().forEach((column, wave) => {
            const aisle = this.seats.map(row => row[this.aisleColumns().sort().indexOf(column)]);
            const reductionFactor = 1 - wave * this.assemblyTimeWaveReductionFactor;
            const maxAssemblyTime = aisle.reduce((max, passenger) => Math.max(max, passenger.assemblyTimeFuture), 0) * reductionFactor;

            aisle.forEach((passenger, idx) => {
                if (wave === 0) {
                    passenger.fillAndFlushTracker.seatedStart = 0;
                    passenger.fillAndFlushTracker.seatedEnd = 0;    
                } else {
                    passenger.fillAndFlushTracker.seatedStart = 0;
                    passenger.fillAndFlushTracker.seatedEnd = totalTime;
                }

                passenger.fillAndFlushTracker.gatheringBelongingsStart = passenger.fillAndFlushTracker.seatedEnd;
                passenger.fillAndFlushTracker.gatheringBelongingsEnd = passenger.fillAndFlushTracker.gatheringBelongingsStart + passenger.assemblyTimeFuture * reductionFactor;

                passenger.fillAndFlushTracker.standingStoppedStart = passenger.fillAndFlushTracker.gatheringBelongingsEnd;
                if (idx === 0) {
                    passenger.fillAndFlushTracker.standingStoppedEnd = passenger.fillAndFlushTracker.standingStoppedStart + (maxAssemblyTime - (passenger.assemblyTimeFuture * reductionFactor));
                    passenger.fillAndFlushTracker.standingWaitingStart = passenger.fillAndFlushTracker.standingStoppedEnd;
                    passenger.fillAndFlushTracker.standingWaitingEnd = passenger.fillAndFlushTracker.standingWaitingStart;
                } else {
                    passenger.fillAndFlushTracker.standingStoppedEnd = aisle[idx - 1].fillAndFlushTracker.walkingStart;
                    passenger.fillAndFlushTracker.standingWaitingStart = passenger.fillAndFlushTracker.standingStoppedEnd;
                    passenger.fillAndFlushTracker.standingWaitingEnd = passenger.fillAndFlushTracker.standingWaitingStart + passenger.minBuffer;
                }

                passenger.fillAndFlushTracker.walkingStart = passenger.fillAndFlushTracker.standingWaitingEnd;
                passenger.fillAndFlushTracker.walkingEnd = passenger.fillAndFlushTracker.walkingStart + this.timeSecondsToWalkPlane * (idx + 1) / this.rows;          
                passenger.waitTimeSecondsFuture = passenger.fillAndFlushTracker.walkingEnd
            });

            totalTime = aisle[this.rows - 1].fillAndFlushTracker.walkingEnd;
        });

        let maxWalkEndFromTrackers = 0;
        this.seats.forEach((row) => {
            row.forEach((passenger) => {
                // ... existing code for processing passengers ...

                // Update the maximum walk end time if the current passenger's walk end time is greater
                if (passenger.fillAndFlushTracker.walkingEnd > maxWalkEndFromTrackers) {
                    maxWalkEndFromTrackers = passenger.fillAndFlushTracker.walkingEnd;
                }
            });
        });

        return maxWalkEndFromTrackers;
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
