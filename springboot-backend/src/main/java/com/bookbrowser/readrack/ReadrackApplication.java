package com.bookbrowser.readrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.bookbrowser.readrack.repository")
public class ReadrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReadrackApplication.class, args);
        System.out.println("ReadRack Application Started..."); // Optional: Confirmation message
    }

}
