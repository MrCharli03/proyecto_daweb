package pasarela.security;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		final String authorizationHeader = request.getHeader("Authorization");


		
		try {

			if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				String jwt = authorizationHeader.substring(7);

				Claims claims = Jwts.parser().setSigningKey("secreto").parseClaimsJws(jwt).getBody();

				String username = claims.getSubject();

				ArrayList<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
				authorities.add(new SimpleGrantedAuthority((String) claims.get("rol")));

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username,
						null, authorities);
				SecurityContextHolder.getContext().setAuthentication(authentication);

			}

		} catch (ExpiredJwtException | MalformedJwtException | SignatureException | UnsupportedJwtException e) {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			response.getWriter().write("Unauthorized: Invalid or Expired JWT token");
			return;
		}

		chain.doFilter(request, response);
	}
}