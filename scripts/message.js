var Ucren = require( "lib/ucren" );

exports.postMessage = function( message, to ){
	var messages = [].slice.call( arguments, 0 ),
		splitIndex = messages.length - 1;

	to = messages[ splitIndex ];
	messages.slice( 0, splitIndex );

	Ucren.dispatch( to, messages );
};

exports.addEventListener = function( from, fn ){
	Ucren.dispatch( from, fn );
};

exports.removeEventListener = function( from, fn ){
	Ucren.dispatch.remove( from, fn );
};