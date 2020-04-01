package pluralsight.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import brave.sampler.Sampler;

@Configuration
public class CustomSampler {
	
	@Bean
	public Sampler smartSampler() {
		
		return new Sampler() {
			@Override
			public boolean isSampled(long traceId) {
				// TODO Auto-generated method stub
				System.out.println("custom sampler used!");
				return true;
			}
		};
		
	}

}
