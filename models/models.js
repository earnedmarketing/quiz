var path = require('path');

// cargar modelo ORM
var Sequelize = require('sequelize');

// user BD SQLite
var sequelize = new Sequelize( null, null, null,
        { dialect: 'sqlite', storage: 'quiz.sqlite' }
);

// importar la definicion de la table Quiz en quiz.js
var Quiz = sequelize.import( path.join(__dirname, 'quiz') );
exports.Quiz = Quiz; // exportar le definicion de la table Quiz

sequelize.sync().success( function() {
    Quiz.count().success( function(count) {
        if ( count === 0 ) {
            Quiz.create(
                {
                    pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                }
            ).success(function() { console.log('Base de datos inicializada') });
        }
    });
});
