ppackage com.help;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.help.mapper") // 扫描 Mapper 接口
public class HelpApplication {
    public static void main(String[] args) {
        SpringApplication.run(HelpApplication.java, args);
        System.out.println("====== 校园互助系统后端启动成功 ======");
    }
}