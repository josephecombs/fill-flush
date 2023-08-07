require_relative 'plane'
require 'byebug'
require 'awesome_print'
require 'set'

# Create a plane
plane = Plane.new(60, 6)  # Change these values to simulate different plane sizes

# Embark passengers
plane.embark

# Print seats
# plane.print_seats

# Simulate current deplaning method
time_current = plane.disembark_current
minutes_current, seconds_current = time_current.divmod(60)

puts "simulating a #{plane.rows} row, #{plane.columns} column plane"
puts "Time to deplane status quo: #{minutes_current} minutes #{seconds_current.round} seconds"

# Simulate future deplaning method
time_future = plane.disembark_future
minutes_future, seconds_future = time_future.divmod(60)
puts "Time to deplane using FILL AND FLUSH method: #{minutes_future} minutes #{seconds_future.round} seconds"

winners = []
losers = []

plane.seats.flatten.each do |passenger|
  time_difference = passenger.wait_time_seconds_future - passenger.wait_time_seconds_current
  if time_difference > 0
    losers << {passenger: passenger, time_difference: time_difference}
  else
    winners << {passenger: passenger, time_difference: -time_difference}
  end
end

puts "\n#{losers.length} Passengers who wait longer under the new regime:"
losers.sort_by {|x| x[:time_difference]}.reverse.each_with_index do |loser, idx|
  next if idx > 10
  puts "Passenger at seat #{loser[:passenger].seat}: #{loser[:time_difference].round(2)} seconds longer"
end

puts "\n#{winners.length} Passengers who benefit under the new regime:"
winners.sort_by {|x| x[:time_difference]}.reverse.each_with_index do |winner, idx|
  next if idx > 10
  puts "Passenger at seat #{winner[:passenger].seat}: #{winner[:time_difference].round(2)} seconds shorter"
end

# https://www.eldo.co/how-long-does-it-take-to-exit-an-airplane.html