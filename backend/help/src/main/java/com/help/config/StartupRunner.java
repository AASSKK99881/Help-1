package com.help.config;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        String hash = BCrypt.hashpw("123456", BCrypt.gensalt());
        System.out.println("\n=== BCrypt hash for '123456': " + hash + " ===\n");
    }
}
