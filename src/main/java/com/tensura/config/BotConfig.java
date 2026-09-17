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

    @Value("${bot.token:8948513585:AAGqiADr7q2pfkSyx8415r51eguB2KVkgCY}")
    private String botToken;

    @Value("${bot.admin.id:6112843760}")
    private Long adminId;
}
