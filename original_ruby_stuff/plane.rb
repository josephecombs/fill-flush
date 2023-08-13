require_relative 'passenger'
require 'byebug'
require 'awesome_print'
require 'set'

class Plane
  attr_reader :rows, :columns, :seats, :time_seconds_to_walk_plane
  
  AVERAGE_ROW_HEIGHT_INCHES = 31
  AVERAGE_ROW_HEIGHT_MILES =  AVERAGE_ROW_HEIGHT_INCHES / 63360.0
  AVERAGE_WALK_SPEED_MILES_PER_HOUR = 3.1
  AVERAGE_WALK_SPEED_MILES_PER_SECOND = AVERAGE_WALK_SPEED_MILES_PER_HOUR / 3600.0

  def initialize(rows, columns)
    @rows = rows
    @columns = columns
    @aisle_seats = ['C', 'D']
    @seats = Array.new(rows) { Array.new(columns) }
    @time_seconds_to_walk_plane = calculate_walk_time
  end
  
  def print_seats
    @seats.each_with_index do |row, i|
      arrange_middle_out(row).each do |seat|
        puts "#{i+1}#{column_label(row.index(seat))}"
      end
    end
  end

  def embark
    # Fill the plane with passengers
    @seats.each_with_index do |row, i|
      row.each_with_index do |seat, j|
        is_aisle_seat = column_label(j) == 'C'  # Only 'C' side gets the aisle bonus
        seat_label = "#{i+1}#{column_label(j)}"
        @seats[i][j] = Passenger.new(is_aisle_seat, seat_label)
      end
    end
  end

  def disembark_current
    # Simulate deplaning in current system
    total_time = 0
    @seats.each do |row|
      middle_out_row = arrange_middle_out(row)
      middle_out_row.each_with_index do |passenger, idx|
        # if youre the first person in the middle out row, i.e. you're the (1 / width) who gets to stand, the time impact is slightly different
        if idx == 0
          # handle case where you're at front of plane:
          if total_time < passenger.assembly_time_current
            if total_time == 0
              time = passenger.assembly_time_current - total_time
            else
              time = [passenger.assembly_time_current - total_time, passenger.min_buffer].max
            end
          else
            assembly_time = passenger.assembly_time_current
            min_buffer = passenger.min_buffer
            time = [min_buffer].max
          end
        else
          assembly_time = passenger.assembly_time_current
          min_buffer = passenger.min_buffer
          time = [assembly_time, min_buffer].max          
        end
        
        total_time += time

        passenger.wait_time_seconds_current = total_time
      end
    end
    total_time
  end
    
  def disembark_future
    # Simulate deplaning in new system
    total_time = 0
    
    aisle_columns.each_with_index do |column, wave|
      aisle = @seats.map { |row| row[aisle_columns.sort.index(column)] }
      
      reduction_factor = 1 - wave * 0.05  # 5% reduction in assembly time for each new wave, because easier when fewer other people on plane
      max_assembly_time = aisle.max_by(&:assembly_time_future).assembly_time_future * reduction_factor
      total_time += max_assembly_time
      # puts aisle
      # ap"disembarking aisle: #{aisle}"
      
      aisle.each_with_index do |passenger, idx|
        #calculate the time it takes the PASSENGER to get off here
        if idx == 0 
          # if at the front of the plane, no buffer, so the time they wait is the total_time
          passenger.wait_time_seconds_future = total_time
        else
          # if not at front, they wait whatever their neighbor waited PLUS the min_buffer
          passenger.wait_time_seconds_future = aisle[idx - 1].wait_time_seconds_future + passenger.min_buffer
        end
        
        total_time += passenger.min_buffer
      end
      
      total_time += @time_seconds_to_walk_plane
    end
    total_time
  end

  private
  
  def aisle_columns
    # TODO: what sequence of column-based deplaning allows for groups to stick together best?
    # this is the actual order of flushing in each scenario - so flush c, then d, then a, then f in the 4 case
    case @columns
    when 1
      ['C']
    when 2
      ['C', 'D']
    when 3
      ['C', 'A', 'D']
    when 4
      ['C', 'D', 'A', 'F']
    when 5
      ['C', 'D', 'B', 'F', 'A']
    when 6
      ['C', 'D', 'B', 'E', 'A', 'F']
    end
  end
  
  def column_label(index)
    ('A'..'F').to_a[index]
  end
  
  def arrange_middle_out(row)
    if @columns == 1 #C
      [row[0]]
    elsif @columns == 2 #CD
      [row[0], row[1]]
    elsif @columns == 3 #CAD
      [row[0], row[1], row[2]]
    elsif @columns == 4
      [row[1], row[0], row[2], row[3]]  # CADF
    elsif @columns == 5
      [row[2], row[1], row[0], row[3], row[4]]  # CBADF
    elsif @columns == 6
      [row[2], row[1], row[0], row[3], row[4], row[5]]  # CBADEF
    end
  end
  
  def calculate_walk_time
    @rows * AVERAGE_ROW_HEIGHT_MILES / AVERAGE_WALK_SPEED_MILES_PER_SECOND
  end
end