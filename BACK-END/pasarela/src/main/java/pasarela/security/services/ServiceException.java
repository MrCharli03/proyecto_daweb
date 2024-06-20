package pasarela.security.services;

public class ServiceException extends Exception {
	
	private static final long serialVersionUID = 1L;

	public ServiceException(String msg, Throwable causa) {
		super(msg, causa);
	}

	public ServiceException(String msg) {
		super(msg);
	}
}
