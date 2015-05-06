:- prolog_flag(single_var_warnings,_,off).                              
:- use_module(library(sockets)).
:- use_module(library(lists)).
:- use_module(library(random)).
:- use_module(library(system)).

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

parse_input(clean_data,'OK.') :-  retractall(estado_tempo(_,_)), retractall(estado_mares(_,_)), retractall(estado_astro(_,_)), write('todos os dados apagados').
	
parse_input(estado_tempo(Local,E1,E2,E3,E4,E5),'OK.') :-
	write('atualizado estado_tempo: '),write(Local), nl, assert(estado_tempo(Local,[E1,E2,E3,E4,E5])).
	
parse_input(estado_mares(Porto,E1,E2,E3,E4,E5,E6,E7,E8,E9,E10),'OK.') :-
	write('atualizado estado_marés: '),write(Porto), nl, assert(estado_mares(Porto,[E1-E2,E3-E4,E5-E6,E7-E8,E9-E10])).

parse_input(estado_astro(Local,H1,H2,H3,H4,H5,H6,H7,H8,H9,H10),'OK.') :-
	write('atualizado estado_astro: '),write(Local), nl, assert(estado_astro(Local,[H1-H2,H3-H4,H5-H6,H7-H8,H9-H10])).
	
parse_input(request(Local,Porto,Hinitial,Hfinal,D1,D2,D3,D4,D5,Sunrise,Sunset,WeatherCondition,SeaCondition),Answer) :-
	write('request local: '),write(Local), nl, evaluate(Local,Porto,Hinitial-Hfinal,[1-D1,2-D2,3-D3,4-D4,5-D5],Sunrise,Sunset,WeatherCondition,SeaConditiontrue,[],Answer).

parse_input(get_tempo(Local),Answer) :-
	write('get estado_tempo: '),write(Local), nl, estado_tempo(Local,Answer), write('Answer: '), write(Answer).
		
comando(Arg1, Arg2, Answer) :-
	write(Arg1), nl, write(Arg2), nl,
	Answer = 5.

/*Se nao quiser restringir as marés, o SeaCondition deve vir a 0. Se quer preia-mar 1. Se quer baixa-mar 2.*/
evaluate_mares(MyTime1-MyTime2,0,TideTime1-TideTime2) :- true.
evaluate_mares(MyTime1-MyTime2,1,TideTime1-TideTime2) :- MyTime1 =< TideTime1, MyTime2 >= TideTime1. 
evaluate_mares(MyTime1-MyTime2,2,TideTime1-TideTime2) :- MyTime1 =< TideTime2, MyTime2 >= TideTime2.

/* Se nao quiser restringir sunrise e sunset devem vir os dois a zero, senao devem vir a 1 */
evaluate_astro(MyTime1-MyTime2,0,0,SunriseTime-SunsetTime) :- true.
evaluate_astro(MyTime1-MyTime2,1,0,SunriseTime-SunsetTime) :- MyTime1 =< SunriseTime, MyTime2 >= SunriseTime.
evaluate_astro(MyTime1-MyTime2,0,1,SunriseTime-SunsetTime) :- MyTime1 =< SunsetTime, MyTime2 >= SunsetTime.
evaluate_astro(MyTime1-MyTime2,1,1,SunriseTime-SunsetTime) :- MyTime1 =< SunriseTime, MyTime2 >= SunriseTime, MyTime1 =< SunsetTime, MyTime2 >= SunsetTime.

/* Se nao quiser restringir estado do tempo, este deve vir a zero */
evaluate_weather(0,ActualWeather) :- true.
evaluate_weather(WeatherConditionDesired,ActualWeather) :- WeatherConditionDesired == ActualWeather.

/* Evaluate Recebe: Local, Porto, Hora de Inicio, Hora de Fim, Lista de Dias[Dia-Boleano], se quer por-do-sol, se quer nascer-do-sol, valor das condicoes atm,valor das condicoes marés, lista temporaria de dias, resposta */	

/* Evaluate final */
evaluate(Local,Porto,Hinitial-Hfinal,[],Sunrise,Sunset,WeatherCondition,SeaCondition,TempList,TempList).

/*Evaluate Positivo*/
evaluate(Local,Porto,Hinitial-Hfinal,[H1-H2|T],Sunrise,Sunset,WeatherCondition,SeaCondition,TempList,Answer) :-
	H2 == 1,
	estado_tempo(Local,W_List), estado_mares(Porto, S_List), estado_astro(Local,A_List),
	nth1(H1,W_List,W),nth1(H1,S_List,ST1-ST2),nth1(H1,A_List,AT1-AT2),
	evaluate_weather(WeatherCondition,W),evaluate_mares(Hinitial-Hfinal,SeaCondition,ST1-ST2),evaluate_astro(Hinitial-Hfinal,Sunrise,Sunset,AT1-AT2),
	evaluate(Local,Porto,Hinitial-Hfinal,T,Sunrise,Sunset,WeatherCondition,SeaCondition,[H1|TempList],Answer).
	
/*Evaluate negativo */
evaluate(Local,Porto,Hinitial-Hfinal,[H1-H2|T],Sunrise,Sunset,WeatherCondition,SeaCondition,TempList,Answer) :-
	evaluate(Local,Porto,Hinitial-Hfinal,T,Sunrise,Sunset,WeatherCondition,SeaCondition,TempList,Answer).

	

/* TESTES */
load_tests:-
retractall(estado_tempo(_,_)),
retractall(estado_mares(_,_)),
retractall(estado_astro(_,_)),
assert(estado_tempo("coimbra",[10,11,12,12,14,15])),
assert(estado_tempo("porto",[10,11,12,13,14,15])),
assert(estado_tempo("alentejo",[10,11,12,13,14,15])),
assert(estado_tempo("lisboa",[10,11,12,13,14,15])),
assert(estado_mares("leixoes",[7-18,7-18,7-18,7-22,7-18])),
assert(estado_mares("figueira",[7-18,7-18,7-18,7-18,7-18])),
assert(estado_astro("coimbra",[6-17,6-17,6-17,6-17,6-17])),
assert(estado_astro("porto",[6-17,6-17,6-17,6-17,6-17])).

teste1(X):-evaluate("coimbra","figueira",17-20,[1-1,2-1,3-1,4-1,5-1],0,1,12,0,[],X).
/* Result: [4,3] */

teste2(X):-evaluate("coimbra","figueira",17-20,[1-1,2-1,3-1,4-1,5-1],0,1,12,2,[],X).
/* Result: [4,3] */

teste3(X):-evaluate("coimbra","figueira",17-20,[1-1,2-1,3-1,4-1,5-1],0,1,12,1,[],X).
/* Result: [] */

teste4(X):-evaluate("coimbra","leixoes",17-20,[1-1,2-1,3-1,4-1,5-1],0,1,12,2,[],X).
/* Result: [3] */

teste5(X):-evaluate("coimbra","leixoes",17-20,[1-1,2-1,3-1,4-1,5-1],1,1,12,2,[],X).
/* Result: [] */
	