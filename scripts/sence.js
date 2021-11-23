var Ucren = require( "lib/ucren" );
var sound = require( "lib/sound" );
var fruit = require( "factory/fruit" );
var flash = require( "object/flash" );

var state = require( "state" );
var message = require( "message" );

var background = require( "object/background" );
var fps = require( "object/fps" );

var homeMask = require( "object/home-mask" );
var logo = require( "object/logo" );
var ninja = require( "object/ninja" )
var homeDesc = require( "object/home-desc" );

var quit = require( "object/quit" );
var newSign = require( "object/new" );
var sandia, boom;

var score = require( "object/score" );
var lose = require( "object/lose" );

var game = require( "game" );

var developing = require( "object/developing" );
var gameOver = require( "object/game-over" );

var message = require( "message" );
var timeline = require( "timeline" );
var setTimeout = timeline.setTimeout.bind( timeline );
var setInterval = timeline.setInterval.bind( timeline );

var menuSnd;
var gameStartSnd;

exports.init = function(){
    menuSnd = sound.create( "sound/menu" );
    gameStartSnd = sound.create( "sound/start" );
	[ background, homeMask, logo, ninja, homeDesc, dojo, newSign, newGame, quit, score, lose, developing, gameOver, flash /*, fps */ ].invoke( "set" );
};

exports.switchSence = function( name ){
    var curSence = state( "sence-name" );
    var senceState = state( "sence-state" );

    if( curSence.is( name ) )
        return ;

    var onHide = function(){
        curSence.set( name );
        senceState.set( "entering" );
        switch( name ){
            case "home-menu": this.showMenu( onShow ); break;
            case "dojo-body": this.showDojo( onShow ); break;
            case "game-body": this.showNewGame( onShow ); break;
            case "quit-body": this.showQuit( onShow ); break;
        }
    }.bind( this );

    var onShow = function(){
        senceState.set( "ready" );

        if( name == "dojo-body" || name == "quit-body" ){
            exports.switchSence( "home-menu" );
        }
    };

    senceState.set( "exiting" );

    if( curSence.isunset() ) onHide();
    else if( curSence.is( "home-menu" ) ) this.hideMenu( onHide );
    else if( curSence.is( "dojo-body" ) ) this.hideDojo( onHide );
    else if( curSence.is( "game-body" ) ) this.hideNewGame( onHide );
    else if( curSence.is( "quit-body" ) ) this.hideQuit( onHide );
};

exports.showMenu = function( callback ){
    var callee = arguments.callee;
    var times = callee.times = ++ callee.times || 1;
    sandia = fruit.create( "sandia", 330, 322, true );
    boom = fruit.create( "boom", 552, 367, true, 2500 );

    [ sandia, boom ].forEach(function( f ){ f.isHomeMenu = 1; });

    var group = [
    	[ homeMask, 0 ], 
    	[ logo, 0 ], 

    	[ ninja, 500 ], 
    	[ homeDesc, 1500 ], 

    	[ quit, 2000 ],
        
        [ newSign, 2000 ],

        [ sandia, 2000 ],
        [ boom, 2000 ]
    ];

    group.invoke( "show" );
    [ sandia ].invoke( "rotate", 2500 );

    menuSnd.play();
    setTimeout( callback, 2500 );
};

exports.hideMenu = function( callback ){
    [ newSign, dojo, newGame, quit ].invoke( "hide" );
    [ homeMask, logo, ninja, homeDesc ].invoke( "hide" );
    [ sandia, boom ].invoke( "fallOff", 150 );

    menuSnd.stop();
    setTimeout( callback, fruit.getDropTimeSetting() );
};

exports.showNewGame = function( callback ){
    score.show();
    lose.show();
    game.start();
    
    gameStartSnd.play();
    setTimeout( callback, 1000 );
};

exports.hideNewGame = function( callback ){
    score.hide();
    lose.hide();

    gameStartSnd.stop();
    setTimeout( callback, 1000 );
};

exports.showDojo = function( callback ){
    developing.show( 250 );
    setTimeout( callback, 1500 );
};

exports.hideDojo = function( callback ){
    setTimeout( callback, 1000 );
};

exports.showQuit = function( callback ){
    developing.show( 250 );
    setTimeout( callback, 1500 );
};

exports.hideQuit = function( callback ){
    setTimeout( callback, 1000 );
};

message.addEventListener("sence.switchSence", function( name ){
    exports.switchSence( name );
});