package resturant.rest;

/**
 * Created by Trygve on 18.09.2017.
 */

import resturant.dataProcess.ResturantControl;
import resturant.entity.Reservation;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

@Path("/reserver/")
public class RestReserver {

    @GET
    @Path("/{reservationId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Reservation getReservation(@PathParam("reservationId") String reservationId) {
        return ResturantControl.getReservation(Integer.parseInt(reservationId));
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Reservation> getReservations() {
        return ResturantControl.getReservations();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public int addReservation(Reservation reservation) {
        ResturantControl.addReservation(reservation);
        return reservation.getId();
    }

    @DELETE
    @Path("/{reservationId}")
    public void removeReservation(@PathParam("reservationId") String reservationId) {
        ResturantControl.removeReservation(Integer.parseInt(reservationId));
    }
}

