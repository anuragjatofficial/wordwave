package com.wordWave.controllor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.wordWave.modal.Message;

@Controller
public class MessageControllor {
	
	
	@MessageMapping("/message.sendMessage")
	@SendTo("/topic/public")
	public Message sendMessage(
			@Payload Message message
	) {

		return message;
	}
	@MessageMapping("/message.addUser")
	@SendTo("/topic/public")
	public Message addUser(
			@Payload Message message,
			SimpMessageHeaderAccessor simpMessageHeaderAccessor
	) {
		// adds user
		simpMessageHeaderAccessor.getSessionAttributes().put("username",message.getSender());
		return message;
	}
}
