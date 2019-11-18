const fs = require("fs");
const mongoClient = require("mongodb").MongoClient;
let db;
let collection;


////
fs.readFile("./uploads/filmList.txt", "utf8", 
            function(error,str){
                console.log("Асинхронное чтение файла");
                if(error) throw error; // если возникла ошибка
                



                Array.prototype.remove = function(value) {
                  var idx = this.indexOf(value);
                  if (idx != -1) {
                      // Второй параметр - число элементов, которые необходимо удалить
                      return this.splice(idx, 1);
                  }
                  return false;
                }
                
                str = str.replace(/Title/gi,`title`).replace(/Release Year/gi,`date`).replace(/Format/gi,`format`).replace(/Stars/gi,`stars`);
                 
                str = str.split('\n')
                str = str.map(item =>item.replace(/\r/gi,''))
                for(let i = 0;i<str.length;i++){
                  str.remove('');
                }
                str = str.map(function (item) {
                  return item.split(/: /); 
                })
                
                var obj = str.map(function (item) {
                  var obj = {};
                  for (var i = 0; i < item.length; i++) {
                    obj[item[0]] = item[1];
                    if(item[0]=="stars"){
                      obj[item[0]] = item[1].split(', ');
                    }
                  }
                  return obj;
                });
                
                let filmList = [];
                for(let i = 0,j = 0; i < (obj.length)/4;i++,j +=4){
                  Object.assign(obj[0 + j],obj[1 +j],obj[2 + j],obj[3 + j]);
                  filmList[i] = obj[0 + j];
                }
                
                fs.writeFile("./uploads/filmList.txt", filmList, function(error){
 
                  if(error) throw error; // если возникла ошибка
                  console.log("Асинхронная запись файла завершена.");
                  
                  mongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true },function(err,client){ //Подключаем db К нашему проекту
                  if(err){
                      return console.log(err);
                  }
                  db = client.db('filmsDb');
                  collection = db.collection("films");
                  collection.insertMany(filmList);

              });
                
                fs.unlink("./uploads/filmList.txt", (err) => {
                  if (err) console.log(err); // если возникла ошибка    
                  else console.log("filmList.txt Удалён");
                });
                });
});




