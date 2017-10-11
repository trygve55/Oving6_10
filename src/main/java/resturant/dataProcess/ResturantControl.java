package resturant.dataProcess;

import resturant.entity.Food;
import resturant.entity.Order;
import resturant.entity.Reservation;
import resturant.entity.Table;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;

/**
 * Created by Trygve on 26.09.2017.
 */
public class ResturantControl {
    private static Database database = Database.getDatabase();

    public static Collection<Order> getOrders(LocalDateTime localDateTime) {

        ArrayList<Reservation> reservations = database.getReservations(localDateTime);
        ArrayList<Order> orders = new ArrayList<Order>();

        for (Reservation reservation : reservations) {
            orders.add(processOrder(reservation, localDateTime));
        }

        return orders;
    }

    private static Order processOrder(Reservation reservation, LocalDateTime localDateTime) {

        ArrayList<Food> foods = new ArrayList<>();
        LocalDateTime start = reservation.getStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        boolean[] foodTypes = new boolean[2];

        boolean[] timeSlots = new boolean[]{
                localDateTime.isAfter(start.minusSeconds(1))&& localDateTime.isBefore(start.plusMinutes(30).minusSeconds(1)),
                localDateTime.isAfter(start.plusMinutes(30).minusSeconds(1)) && localDateTime.isBefore(start.plusMinutes(60).minusSeconds(1)),
                localDateTime.isAfter(start.plusMinutes(60).minusSeconds(1)) && localDateTime.isBefore(start.plusMinutes(90).minusSeconds(1))
        };

        for (Food food :reservation.getFoods()) {
            if (food.getTypeId() < 2) foodTypes[food.getTypeId()] = true;
        }

        for (Food food :reservation.getFoods()) {
            if (food.getTypeId() == 1 && ((foodTypes[0] && timeSlots[1]) || (!foodTypes[0] && timeSlots[0]))) foods.add(food);
            else if (food.getTypeId() == 2 && ((!foodTypes[0] && !foodTypes[1] && timeSlots[0]) || (!foodTypes[0] && foodTypes[1] && timeSlots[1]) || (foodTypes[0] && !foodTypes[1] && timeSlots[1]) || (foodTypes[0] && foodTypes[1] && timeSlots[2]))) foods.add(food);
            else if ((food.getTypeId() == 0 || food.getTypeId() == 3) && timeSlots[0]) foods.add(food);
        }

        Order order = new Order();
        order.setFoods(foods);
        order.setBordId(reservation.getBordId());

        return order;
    }

    public static Order getOrder(int tableId, LocalDateTime localDateTime) {

        Reservation reservation = database.getReservationAtBord(tableId, localDateTime);
        if (reservation == null) return null;
        ArrayList<Food> foods = new ArrayList<>();
        LocalDateTime start = reservation.getStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        for (int i = 0; i < reservation.getFoods().size();i++) {
            Food food = reservation.getFoods().get(i);
            if (food.getTypeId() == 1 && localDateTime.isAfter(start.plusMinutes(30)) && localDateTime.isBefore(start.plusMinutes(60))) foods.add(food);
            else if (food.getTypeId() == 2 && localDateTime.isAfter(start.plusHours(1)) && localDateTime.isBefore(start.plusMinutes(90))) foods.add(food);
            else if (localDateTime.isAfter(start)&& localDateTime.isBefore(start.plusMinutes(30))) foods.add(food);
        }

        Order order = new Order();
        order.setFoods(foods);
        order.setBordId(tableId);

        return order;
    }

    public static Reservation getReservation(int reservationId) {
        return database.getReservation(reservationId);
    }

    public static Collection<Reservation> getReservations() {
        return database.getReservations();
    }

    public static void addReservation(Reservation reservation) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(reservation.getStart());
        calendar.add(Calendar.MINUTE, 89);
        reservation.setEnd(calendar.getTime());

        if (reservation.getStart().toInstant().isBefore(Instant.now())) throw new IllegalArgumentException("You can not time travel.");
        if (!database.isReservationsPossible(reservation)) throw new IllegalArgumentException("A reservation already exists on this table and time.");
        if (reservation.getFoods().size() == 0) throw new IllegalArgumentException("An reservation needs food");

        for (Food food: reservation.getFoods()) {
            if (food.getAmount() == 0) {
                throw new IllegalArgumentException("An reservation needs food");
            }
        }

        database.addReservation(reservation);
    }

    public static void removeReservation(int reservationId) {
        database.removeReservation(reservationId);
    }

    public static Food getFood(int foodId) {
        return database.getFood(foodId);
    }

    public static Collection<Food> getFoods() {
        return database.getFoods();
    }

    public static void addFood(Food food) {

        if (food.getPrice() < 0) throw new IllegalArgumentException("Price can not be negative.");
        if (food.getAmount() != 0) throw new IllegalArgumentException("Added food need to be of amount 0.");
        if (food.getName().length() == 0) throw new IllegalArgumentException("Food needs to have a name.");
        if (food.getTypeId() < 0 && food.getTypeId() > 3) throw new IllegalArgumentException("Food type needs to be 0-3");

        database.addFood(food);
    }

    public static void removeFood(int foodId) {
        database.removeFood(foodId);
    }

    public static Table getTable(int tableId) {
        return database.getTable(tableId);
    }

    public static Collection<Table> getTables() {
        return database.getTables();
    }

    public static void addTable(Table table) {

        if (table.getSize() <= 0) throw new IllegalArgumentException("Size of table need to be at least 1.");

        database.addTable(table);
    }

    public static void removeTable(int tableId) {
        database.removeTable(tableId);
    }

    public static void changeTable(int tableId, int newSize){ database.changeTable(tableId, newSize); }

    public static Collection<Table> getFreeTables(LocalDateTime localDateTime, int minSize) {
        return database.getFreeTables(localDateTime, minSize);
    }

}
