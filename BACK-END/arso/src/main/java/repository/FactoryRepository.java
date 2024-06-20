package repository;

import utils.PropertiesReader;

/*
 * Factor�a que encapsula la implementaci�n del repositorio.
 * 
 * Utiliza un fichero de propiedades para cargar la implementaci�n del repositorio.
 * 
 */

public class FactoryRepository {
	
	private static final String PROPERTIES = "repositorios.properties";
	
	
	@SuppressWarnings("unchecked")
	public static <T, K, R extends Repository<T, K>> R getRepository(Class<?> entidad) {
				
			
			try {				
					PropertiesReader properties = new PropertiesReader(PROPERTIES);		
					String clase = properties.getProperty(entidad.getName());
					return (R) Class.forName(clase).getConstructor().newInstance();
			}
			catch (Exception e) {
				
				e.printStackTrace(); // �til para depuraci�n
				
				throw new RuntimeException("No se ha podido obtener el repositorio para la entidad: " + entidad.getName());
			}
			
	}
	
}
