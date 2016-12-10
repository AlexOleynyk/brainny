var express = require('express');
var app = express();
var mongo = require("mongodb").MongoClient;
var db = require('./db.js');

var sass = require('node-sass-middleware');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8000;
var dbUrl = process.env.MONGOLAB_URI;

var fs = require('fs');



app.set('view engine', 'jade');

app.use(cookieParser());
app.use(sass({
  src: __dirname + '/public/style/sass', //where the sass files are 
  dest: __dirname + '/public/style/css', //where css should go
  // debug: true, // obvious
  prefix: '/style/css'
}))
app.use(express.static('public'));

app.use(session({
  secret: 'foo',
  store: new MongoStore({
    mongooseConnection: db
      // collection: 'session'
  })
}))

app.use(bodyParser());


// файл со всеми играми
var allGames = require('./data/games');

//  файл с ежедневной тренировкой
var dailyWorkout = require('./data/workout.js');

// файл с ежедневным заданием 
var daily = require('./data/daily');

// файл со всеми ежедневными заданиями которые могут быть 
var dailys = require('./data/dailys.js');

// файл со всеми достижениями в игре
var allAchivments = require('./data/achivments.js');

// Схема для данных пользователя
var userSchema = require('./schemas/userSchema.js');

// файл с переменными приложения, которые могут меняеться в процессе 
var variables = require('./data/variables.js');



app.get('*', function(req, res, next) {
  var lastDate = new Date(Date.now()).getDate();
  
  // Обработка загрузчика иконки сайта
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {
      'Content-Type': 'image/x-icon'
    });
    res.end();
    //console.log('favicon requested');
    return;
  }

  if (variables.lastDailyDate == lastDate) {
    console.log('Последнее обновлени данных было' + lastDate + 'числа  ' + new Date(Date.now()));
    next();


  }
  else {
    //обновление ежедневного задания
    updateDaily(daily);


    // сброс выполненных заданий и добавление довых игр для каждого пользователья если они были добавлены
    userSchema.find({}, function(err, users) {
      if (err) {
        console.log(err);
      }
      else {

        users.forEach(function(findedUser) {
          var userGames = findedUser.games;
          findedUser.completeDailyQuest = false;
          findedUser.completeDailyWorkout = false;

          for (var gameCategory in allGames) {
            allGames[gameCategory].map(function(item) {
              if (!userGames.hasOwnProperty(item.game)) {
                userGames[item.game] = {
                  difficulty: 1
                }
              }
            })
          }

          findedUser.games = userGames;
          findedUser.markModified('games');

          findedUser.save(function(err, user) {
            if (err) {
              console.log(err)
            }
            else {
              console.log(user.username + ' updated');
            };
          });
        })

      }
    })

    // обновление переменной последнего обновления
    variables.lastDailyDate = lastDate;

    fs.writeFile("./data/variables.js", "module.exports = " + JSON.stringify(variables), function(err) {
      if (err) {
        return console.log(err);
      }

      delete require.cache[require.resolve('./data/variables.js')]
      variables = require('./data/variables.js');
    });

    // создание новой тренировки на новый день
    var newWorkout = [];
    for (var gameCategory in allGames) {
      var newGameIndex = Math.floor(Math.random() * allGames[gameCategory].length);
      //console.log(newGameIndex + ' из ' + allGames[gameCategory].length);
      newWorkout.push(allGames[gameCategory][newGameIndex]);
    }

    fs.writeFile("./data/workout.js", "module.exports = " + JSON.stringify(newWorkout), function(err) {
      if (err) {
        return console.log(err);
      }

      delete require.cache[require.resolve('./data/workout.js')]
      dailyWorkout = require('./data/workout.js');
      var newWorkout = dailyWorkout.map(function(item) {
        return item.title;
      })

      console.log('Новая тренировка на сегодня: ' + JSON.stringify(newWorkout));

    });

    setTimeout(function() {
      next();
    }.bind(this), 1000);




  }



})

app.post('/adduser', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var ref = req.body.ref || null;

  var games = {}

  for (var gameCategory in allGames) {
    allGames[gameCategory].map(function(item) {
      games[item.game] = {
        difficulty: 1
      }
    })
  }

  var newUser = new userSchema({
    username: username,
    password: password,
    ref: ref,
    email: email,
    braincoins: 50,
    games: games
  });

  newUser.save(function(err) {
    if (err) {
      if (err.code == 11000) {
        console.log(err);
        res.status(500).send('Пользоветель с таким именем или електронным адресом уже зарегистирован<br>Код ошибки: ' + err.code);
      }
      else {
        console.log(err);
        res.status(500).send('Что-то пошло не так<br>Код ошибки: ' + err);
      }
    }
    else {
      // res.status(200).send(username);
      req.session.user = newUser;
      res.redirect('/');
    }

  });

});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  userSchema.findOne({
    username: username
  }, function(err, user) {
    if (err) {
      console.log(err);
      res.status(500).send('Что-то пошло не так<br>Код ошибки: ' + err);
      // req.session.error = '';
    }
    else {
      if (user == null) {
        // req.session.error = 'Пользователь с таким именем не найден';
        req.session.error = 404;
        res.redirect('/');
      }
      else if (user.password != password) {
        // req.session.error = 'Пароль введен не верно';
        req.session.error = 401;
        res.redirect('/');
      }
      else {

        // req.session.user = user;
        //   res.redirect('/');

        if (user.braincoins) {
          req.session.user = user;
          res.redirect('/');
        }
        else {
          user.braincoins = 0;
          user.save(function(err, saved) {
            if (err) {
              console.log(err);

            }
            else {
              req.session.user = saved;
              res.redirect('/');
            }
          })
        }


      }

      // req.session.logged = true;
      // res.status(200).send(user);


    }

  })
})

app.get('/check', function(req, res) {
  if (req.session.user) {
    res.send('hello')
  }
  else {
    res.send('NO!');
  }
});

app.post('/updateScore', function(req, res) {
  var user = req.session.user;
  if (req.session.user) {
    userSchema.findOne({
      username: user.username
    }, function(err, findedUser) {
      if (err) {
        console.log(err);
      }
      else {
        var newScore = Math.round(Math.random() * 2000);

        findedUser.bestScore = newScore;

        findedUser.save(function(err) {
          if (err) {
            console.log(err);
            res.redirect('/' + user.username)
          }
          else {
            req.session.user = findedUser;
            res.redirect('/' + user.username)
          }
        });
      }


    })
  }
  else {
    res.status(501).send();
  }
});

app.get('/logout', function(req, res) {
  // req.session.logged = false;
  req.session.destroy();
  res.redirect('/');
  // res.status(200).send('ok');
});

//========================================================


app.get('/', (req, res) => {

  if (req.session.user != null) {
    var user = req.session.user;
    
    userSchema.findOne({
      username: user.username
    }, function(err, findedUser) {

      if (err) {
        console.log(err);
        res.status(404).send(err);
      }
      else {
        req.session.user = findedUser;
        var messages = findedUser.messages;

        res.render('index.jade', {
          currentUser: findedUser,
          workout: dailyWorkout,
          daily: daily,
          messages: messages
        });
      }

    });
  }
  else {
    res.render('index.jade', {
      currentUser: {
        username: ''
      },
      error: req.session.error,
      ref: req.query.ref || null
    });
  }
  // res.status(200).send();
})

app.post('/message_read', function(req, res) {
  if (req.session.user != null) {
    var user = req.session.user;

    userSchema.findOne({
      username: user.username
    }, function(err, findedUser) {
      if (err) {
        console.log(err);
        res.send('error');
      }
      else {
        var messages = findedUser.messages;

        messages.splice(0, 1);
        console.log(messages);

        findedUser.messages = messages;
        findedUser.markModified('messages');
        findedUser.save(function(err, user) {
          res.send('ok');
        });

      }
    });


  }
  else {
    res.send('error');
  }
});


app.get('/workout', function(req, res) {
  if (req.session.user) {

    var user = req.session.user;
    userSchema.findOne({
      username: user.username
    }, function(err, findedUser) {

      if (err) {
        console.log(err);
        res.status(404).send(err);
      }
      else {
        var workout = dailyWorkout[+findedUser.dailyWorkout];
        var gameAchivments = allAchivments.filter(function(item) {
          return (item.game == workout.game);
        })

        res.render('workout.jade', {
          currentUser: findedUser,
          workout: workout,
          daily: daily,
          achivments: gameAchivments
        });
      }

    });

  }
  else {
    res.redirect('/');
  }
})

app.get('/workout_check', function(req, res) {
  if (req.session.user) {
    var user = req.session.user;

    userSchema.findOne({
      username: user.username
    }, function(err, findedUser) {
      if (err) {
        console.log(err);
        res.status(404).send();
      }
      else {
        
        // копирование объекта для проверки достижений
        var oldStringUser = JSON.stringify(findedUser)
        var userOld = JSON.parse(oldStringUser);
        
        
        var workout = findedUser.dailyWorkout;
        // обновление информации игрока
        if (workout > dailyWorkout.length - 2) {

          //завершил тренировку - молодчик!
          workout = 0;
          findedUser.statistic.workoutsComplete += 1;
        }
        else {

          //var coins = +req.query.coins || 0;

          var difficulty = req.query.difficulty || 1;

          var game = dailyWorkout[workout]
          var games = findedUser.games || {}
          workout++;

          if (games.hasOwnProperty(game.game)) {
            if (difficulty) {
              games[game.game].difficulty = +difficulty;
              // console.log(games[game.game].difficulty, games);
            }

          }
          else {
            games[game.game] = {
              difficulty: +difficulty
            }
          }
          
          
          findedUser.games = games;
         
          
          
        }
        
        // расчета уровная и опыта юзера
        var levels = req.query.levels || 1;
        var errors = req.query.errors || levels;
        var difficulty = req.query.difficulty || 1;
        
        var exp = Math.floor(difficulty/(0.1*findedUser.statistic.level*(errors+1)) + 5);
        
        var level = Math.floor(Math.sqrt(findedUser.statistic.experience+exp)/10) + 1;
        
        var coins = (levels - errors) || 0;
        console.log('level ' + level + ' exp ' + exp);
        
        findedUser.statistic.level = level;
        findedUser.statistic.experience += exp;
        
        console.log(findedUser.statistic);

        
        
        findedUser.markModified('games');
        findedUser.markModified('statistic');
        findedUser.braincoins += coins;
        
        findedUser.dailyWorkout = workout;




        // проверка выполнения всех достижений основанных на статистике
        var mainAchivments = allAchivments.filter(function(item) {
          return item.game == 'main';
        });

        mainAchivments.map(function(item) {
          var cryteria = item.cryteria;
          console.log(cryteria);
          console.log(userOld.statistic.workoutsComplete + ' ' + findedUser.statistic.workoutsComplete);
          // проверка выполнения условия в формате "значение до" - "значение после"
          if (eval(cryteria)) {
            console.log(findedUser.username + ' - ' + item.title + ': achive complete!');
            findedUser.messages.push({
              title: item.title,
              text: item.description,
              image: 'complete-game.png',
              buttonText: 'Супер!',
              prize: item.prize
            });
            
            
            // проверка на совместные достижения: реферал получил 5 уровень
            if (item.title == 'Лучший друг'){
              userSchema.findOne({username: findedUser.ref}, function(err, refUser){
                if (err){
                  console.log(err);
                  
                } else {
                  refUser.messages.push({
                    title: item.title,
                    text: findedUser.username + ' достиг 5 уровня! Вы оба получаете награду',
                    image: 'complete-game.png',
                    buttonText: 'Супер!',
                    prize: item.prize
                  });
                  refUser.braincoins += item.prize;
                  refUser.markModified('messages');
                  refUser.save();
                }
              })
            }
            
            
            findedUser.braincoins += item.prize;
            findedUser.markModified('messages');
          }
        });
        
        // var workoutsComplete = findedUser.statistic.workoutsComplete;
        // var cryteria = "workoutsComplete == 0";
        // сохранение в базу обновленной информации
        
        findedUser.save(function(err, savedUser) {
          if (err) {
            console.log(err);
            res.redirect('/' + 'eror')
          }
          else {
            //console.log(savedUser);
            req.session.user = findedUser;
            res.redirect('/')
          }
        });
      }


    })

  }
  else {
    res.redirect('/');
  }

});

app.get('/games', (req, res) => {
  if (req.session.user) {
    var user = req.session.user;
    // console.log(allGames);
    res.render('games.jade', {
      currentUser: user,
      workout: allGames
    });
  }
  else {
    res.render('games.jade', {
      currentUser: {
        username: ''
      },
      user: {
        username: ''
      },
      isMyProfile: false
    })
  }
  // res.status(200).send();
})

app.get('/about', (req, res) => {
  if (req.session.user) {
    var user = req.session.user;
    // console.log(allGames);
    res.render('about.jade', {
      currentUser: user
    });
  }
  else {
    res.render('index.jade', {
      currentUser: {
        username: ''
      },
      user: {
        username: ''
      },
      isMyProfile: false
    })
  }
  // res.status(200).send();
})

app.get('/sendmail', function(req, res) {
  
  var nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport 
  var transporter = nodemailer.createTransport('smtps://oleynalex%40yandex.ru:1h%40v3100k@smtp.yandex.ru');

  // setup e-mail data with unicode symbols 
  var mailOptions = {
    from: '"Fred Foo 👥" <oleynalex@yandex.ru>', // sender address 
    to: 'alex.oleynyk@gmail.com', // list of receivers 
    subject: 'Hello ✔', // Subject line 
    text: 'Hello world 🐴', // plaintext body 
    html: '<b>Hello world 🐴</b>' // html body 
  };

  // send mail with defined transport object 
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });

  /*var api_key = '031c43c0715687fd2dfce6e44f705441';
  var domain = '	sandbox0da391d1c78f4d1084992d2527652791.mailgun.org';
  var mailgun = require('mailgun-js')({
    apiKey: api_key,
    domain: domain
  });

  var data = {
    from: 'Excited User <oleynalex@yandex.ru>',
    to: 'alex.oleynyk@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
  };

  mailgun.messages().send(data, function(error, body) {
    console.log(error);
    console.log(body);
  });*/

});


app.post('/invitefriend', function(req, res) {

  var nodemailer = require('nodemailer');
  if (req.session.user) {
    if (req.body.email) {
      // create reusable transporter object using the default SMTP transport 
      var transporter = nodemailer.createTransport('smtps://oleynalex%40yandex.ru:1h%40v3100k@smtp.yandex.ru');

      // setup e-mail data with unicode symbols 
      var mailOptions = {
        from: '"Brainny - сервис тренировка мозга" <oleynalex@yandex.ru>', // sender address 
        to: req.body.email, // list of receivers 
        subject: 'Приглашение в Brainny', // Subject line 
        text: 'Привет', // plaintext body 
        // html: '<b>Привет!</b> <br> <p> Пользователь ' + req.session.user.username + ' приглашает'+
        // ' тебя тренировать мозг в сервисе Brainny. Ты можешь зарегистрироваться по этой ссылке '+
        // '<a href="http://brainny.herokuapp.com/?ref=' + req.session.user.username + '" style="color: #2B223B"> Зарегестрироваться </a>.</p>' +
        // '<p>Если с ссылкой что-то не так, просто скопируй этот адрес и вставь его в адресную строку браузера: </p>' + 
        // '<p> brainny.herokuapp.com?ref=' + req.session.user.username + '</p>'   // html body 
        html: '<table cellpadding="20" style="   font-family: sans-serif;    line-height: 28px;    background: #342642;    color: white;    width: 100%;'+
    'text-align: center;    padding: 50px; ">  <tr>'+
    '<td><h2>Привет</h2></td>'+
    '</tr>  <tr> <td><p>Пользователь '+ req.session.user.username +' приглашает тебя тренировать мозг в сервисе Brainny. <br> Ты можешь зарегистрироваться нажав на кнопку ниже: </p></td>'+
    '</tr>  <tr>    <td>      <a class="btn" style="background: #2fb16f;    display: inline-block;    margin-top: 20px; margin-bottom: 50px;' + 
    'padding: 14px 22px;    color: white;    text-transform: uppercase;    border-radius: 50px;    text-decoration: none;'+
    'box-shadow: 0 0 30px 0 #2fb16f;" href="http://brainny.herokuapp.com/?ref=' + req.session.user.username + '"> Зарегистрироваться </a>    </td>  </tr></table>'        // html body 
      };

      // send mail with defined transport object 
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        userSchema.findOne({
          username: req.session.user.username
        }, function(err, findedUser) {
          if (err) {
            console.log(err);
          }
          else {
            findedUser.messages.push({

              title: 'Сообщение отправлено',
              text: 'Ты отправил приглашение на адрес ' + req.body.email + '. Когда твой друг достигнет пятого уровня вы оба получите награду.',
              image: 'complete-game.png',
              buttonText: 'Хорошо',
            });

            findedUser.save();
          }
        });

        res.redirect('/');
      });
    }
  }
  else {
    res.redirect('/');
  }

});


app.get('/:username', (req, res) => {
  if (req.params.username != 'favicon.ico') {
    var user = req.session.user;
    if (user.username == req.params.username) {
      userSchema.findOne({
        username: user.username
      }, function(err, findedUser) {
        if (err) {
          console.log(err);
          res.status(501).send(err);
        }
        else {
          if (findedUser) {
            res.render('profile.jade', {
              currentUser: user,
              user: findedUser,
              isMyProfile: false
            })
          }


        }
      })
    }
    else {

      userSchema.findOne({
        username: req.params.username
      }, function(err, findedUser) {
        if (err) {
          console.log(err);
          res.status(501).send(err);
        }
        else {
          if (findedUser) {
            //console.log('here 1');
            res.render('profile.jade', {
              currentUser: user,
              user: findedUser,
              isMyProfile: false
            })
          }
          else {
            //console.log('here');
            res.render('profile.jade', {
              currentUser: user,
              user: {
                username: 'Нет такого пользователя'
              },
              error: 'Нет такого пользователя',
              isMyProfile: false
            })
          }
        }
      })
    }
  }

})








function updateDaily() {
  var dailyIndex = Math.floor(Math.random() * dailys.length);

  fs.writeFile("./data/daily.js", "module.exports = " + JSON.stringify(dailys[dailyIndex]), function(err) {
    if (err) {
      return console.log(err);
    }

    delete require.cache[require.resolve('./data/daily.js')]
    daily = require('./data/daily.js');

    console.log('Новое задание на сегодня: ' + JSON.stringify(daily));

  });


  // userSchema.update({}, {
  //     completeDailyQuest: false,
  //     completeDailyWorkout: false
  //   }, {
  //     multi: true
  //   },
  //   function(err, user) {
  //     console.log("updated " + JSON.stringify(user));
  //   }
  // );







}

app.listen(port, function() {
  console.log('Server starts on ' + port + ' port');

})
