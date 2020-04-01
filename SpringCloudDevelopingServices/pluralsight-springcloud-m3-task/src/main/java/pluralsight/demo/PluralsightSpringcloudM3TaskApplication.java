package pluralsight.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.task.configuration.EnableTask;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableTask
public class PluralsightSpringcloudM3TaskApplication {

	public static void main(String[] args) {
		SpringApplication.run(PluralsightSpringcloudM3TaskApplication.class, args);
	}
	
	public class TollProcessingTask implements CommandLineRunner {

		@Override
		public void run(String... args) throws Exception {
			// TODO Auto-generated method stub
			
			// parameters stationid, license plate, timestamp
			if (null != args) {
				System.out.println("parameter length is ".concat(String.valueOf(args.length)));
				
				String stationId = args[1];
				String licensePlate = args[2];
				String timestamp = args[3];
				
				System.out.println("Station ID is ".concat(stationId).concat(", plate is ").concat(licensePlate).concat(", timestamp is ").concat(timestamp));
			}
			
		}
		
	}
	
	@Bean
	public TollProcessingTask tollProcessingTask() {
		return new TollProcessingTask();
	}

}
