package estaciones.security;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private JwtRequestFilter authenticationRequestFilter;

	@Override
	public void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.csrf().disable();
		
		httpSecurity.httpBasic().disable()
        .authorizeRequests()
        .antMatchers("/estaciones/**/noBicicletas").permitAll() // Permite acceso sin autenticación a este endpoint
        .antMatchers("/estaciones/estacionesBicicletas").hasAuthority("Gestor")
        .antMatchers(HttpMethod.POST, "/estaciones/bicicletas/**").hasAuthority("Gestor")
        .antMatchers("/estaciones/**/bicicletas/listado").hasAuthority("Gestor")
        .anyRequest().authenticated()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		
		httpSecurity.addFilterBefore(this.authenticationRequestFilter, UsernamePasswordAuthenticationFilter.class);
	}

}