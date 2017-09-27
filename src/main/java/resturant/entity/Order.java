package resturant.entity;

import java.util.ArrayList;

/**
 * Created by Trygve on 20.09.2017.
 */
public class Order {
    private ArrayList<Food> foods;
    private int bordId;

    public ArrayList<Food> getFoods() {
        return foods;
    }

    public void setFoods(ArrayList<Food> foods) {
        this.foods = foods;
    }

    public int getBordId() {
        return bordId;
    }

    public void setBordId(int bordId) {
        this.bordId = bordId;
    }
}
