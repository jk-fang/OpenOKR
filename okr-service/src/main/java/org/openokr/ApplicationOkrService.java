package org.openokr;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.ImportResource;

import java.util.concurrent.CountDownLatch;

@SpringBootApplication(scanBasePackages = {"org.openokr"},
        exclude = org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration.class)
@ImportResource({
        "classpath:/META-INF/spring/appCtx-provider.xml"
})
public class ApplicationOkrService {

    private static Logger logger = LoggerFactory.getLogger(ApplicationOkrService.class);

    public static void main(String[] args) throws InterruptedException {
        new SpringApplicationBuilder().sources(ApplicationOkrService.class).web(false).run(args);
        logger.info("启动完成！");
        new CountDownLatch(1).await();
    }

}