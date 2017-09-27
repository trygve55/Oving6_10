package resturant.entity;

/**
 * Created by Trygve on 15.09.2017.
 */
public class Food {
    private int id;
    private int typeId;
    private String type;
    private String name;
    private String desc;
    private float price;
    private int amount;

    public Food() {
    }

    public Food(int id, int typeId, String type, String name, String desc, float price, int amount) {
        this.id = id;
        this.typeId = typeId;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.type = type;
        this.amount = amount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "Food{" +
                "id=" + id +
                ", typeId=" + typeId +
                ", type='" + type + '\'' +
                ", name='" + name + '\'' +
                ", desc='" + desc + '\'' +
                ", price=" + price +
                ", amount=" + amount +
                '}';
    }
}
