package resturant.rest;

import resturant.dataProcess.ResturantControl;
import resturant.entity.Table;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collection;

/**
 * Created by Trygve on 15.09.2017.
 */

@Path("/table/")
public class RestTables {

    @GET
    @Path("/{tableId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Table getBord(@PathParam("tableId") String tableId) {
        return ResturantControl.getTable(Integer.parseInt(tableId));
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Table> getBord() {
        return ResturantControl.getTables();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addBord(Table table) {
        ResturantControl.addTable(table);
    }

    @DELETE
    @Path("/{tableId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void removeBord(@PathParam("tableId") String tableId) {
        ResturantControl.removeTable(Integer.parseInt(tableId));
    }

    @POST
    @Path("/{tableId}/{newSize}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void removeBord(@PathParam("tableId") String tableId, @PathParam("newSize") String newSize) {
        ResturantControl.changeTable(Integer.parseInt(tableId), Integer.parseInt(newSize));
    }

    @GET
    @Path("/free/{timeDate}/{minSize}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Table> getFreeBord(@PathParam("timeDate") String timeDate, @PathParam("minSize") String minSize) {
        return ResturantControl.getFreeTables(LocalDateTime.ofInstant(ZonedDateTime.parse(timeDate).toInstant(), ZoneId.systemDefault()), Integer.parseInt(minSize));
    }

    @GET
    @Path("/maxTablePlaces")
    @Produces(MediaType.TEXT_PLAIN)
    public String getFreeBord() {
        return String.valueOf(ResturantControl.getMaxTablePlaces());
    }
}
