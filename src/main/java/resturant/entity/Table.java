package resturant.entity;

/**
 * Created by Trygve on 15.09.2017.
 */
public class Table {
    private int id;
    private int size;

    public Table() {
    }

    public Table(int id, int size) {
        this.id = id;
        this.size = size;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
