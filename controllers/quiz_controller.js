var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function( req, res, next, quizId ) {
    models.Quiz.find( quizId ).then( function(quiz) {
        if ( quiz ) {
            req.quiz = quiz;
            next();
        } else { next( new Error( 'No existe quizId=' + quizId ) ) }
    }).catch( function( error ) { next( error ); } );
};


// GET /quizes
exports.index = function( req, res ) {
    var searchPattern = req.query.search ? "%" + req.query.search.replace( / /g, "%" ) + "%" : "%";
    models.Quiz.findAll( { where: [ "pregunta like ?", searchPattern ] } )
    .then( function( quizes ) {
        quizes.searchQuery = ( req.query.search || "Buscar preguntas" );
        res.render( 'quizes/index', { quizes: quizes, errors: [] } );
    })
    .catch( function( error ) { next( error ); } )
};

// GET /quizes/:id
exports.show = function( req, res ) {
    res.render( 'quizes/show', { quiz: req.quiz, errors: [] } );
};

// GET /quizes/:id/answer
exports.answer = function( req, res ) {
    var resultado = 'Incorrecto';
    if ( req.query.respuesta === req.quiz.respuesta ) {
        resultado = 'Correcto';
    }
    res.render( 'quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] } );
};

// GET /quizes/new
exports.new = function( req, res ) {
    var quiz = models.Quiz.build(
        { pregunta: "Pregunta", respuesta: "Respuesta" }
    );
    res.render( 'quizes/new', { quiz: quiz, errors: [] } );
};

// POST /quizes/create
exports.create = function( req, res ) {
    console.log(req.body.quiz.pregunta);
    console.log(req.body.quiz.respuesta);
    var quiz = models.Quiz.build( req.body.quiz );
    console.log("validating", quiz.validate());
    console.log("validation done");
    quiz.validate().then( function( err ) {
        console.log("never arives here");
        if ( err ) {
            res.render( 'quizes/new', { quiz: quiz, errors: err.errors } );
        } else {
            quiz.save( { fields: [ "pregunta", "respuesta" ] } )
            .then( function() { res.redirect( '/quizes' ) } );
        }
    });
};
