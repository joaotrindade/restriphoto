imports_lists:- ••use_module(library(lists)).
imports_random:- ••use_module(library(random)).
imports_system:- ••use_module(library(system)).

:- imports_random,imports_system.
:- prolog_flag(single_var_warnings,_,off).                              
:- use_module(library(sockets)).

port(60070).

% launch me in sockets mode
server:-
	port(Port),
	socket_server_open(Port, Socket),
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
	write('Accepted connection'), nl,
	serverLoop(Stream),
	socket_server_close(Socket).

% wait for commands
serverLoop(Stream) :-
	repeat,
	read(Stream, ClientMsg),
	write('Received: '), write(ClientMsg), nl,
	parse_input(ClientMsg, MyReply),
	format(Stream, '~q.~n', [MyReply]),
	write('Wrote: '), write(MyReply), nl,
	flush_output(Stream),
	(ClientMsg == quit; ClientMsg == end_of_file), !.

parse_input(comando(Arg1, Arg2), Answer) :-
	write('entrou parse'), nl, comando(Arg1, Arg2, Answer).
	
parse_input(whatMove(X,Tabuleiro), Answer):-
	whatMove(X,Tabuleiro,Answer).
	
parse_input(game_over(Tabuleiro),Answer) :-
	game_over(Tabuleiro,0,Answer).
	
parse_input(cpu_play(Tabuleiro,Player,NewPlayer,Jogada),Answer) :-
	cpu_play(Tabuleiro,Player,2,Answer,NewPlayer,Jogada).
	
parse_input(quit, ok-bye) :- !.
		
comando(Arg1, Arg2, Answer) :-
	write(Arg1), nl, write(Arg2), nl,
	Answer = 5.