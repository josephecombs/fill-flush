require 'rubystats'
require 'byebug'
require 'awesome_print'
require 'set'

class Passenger
  attr_reader :assembly_time_current, :assembly_time_future, :min_buffer
  attr_accessor :wait_time_seconds_current, :wait_time_seconds_future, :seat

  def initialize(is_aisle_seat, seat)
    @seat = seat
    
    # Create Normal distributions for assembly times
    normal_current = Rubystats::NormalDistribution.new(5, 1.5)  # mean = 5 seconds
    # normal_future = Rubystats::NormalDistribution.new(7, 1.5)  # mean = 7 seconds
    # normal_future = normal_current + 2 # this is tricky, just assume the passenger takes 2 seconds longer in future regime when they have to get their stuff while entire rest of aisle is getting their stuff

    random_wait = normal_current.rng
    @assembly_time_current = is_aisle_seat ? 0 : [random_wait, 0].max  # Time to assemble belongings in current system
    @assembly_time_future = [random_wait, 0].max + 2  # Time to assemble belongings in new system
    
    buffer_future = Rubystats::NormalDistribution.new(2) # mean = 2 seconds
    @min_buffer = [buffer_future.rng, 0].max  # Minimum buffer time to place between themselves and a passenger ahead
    
    @wait_time_seconds_current = 0
    @wait_time_seconds_future = 0
  end
end
