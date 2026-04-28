package com.help.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.help.mapper") // 扫描 Mapper 接口的任务交接给这个专门的配置类
public class MybatisConfig {
}