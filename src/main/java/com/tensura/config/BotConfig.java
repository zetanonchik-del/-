package com.tensura.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
public class BotConfig {

    @Value("${bot.name:TensuraSlimeRpgBot}")
    private String botName;

    @Value("${bot.token:}")
    private String botToken;

    @Value("${bot.admin.id:0}")
    private Long adminId;
}
