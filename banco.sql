create database festival;
use festival;

create table participantes(
id int auto_increment primary key,
nome varchar(120) not null,
email varchar(120) unique not null,
telefone varchar(20) not null
 );
 
 create table atividades(
 id int auto_increment primary key,
 titulo varchar(120) not null,
 descricao TEXT not null,
 qtd_vagas int not null,
 data_atvd datetime not null
 );
 
 create table inscricoes (
 id int auto_increment primary key,
 participante_id int not null,
 atividade_id int not null,
 data_inscricao datetime default current_timestamp,
 
 foreign key (participante_id) references participantes(id) on delete cascade,
 foreign key (atividade_id) references atividades(id) on delete restrict,
 
 unique key participante_atividade  (participante_id, atividade_id) 
 );
 
 insert into participantes(nome,email,telefone) values
 ('Ana','ana@gmail.com','34 99999-1111'),
 ('Maria','maria@gmail.com','34 99999-2222'),
 ('José','jose@gmail.com','34 99999-3333');
 
 insert into atividades(titulo, descricao, qtd_vagas, data_atvd) values
 ('Café','Café Literario','20','2026-10-22'),
 ('Música','Música ao vivo','1','2026-10-23');
 
 SELECT * FROM atividades;
 
  
 SELECT * FROM inscricoes;
 
  
 SELECT * FROM participantes;
 
 

