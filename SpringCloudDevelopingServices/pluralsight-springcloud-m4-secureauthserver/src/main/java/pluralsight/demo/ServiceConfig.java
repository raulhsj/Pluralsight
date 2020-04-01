package pluralsight.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;

@Configuration
public class ServiceConfig extends GlobalAuthenticationConfigurerAdapter {
	
	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication()
		// Spring 2 implementa Security 5, usando el formato Password Storage dentro de DelegatingPasswordEncoder. Más info en los enlaces
		// https://mkyong.com/spring-boot/spring-security-there-is-no-passwordencoder-mapped-for-the-id-null/
		// https://spring.io/blog/2017/11/01/spring-security-5-0-0-rc1-released#password-storage-format
		// https://docs.spring.io/spring-security/site/docs/current/reference/html5/#pe-dpe
		.withUser("agoldberg").password("{noop}pass1").roles("USER").and()
		.withUser("bgoldberg").password("{noop}pass2").roles("USER", "OPERATOR");
	}

}
