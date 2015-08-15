var path = require('path');

// Postgres DATABASE_URL = postgress://user:passwd@host:port/database
// SQlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match( /(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/ );
var DB_name     = ( url[6] || null );
var user        = ( url[2] || null );
var pwd         = ( url[3] || null );
var protocol    = ( url[1] || null );
var dialect     = ( url[1] || null );
var port        = ( url[5] || null );
var host        = ( url[4] || null );
var storage = process.env.DATABASE_STORAGE;

// cargar modelo ORM
var Sequelize = require('sequelize');

// usar BD SQLite
var sequelize = new Sequelize( DB_name, user, pwd,
        {   dialect : protocol,
            protocol: protocol,
            port    : port,
            host    : host,
            storage : storage, // solo SQLite (.env)
            omitNull : true // solo Postgres
        }
);

// importar la definicion de la table Quiz en quiz.js
var Quiz = sequelize.import( path.join( __dirname, 'quiz' ) );
// importar la definicion de la table Comment en quiz.js
var Comment = sequelize.import( path.join( __dirname, 'comment' ) );

Comment.belongsTo( Quiz );
Quiz.hasMany( Comment );

exports.Quiz = Quiz; // exportar le definicion de la table Quiz
exports.Comment = Comment; // exportar le definicion de la table Comment

sequelize.sync().then( function() {
    Quiz.count().then( function(count) {
        if ( count === 0 ) {
            Quiz.bulkCreate([
                { tema: 'humanidades', pregunta: 'Capital de Italia', respuesta: 'Roma' },
                { tema: 'humanidades', pregunta: 'Capital de Portugal', respuesta: 'Lisboa' }
            ]).then(function() { console.log('Base de datos inicializada') });
        }
    });
});
