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
	
parse_input(estado_tempo(Local,E1,E2,E3,E4,E5),'OK.') :-
	write('atualizado estado_tempo: '),write(Local), nl, estado_tempo(Local,[E1,E2,E3,E4,E5]).
	
parse_input(estado_mares(Porto,E1,E2,E3,E4,E5,E6,E7,E8,E9,E10),'OK.') :-
	write('atualizado estado_marés: '),write(Porto), nl, estado_mares(Porto,[E1-E2,E3-E4,E5-E6,E7-E8,E9-E10]).

parse_input(estado_astro(Local,H1,H2,H3,H4,H5,H6,H7,H8,H9,H10),'OK.') :-
	write('atualizado estado_astro: '),write(Local), nl, estado_astro(Local,[H1-H2,H3-H4,H5-H6,H7-H8,H9-H10]).
	
parse_input(request(Local,Porto,Hinitial,Hfinal,D1,D2,D3,D4,D5,D6,D7,Sunset,Sunrise,WeatherCondition,SeaCondition),Answer) :-
	write('request local: '),write(Local), nl, evaluate(Local,Porto,Hinitial-Hfinal,[1-D1,2-D2,3-D3,4-D4,5-D5,6-D6,7-D7],Sunset,Sunrise,WeatherCondition,SeaConditiontrue,[],Answer).

		
comando(Arg1, Arg2, Answer) :-
	write(Arg1), nl, write(Arg2), nl,
	Answer = 5.
	

/* Evaluate final */
evaluate(Local,Porto,Hinitial-Hfinal,[],Sunset,Sunrise,WeatherCondition,SeaCondition,TempList,TempList).

/*Evaluate positivo */
evaluate(Local,Porto,Hinitial-Hfinal,[H1-H2|T],Sunset,Sunrise,WeatherCondition,SeaCondition,TempList,Answer) :-
	estado_tempo(Local,W_List), estado_mares(Porto, S_List), estado_astro(Local,A_List),
	nth1(H1,W_List,W),nth1(H1,S_List,ST1-ST2),nth1(H1,A_List,AT1-AT2),
	W == WeatherCondition, S (todo...)
	evaluate(Local,Porto,Hinitial-Hfinal,T,Sunset,Sunrise,WeatherCondition,SeaCondition,[TempList|H1],Answer).
	
/*Evaluate negativo */
evaluate(Local,Porto,Hinitial-Hfinal,[H1-H2|T],Sunset,Sunrise,WeatherCondition,SeaCondition,TempList,Answer) :-

	evaluate(Local,Porto,Hinitial-Hfinal,T,Sunset,Sunrise,WeatherCondition,SeaCondition,TempList,Answer).

	
	
	