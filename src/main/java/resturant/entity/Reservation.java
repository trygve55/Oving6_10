package resturant.entity;

import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Trygve on 18.09.2017.
 */
public class Reservation {
    private int id;
    private Date start;
    private Date end;
    private String forName;
    private int bordId;
    private long cardNumber;
    private int cardPin;
    private Date cardExpiryDate;
    private ArrayList<Food> foods = new ArrayList<>();

    public Reservation(int id, Date start, Date end, String forName, int bordId, long cardNumber, int cardPin, Date cardExpiryDate, ArrayList<Food> foods) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.forName = forName;
        this.bordId = bordId;
        this.cardNumber = cardNumber;
        this.cardPin = cardPin;
        this.cardExpiryDate = cardExpiryDate;
        this.foods = foods;
    }

    public Reservation() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public String getForName() {
        return forName;
    }

    public void setForName(String forName) {
        this.forName = forName;
    }

    public int getBordId() {
        return bordId;
    }

    public void setBordId(int bordId) {
        this.bordId = bordId;
    }

    public long getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(long cardNumber) {
        this.cardNumber = cardNumber;
    }

    public int getCardPin() {
        return cardPin;
    }

    public void setCardPin(int cardPin) {
        this.cardPin = cardPin;
    }

    public Date getCardExpiryDate() {
        return cardExpiryDate;
    }

    public void setCardExpiryDate(Date cardExpiryDate) {
        this.cardExpiryDate = cardExpiryDate;
    }

    public ArrayList<Food> getFoods() {
        return foods;
    }

    public void setFoods(ArrayList<Food> foods) {
        this.foods = foods;
    }

    @Override
    public String toString() {
        return "Reservation{" +
                "id=" + id +
                ", start='" + start + '\'' +
                ", end='" + end + '\'' +
                ", forName='" + forName + '\'' +
                ", bordId=" + bordId +
                ", cardNumber=" + cardNumber +
                ", cardPin=" + cardPin +
                ", cardExpiryDate='" + cardExpiryDate + '\'' +
                ", foods=" + foods +
                '}';
    }
}
