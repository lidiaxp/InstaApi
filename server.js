var mongodb = require('mongodb');

// Create seed data

var seedData = [
  {
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://lidiaxp:lidiaxp123@ds149724.mlab.com:49724/instagram';

mongodb.MongoClient.connect(uri, function(err, db) {
  
  if(err) throw err;
  
  /*
   * First we'll add a few songs. Nothing is required to create the 
   * songs collection; it is created automatically when we insert.
   */

  var songs = db.collection('songs');

   // Note that the insert method can take either an array or a dict.

  songs.insert(seedData, function(err, result) {
    
    if(err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    songs.update(
      { song: 'One Sweet Day' }, 
      { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
      function (err, result) {
        
        if(err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {

          if(err) throw err;

          docs.forEach(function (doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });
         
          // Since this is an example, we'll clean up after ourselves.
          songs.drop(function (err) {
            if(err) throw err;
           
            // Only close the connection when your app is terminating.
            db.close(function (err) {
              if(err) throw err;
            });
          });
        });
      }
    );
  });
});
	
/*
	//POST
	app.post('/api', function(req, res){
		//res.setHeader("Access-Control-allow-Origin", "*"); //ou coloca a url no lugar do * se quiser limitar as chamadas

		var date = new Date();
		time_stamp = date.getTime();

		var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;

		var path_origem = req.files.arquivo.path;
		var path_destino = './uploads/' + url_imagem;

		fs.rename(path_origem, path_destino, function(err){
			if(err){
				res.status(500).json({error: err});
				return;
			}

			var dados = {
				url_imagem: url_imagem,
				titulo: req.body.titulo
			}

			db.open(function(err, mongoClient){
				mongoClient.collection('postagens', function(err, collection){
					collection.insert(dados, function(err, records){
						if(err){
							res.json({'status' : 'Erro'});
						}else{
							res.json({'status' : 'Inclusão realizada com sucesso'});
						}
						mongoClient.close();
					});
				});
			});
		});
	});

	//GET all
	app.get('/api', function(req, res){

		//res.setHeader("Access-Control-allow-Origin", "*"); //ou coloca a url no lugar do * se quiser limitar as chamadas

		db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.find().toArray(function(err, results){
					if(err){
						res.json(err);
					}else{
						res.json(results);
					}
					mongoClient.close();
				});
			});
		});
	});

	//GET por id
	app.get('/api/:id', function(req, res){
		db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.find(objectId(req.params.id)).toArray(function(err, results){
					if(err){
						res.json(err);
					}else{
						/*if(results === null){
							res.status(res.status(500).json(results));
						}else{*/
		/*					res.json(results);
						//}
					}
					mongoClient.close();
				});
			});
		});
	});

	//GET por whatever
	/*app.get('/api/:titulo', function(req, res){
		db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.find({titulo : req.params.titulo}).toArray(function(err, results){
					if(err){
						res.json(err);
					}else{
						res.json(results);
					}
					mongoClient.close();
				});
			});
		});
	});*/

	/*app.get('/imagens/:imagem', function(req, res){
		var img = req.params.imagem;

		fs.readFile('./uploads/' + img, function(err, conteudo){
			if(err){
				res.status(400).json(err);
				return;
			}

			res.writeHead(200, {'Content-type':'image/png', 'Content-type':'image/jpg'});
			res.end(conteudo);
		})
	});

	//PUT por id
	app.put('/api/:id', function(req, res){
		//res.send(req.body.comentario);

		db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.update(
					{ _id : objectId(req.params.id) },
					{ $push : {
								comentarios : {
									id_comentario : new objectId(),
									comentario : req.body.comentario
								}
							  }
					},
					{ },
					function(err, records){
						if(err){
							res.json(err);
						}else{
							res.json(records);
						}
						mongoClient.close();
					}
				);
			});
		});

		/*db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.update(
					{ _id : objectId(req.params.id) },
					{ $set : {titulo : req.body.titulo}},
					{ },
					function(err, records){
						if(err){
							res.json(err);
						}else{
							res.json(records);
						}
						mongoClient.close();
					}
				);
			});
		});*/
	});

	//DELETE por id
	/*app.delete('/api/:id', function(req, res){
		db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.update(
					{ },
					{ $pull : {
								comentarios: {id_comentario: objectId(req.params.id)}
							  } 
					},
					{multi: true},
					function(err, records){
						if(err){
							res.json(err);
						}else{
							res.json(records);
						}
						mongoClient.close();
					}
				);
			});
		});

		/*db.open(function(err, mongoClient){
			mongoClient.collection('postagens', function(err, collection){
				collection.remove(
					{ _id: objectId(req.params.id) },
					function(err, records){
						if(err){
							res.json(err);
						}else{
							res.json(records);
						}
						mongoClient.close();
					}
				);
			});
		});*/
	});*/
