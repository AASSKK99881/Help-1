package com.help; // 已修复：删除了多余的 'p'

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
/*@MapperScan("com.help.mapper") // 扫描 Mapper 接口*/
public class HelpApplication {
    public static void main(String[] args) {
        // 已修复：将 . java 改为了 .class
        SpringApplication.run(HelpApplication.class, args);
        System.out.println("====== 校园互助系统后端启动成功 ======");
    }
}