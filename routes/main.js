
exports.init = function(app) {
  app.get('/', home);
  }


//Index

function home(request, response){
    response.render('index');
}

