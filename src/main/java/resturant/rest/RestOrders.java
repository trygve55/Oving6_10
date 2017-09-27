package resturant.rest;

/**
 * Created by Trygve on 18.09.2017.
 */

import resturant.dataProcess.ResturantControl;
import resturant.entity.Order;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.time.*;
import java.util.Collection;

@Path("/orders/")
public class RestOrders {

    @GET
    @Path("/{tableId}/{timeDate}/")
    @Produces(MediaType.APPLICATION_JSON)
    public Order getOrder(@PathParam("tableId") String tableId, @PathParam("timeDate") String timeDate) {
        return ResturantControl.getOrder(Integer.parseInt(tableId), LocalDateTime.ofInstant(ZonedDateTime.parse(timeDate).toInstant(), ZoneId.systemDefault()));
    }

    @GET
    @Path("/{timeDate}/")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Order> getOrders(@PathParam("timeDate") String timeDate) {
        return ResturantControl.getOrders(LocalDateTime.ofInstant(ZonedDateTime.parse(timeDate).toInstant(), ZoneId.systemDefault()));
    }
}

