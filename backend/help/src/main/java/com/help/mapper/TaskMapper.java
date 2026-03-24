// TaskMapper.java
package com.help.mapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.help.entity.Task;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TaskMapper extends BaseMapper<Task> {}