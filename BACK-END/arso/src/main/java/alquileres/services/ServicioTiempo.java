package alquileres.services;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class ServicioTiempo implements IServicioTiempo {
	private Clock clock = Clock.systemDefaultZone();
	private ZoneId zoneId = ZoneId.systemDefault();

	public Clock getClock() {
		return clock;
	}

	public LocalDateTime now() {
		return LocalDateTime.now(getClock());
	}
	
	@Override
	public void setFixedClockAt(LocalDateTime date) {
		this.clock = Clock.fixed(date.atZone(zoneId).toInstant(), zoneId);
	}

	@Override
	public void resetSystemTime() {
		clock = Clock.systemDefaultZone();
	}

}
