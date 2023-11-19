package com.wordWave.modal;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
	private String sender;
	private String content;
	private LocalDateTime timestamp;
	private MessageType type;
}
