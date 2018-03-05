// DEFINITION OF FUNCTIONS
const {log,biglog,errorlog,colorize} = require('./out');
const model = require('./model');





exports.help = function (rl) {
    log('Commandos:\n' +
        ' h|help - Muestra esta ayuda.\n' +
        ' list - Listar los quizzes existentes.\n' +
        ' show <id> - Muestra la pregunta y la respuesta el quiz indicado.\n' +
        ' add - Añadir un nuevo quiz interactivamente.\n' +
        ' delete <id> - Borrar el quiz indicado.\n' +
        ' edit <id> - Editar el quiz indicado.\n' +
        ' test <id> - Probar el quiz indicado.\n' +
        ' p|play - Jugar a preguntar aleatoriamente todos los quizzes.\n' +
        ' credits - Créditos.\n' +
        ' q|quit - Salir del programa.');
    rl.prompt();
};
exports.list = function (rl) {

    model.getAll().forEach(function (quiz,id) {
        log('[' + colorize(id,'magenta')+']: ' + quiz.question);
    });
    rl.prompt();
};
exports.show = function (rl,id) {
    if(typeof id === 'undefined'){
        errorlog('Falta el parámetro id.');
    }else{
        try{
            const quiz = model.getByIndex(id);
            log('[' + colorize(id,'magenta')+']: ' + quiz.question + colorize(' => ','magenta') + quiz.answer);
        }catch(error){
            errorlog(error.message);
        }
    }

    rl.prompt();
};
exports.addQuestion = function (rl) {
    rl.question(colorize(' Introduzca una pregunta: ','red'),function (question) {
       rl.question(colorize(' Introduzca la respuesta ','red'),function (answer) {
           model.add(question,answer);
           log(colorize('Se ha añadido','magenta')+': ' + question + colorize(' => ','magenta') + answer);
           rl.prompt();
       });
    });
};
exports.delete = function (rl,id) {
    if(typeof id === 'undefined'){
        errorlog('Falta el parámetro id.');
    }else{
        try{
            model.deleteByIndex(id);
        }catch(error){
            errorlog(error.message);
        }
    }

    rl.prompt();
};
exports.edit = function (rl,id) {
    if(typeof id === 'undefined'){
        errorlog('Falta el parámetro id.');
        rl.prompt();
    }else{
        try{
            var quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            rl.question(colorize(' Introduzca una pregunta: ','red'), (question)=> {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
               rl.question(colorize(' Introduzca la respuesta ','red'), (answer)=> {

                   model.update(id,question,answer);
                   log(`Se ha cambiadoo el quiz ${colorize(id,'magenta')} por: ${question} ${colorize(' => ','magenta')} ${answer}`)
                    rl.prompt();
               }) ;
            });
        }catch(error){
            errorlog(error);
            rl.prompt();
        }
    }
};
exports.test = function (rl,id) {
    if(typeof id === 'undefined'){
        errorlog('Falta el parámetro id.');
        rl.prompt();
    }else{
        try{
            var quiz = model.getByIndex(id);
            rl.question(colorize(quiz.question +'? ','red'), (answer)=> {
                log('Su respuesta es correcta.');
                if(0==answer.toUpperCase().trim().localeCompare(quiz.answer.toUpperCase().trim())){
                    biglog('Correcta','green');
                }else{
                    biglog('Incorrecta','red');
                }
                rl.prompt();
            });
        }catch(error){
            errorlog(error);
            rl.prompt();
        }
    }
};
exports.play = function (rl) {
    let score = 0;
    let toBeResolved = model.getAll();
    const playOne = function () {
      if(toBeResolved == 0){
          log(`No hay nada más que preguntar.`);
          log(`Fin del juego. Aciertos: ${score}`);
          biglog(score,'magenta');
          rl.prompt();
          return;
      }
        id = parseInt(Math.random()*toBeResolved.length);
        let quiz = toBeResolved[id];
        log(`id de la pregungta ${id} y el lengt ${toBeResolved.length}`);

        rl.question(colorize(quiz.question +'? ','red'), (answer)=> {
            log('Su respuesta es correcta.');
            if(0==answer.toUpperCase().trim().localeCompare(quiz.answer.toUpperCase().trim())){
                score++;
                log(`CORRECTO - Lleva ${score} acierto`);
                toBeResolved.splice(id,1);
                playOne();
            }else{
                log(`INCORRECTO.`);
                log(`Fin del juego. Aciertos: ${score}`);
                biglog(score,'magenta');
                rl.prompt();
            }
        });
    };
    playOne();
};
exports.credits = function (rl) {
    log('Autor de la práctica:\n' +
        colorize('Fernando Graus Launa','green'));
    rl.prompt();
};