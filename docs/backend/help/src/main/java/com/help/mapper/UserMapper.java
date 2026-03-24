// UserMapper.java
package com.help.mapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.help.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {}