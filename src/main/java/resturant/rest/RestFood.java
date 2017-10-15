package resturant.rest;

import resturant.dataProcess.ResturantControl;
import resturant.entity.Food;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

/**
 * Created by Trygve on 15.09.2017.
 */
@Path("/food/")
public class RestFood {

    @GET
    @Path("/{foodId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Food getFood(@PathParam("foodId") String foodId) {
        return ResturantControl.getFood(Integer.parseInt(foodId));
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Food> getFoods() {
        return ResturantControl.getFoods();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addFood(Food food) {
        ResturantControl.addFood(food);
    }

    @DELETE
    @Path("/{foodId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void removeFood(@PathParam("foodId") String foodId) {
        ResturantControl.removeFood(Integer.parseInt(foodId));
    }

    @GET
    @Path("/types/")
    @Produces(MediaType.TEXT_PLAIN)
    public String getFoodTypes() {
        return "";
    }
}
