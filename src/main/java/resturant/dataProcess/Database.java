package resturant.dataProcess;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import resturant.entity.Food;
import resturant.entity.Reservation;
import resturant.entity.Table;

import java.sql.*;
import java.time.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

/**
 * Created by Trygve on 15.09.2017.
 */
public class Database {
    MysqlDataSource dataSource;
    private static Database database = new Database("hybel.ddns.net", "resturantdb", "resturantuser", "resturant");

    public Database(String serverURL, String databaseName, String username, String password) {
        dataSource = new MysqlDataSource();
        dataSource.setDatabaseName(databaseName);
        dataSource.setServerName(serverURL);
        dataSource.setUser(username);
        dataSource.setPassword(password);
    }

    public static Database getDatabase() {
        return database;
    }

    public Collection<Table> getTables() {
        Connection connection = null;
        Statement statement = null;
        ResultSet rs = null;

        ArrayList<Table> tables = new ArrayList<>();

        try {
            connection = dataSource.getConnection();
            statement = connection.createStatement();
            rs = statement.executeQuery("SELECT * FROM Bord");

            while (rs.next()) {
                tables.add(new Table(rs.getInt("bord_id"),rs.getInt("bord_size")));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return tables;
    }

    public Collection<Table> getFreeTables() {
        Connection connection = null;
        Statement statement = null;
        ResultSet rs = null;

        ArrayList<Table> tables = new ArrayList<>();

        try {
            connection = dataSource.getConnection();
            statement = connection.createStatement();
            rs = statement.executeQuery("SELECT * FROM Bord WHERE bord_id NOT IN (SELECT bord_id FROM Reservation WHERE CURRENT_TIMESTAMP BETWEEN start_timestamp AND end_timestamp)");

            while (rs.next()) {
                tables.add(new Table(rs.getInt("bord_id"),rs.getInt("bord_size")));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return tables;
    }

    public Collection<Table> getFreeTables(LocalDateTime dateTime, int minSize) {
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet rs = null;

        ArrayList<Table> tables = new ArrayList<>();

        try {
            connection = dataSource.getConnection();

            statement = connection.prepareStatement("SELECT * FROM Bord WHERE bord_size >= ? AND bord_id NOT IN (SELECT bord_id FROM Reservation WHERE ? BETWEEN start_timestamp AND end_timestamp)");
            statement.setInt(1, minSize);
            statement.setTimestamp(2, java.sql.Timestamp.valueOf(dateTime));
            rs = statement.executeQuery();

            while (rs.next()) {
                tables.add(new Table(rs.getInt("bord_id"),rs.getInt("bord_size")));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return tables;
    }

    public Table getTable(int bord_id) {

        Table table = null;
        Connection connection = null;
        Statement statement = null;
        ResultSet rs = null;

        try {
            connection = dataSource.getConnection();
            statement = connection.createStatement();
            rs = statement.executeQuery("SELECT * FROM Bord WHERE bord_id=" + bord_id+ ";");

            if (rs.next()) table = new Table(rs.getInt("bord_id"),rs.getInt("bord_size"));

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return table;
    }

    public void addTable(Table table) {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("INSERT INTO Bord(bord_size) VALUES (?);");
            ps.setInt(1, table.getSize());
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void removeTable(int bord_id) {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("DELETE FROM Bord WHERE bord_id=?;");
            ps.setInt(1, bord_id);
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public Collection<Food> getFoods() {
        Connection connection = null;
        Statement statement = null;
        ResultSet rs = null;

        ArrayList<Food> foods = new ArrayList<>();

        try {
            connection = dataSource.getConnection();
            statement = connection.createStatement();
            rs = statement.executeQuery("SELECT * FROM Foods LEFT JOIN Food_Type ON Foods.food_type_id=Food_Type.food_type_id;");

            while (rs.next()) {
                foods.add(new Food(rs.getInt("food_id"),rs.getInt("food_type_id"),rs.getString("food_type_name"), rs.getString("food_name"), rs.getString("food_desc"), rs.getFloat("food_price"), 0));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return foods;
    }

    public Food getFood(int foodId) {

        Food food = null;
        Connection connection = null;
        Statement statement = null;
        ResultSet rs = null;

        try {
            connection = dataSource.getConnection();
            statement = connection.createStatement();
            rs = statement.executeQuery("SELECT * FROM Foods LEFT JOIN Food_Type ON Foods.food_type_id=Food_Type.food_type_id WHERE food_id=" + foodId+ ";");

            if (rs.next()) food = new Food(rs.getInt("food_id"),rs.getInt("food_type_id"),rs.getString("food_type_name"), rs.getString("food_name"), rs.getString("food_desc"), rs.getFloat("food_price"), 0);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return food;
    }

    public void addFood(Food food) {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("INSERT INTO Foods(food_type_id, food_name, food_desc, food_price) VALUES (?, ?, ?, ?);");
            ps.setInt(1, food.getTypeId());
            ps.setString(2, food.getName());
            ps.setString(3, food.getDesc());
            ps.setFloat(4, food.getPrice());
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void removeFood(int food_id) {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("DELETE FROM Foods WHERE food_id=?;");
            ps.setInt(1, food_id);
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public ArrayList<Reservation> getReservations() {
        ArrayList<Reservation> reservations = new ArrayList<>();

        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet rs = null;

        try {
            connection = dataSource.getConnection();

            statement = connection.prepareStatement("SELECT * \n" +
                    "FROM Reservation \n" +
                    "LEFT JOIN Food_Reservation ON Reservation.reservation_id=Food_Reservation.reservation_id \n" +
                    "LEFT JOIN Foods ON Food_Reservation.food_id=Foods.food_id \n" +
                    "LEFT JOIN Food_Type ON Foods.food_type_id=Food_Type.food_type_id\n" +
                    "ORDER BY start_timestamp;");
            rs = statement.executeQuery();

            while (rs.next()) {


                int reservationIndex = -1;
                for (int i = 0; i < reservations.size();i++) {
                    if (rs.getInt("reservation_id") == reservations.get(i).getId()) {
                        reservationIndex = i;
                    }
                }

                if (reservationIndex == -1) {
                    reservations.add(new Reservation(
                            rs.getInt("reservation_id"),
                            rs.getTimestamp("start_timestamp"),
                            rs.getTimestamp("end_timestamp"),
                            rs.getString("for_name"),
                            rs.getInt("bord_id"),
                            rs.getLong("card_number"),
                            rs.getInt("card_pin"),
                            new Date(rs.getDate("card_expiry_date").getTime()),
                            new ArrayList<Food>()));
                    reservationIndex = reservations.size() - 1;
                }

                if (rs.getString("food_name") != null) {
                    reservations.get(reservationIndex).getFoods().add(new Food(
                            rs.getInt("food_id"),
                            rs.getInt("food_type_id"),
                            rs.getString("food_type_name"),
                            rs.getString("food_name"),
                            rs.getString("food_desc"),
                            rs.getFloat("food_price"),
                            rs.getInt("food_amount"))
                    );
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return reservations;
    }

    public Reservation getReservation(int reservation_id) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        Reservation reservation = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("SELECT * FROM Reservation WHERE reservation_id=?;");
            ps.setInt(1, reservation_id);
            rs = ps.executeQuery();
            if (rs.next()) {
                reservation = new Reservation(
                rs.getInt("reservation_id"),
                rs.getTimestamp("start_timestamp"),
                rs.getTimestamp("end_timestamp"),
                rs.getString("for_name"),
                rs.getInt("bord_id"),
                rs.getLong("card_number"),
                rs.getInt("card_pin"),
                new Date(rs.getDate("card_expiry_date").getTime()),
                null);
            }
            rs.close();
            ps.close();

            ps = connection.prepareStatement("SELECT * FROM Food_Reservation LEFT JOIN Foods ON Food_Reservation.food_id=Foods.food_id LEFT JOIN Food_Type ON Foods.food_type_id=Food_Type.food_type_id WHERE reservation_id=?;");
            ps.setInt(1, reservation_id);
            rs = ps.executeQuery();

            ArrayList<Food> foods = new ArrayList<>();
            while (rs.next()) foods.add(new Food(
                    rs.getInt("food_id"),
                    rs.getInt("food_type_id"),
                    rs.getString("food_type_name"),
                    rs.getString("food_name"),
                    rs.getString("food_desc"),
                    rs.getFloat("food_price"),
                    rs.getInt("food_amount"))
            );
            reservation.setFoods(foods);

            rs.close();
            ps.close();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return reservation;
    }

    public void addReservation(Reservation reservation) {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("INSERT INTO  Reservation(start_timestamp, end_timestamp, for_name, bord_id, card_number, card_pin, card_expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?);", Statement.RETURN_GENERATED_KEYS);
            ps.setTimestamp(1, new java.sql.Timestamp(reservation.getStart().getTime()));
            ps.setTimestamp(2, new java.sql.Timestamp(reservation.getEnd().getTime()));
            ps.setString(3, reservation.getForName() );
            ps.setInt(4, reservation.getBordId() );
            ps.setLong(5, reservation.getCardNumber() );
            ps.setInt(6, reservation.getCardPin() );
            ps.setDate(7, new java.sql.Date(reservation.getCardExpiryDate().getTime()));
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            rs.next();
            reservation.setId(rs.getInt(1));
            rs.close();
            ps.close();


            ArrayList<Food> foods = reservation.getFoods();
            for (int i = 0; i < foods.size();i++) {
                ps = connection.prepareStatement("INSERT INTO Food_Reservation(reservation_id, food_id, food_amount) VALUES (?, ?, ?);");
                ps.setInt(1, reservation.getId());
                ps.setInt(2, foods.get(i).getId());
                ps.setInt(3, foods.get(i).getAmount());
                ps.executeUpdate();
                ps.close();
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void removeReservation(int reservation_id) {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("DELETE FROM Reservation WHERE reservation_id=?;");
            ps.setInt(1, reservation_id);
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public Reservation getReservationAtBord(int bordId, LocalDateTime localDateTime) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        Reservation reservation = null;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("SELECT reservation_id FROM Reservation WHERE ? BETWEEN start_timestamp AND end_timestamp AND bord_id=?;");
            ps.setTimestamp(1, java.sql.Timestamp.valueOf(localDateTime));
            ps.setInt(2, bordId);
            rs = ps.executeQuery();

            if (rs.next()) {
                reservation = database.getReservation(rs.getInt(1));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return reservation;
    }

    public ArrayList<Reservation> getReservations(LocalDateTime localDateTime) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        ArrayList<Reservation> reservations = new ArrayList<Reservation>();

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("SELECT reservation_id FROM Reservation WHERE ? BETWEEN start_timestamp AND end_timestamp");
            ps.setTimestamp(1, java.sql.Timestamp.valueOf(localDateTime));
            rs = ps.executeQuery();

            while (rs.next()) {
                reservations.add(database.getReservation(rs.getInt(1)));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return reservations;
    }

    public boolean isReservationsPossible(Reservation reservation) {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        boolean isPossible = true;

        try {
            connection = dataSource.getConnection();
            ps = connection.prepareStatement("SELECT reservation_id FROM Reservation WHERE bord_id=? AND ? BETWEEN start_timestamp AND end_timestamp");
            ps.setInt(1, reservation.getBordId());
            ps.setTimestamp(2, new java.sql.Timestamp(reservation.getStart().getTime()));
            rs = ps.executeQuery();

            if (rs.next()) isPossible = false;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (ps != null) ps.close();
                if (connection != null) connection.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return isPossible;
    }

    public static void main(String[] args) throws Exception {
        Database database = new Database("hybel.ddns.net", "resturantdb", "resturantuser", "resturant");

        ArrayList<Reservation> reservations = database.getReservations();

        for (int i = 0;i < reservations.size();i++) {
            System.out.println(reservations.get(i));
        }
    }
}
