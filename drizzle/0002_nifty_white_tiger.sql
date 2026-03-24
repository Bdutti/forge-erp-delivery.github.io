CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tipo` enum('bug','sugestao','elogio','outro') NOT NULL DEFAULT 'sugestao',
	`pagina` varchar(255),
	`mensagem` text NOT NULL,
	`email` varchar(320),
	`status` enum('novo','lido','em_analise','resolvido') NOT NULL DEFAULT 'novo',
	`resposta` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
