package com.wordWave.config;

import com.wordWave.modal.Message;
import com.wordWave.modal.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListner {
    private final SimpMessageSendingOperations messageSendingOperations;
    @EventListener
    public void handleWebSocketDisconnectListner(
            SessionDisconnectEvent event
    ) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username!= null){
            log.info("User disconnected: {}",username);
            var chatMessage = Message
                    .builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .build();
            messageSendingOperations.convertAndSend("/topic/public",chatMessage);
        }
    }
}
