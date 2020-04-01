package pluralsight.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class PluralsightSpringcloudM2ConfigserverApplicationGit {

	public static void main(String[] args) {
		SpringApplication.run(PluralsightSpringcloudM2ConfigserverApplicationGit.class, args);
	}

}
