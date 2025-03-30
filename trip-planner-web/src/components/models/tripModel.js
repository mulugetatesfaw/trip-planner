class TripModel {
    constructor(currentLocation, pickupLocation, dropoffLocation, currentCycleUsed) {
      this.current_location = currentLocation;
      this.pickup_location = pickupLocation;
      this.dropoff_location = dropoffLocation;
      this.current_cycle_used = currentCycleUsed;
    }
  
    static validate(data) {
      const { current_location, pickup_location, dropoff_location, current_cycle_used } = data;
      if (!current_location || !pickup_location || !dropoff_location) {
        throw new Error("All location fields are required.");
      }
      if (current_cycle_used < 0 || current_cycle_used > 70) {
        throw new Error("Current cycle used must be between 0 and 70 hours.");
      }
    }
  }
  
  export default TripModel;