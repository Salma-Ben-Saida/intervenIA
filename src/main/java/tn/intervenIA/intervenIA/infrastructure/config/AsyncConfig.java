package tn.intervenIA.intervenIA.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(5);     // number of worker threads
        executor.setMaxPoolSize(10);     // hard limit
        executor.setQueueCapacity(100);  // queued async tasks
        executor.setThreadNamePrefix("AsyncPlanner-");

        executor.initialize();
        return executor;
    }
}

