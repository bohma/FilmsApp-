//Поиск фильмов по названию
 function  searchByTitle() {
    $.ajax({
        url: "/api/films",
        type: "GET",
        contentType: "application/json",
        success: function (films) {
            films = films.filter(item=>item.title == document.forma.t1.value);//проверяем на совпадение то, что вввели в поиске с названием фильма
            var rows = "";
            $.each(films, function (index, film) {
                // добавляем полученные элементы в таблицу
                rows += row(film);
            })
            $(".table1 tbody").append(rows);//Записываем в таблицу 1
         }
    });
}
//Поиск фильмов по актёру
 function  searchByStar() {
    $.ajax({
        url: "/api/films",
        type: "GET",
        contentType: "application/json",
        success: function (films) {
            films = films.filter(function(film){
                for (let actor of film.stars){
                    if(actor==document.forma.t1.value){//проверяем на совпадение то, что вввели в поиске с актерами фильмов
                        return film;//Возвращаем фильм
                    }
                }
            });
            var rows = "";
            $.each(films, function (index, film) {
                // добавляем полученные элементы в таблицу
                rows += row(film);
            })
            $(".table1 tbody").append(rows);//Записываем в таблицу 1
         }
    });
}
// Получение всех фильмов
 function GetFilms() {
    $.ajax({
        url: "/api/films",
        type: "GET",
        contentType: "application/json",
        success: function (films) {
            var rows = "";
            $.each(films, function (index, film) {
                // добавляем полученные элементы в таблицу
                rows += row(film);
            })
            $(".table2 tbody").append(rows);//Записываем в таблицу 2
         }
    });
}
//Получение всех фильмов в алфавитном порядке
function sortByTitle() {
    $.ajax({
            url: "/api/films",
            type: "GET",
            contentType: "application/json",
            success: function (films) {
                films = films.sort(
                function (a, b) {
                  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;//Сортировка фильмов в алфавитном порядке без учета регистра
                  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                    return 0;
                });
                var rows = "";
                $.each(films, function (index, film) {
                    // добавляем полученные элементы в таблицу
                    rows += row(film);
                })
                $(".table3 tbody").append(rows);//Записываем в таблицу 3
            }
        });
    }

    
// Получение одного фильма
function GetFilm(id) {
    $.ajax({
        url: "/api/films/"+id,
        type: "GET",
        contentType: "application/json",
        success: function (film) {
            var form = document.forms["filmForm"];
            form.elements["id"].value = film._id;
            form.elements["title"].value = film.title;
            form.elements["date"].value = film.date;
            form.elements["format"].value = film.format;
            form.elements["stars"].value = film.stars;

        }
    });
}
// Добавление фильма
function CreateFilm(filmTitle, filmDate,filmFormat,filmStars) {
    $.ajax({
        url: "api/films",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            title: filmTitle,
            date: filmDate,
            format: filmFormat,
            stars: filmStars.split(', ')//Задаем как массив актеров
        }),
        success: function (film) {
            reset();
            $(".table2 tbody").append(row(film));
        }
    })
}
// Изменение фильма
function EditFilm(filmId, filmTitle, filmDate,filmFormat,filmStars) {
    $.ajax({
        url: "api/films",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: filmId,
            title: filmTitle,
            date: filmDate,
            format: filmFormat,
            stars: filmStars
        }),
        success: function (film) {
            reset();
            console.log(film);
            $("tr[data-rowid='" + film._id + "']").replaceWith(row(film));
        }
    })
}

// сброс формы
function reset() {
    var form = document.forms["filmForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// Удаление фильма
function DeleteFilm(id) {
    $.ajax({
        url: "api/films/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function (film) {
            console.log(film);
            $("tr[data-rowid='" + film._id + "']").remove();
        }
    })
}
// создание строки для таблицы
var row = function (film) {
    return "<tr data-rowid='" + film._id + "'><>" + "<td><a class = 'filmLink'"+ film._id + "' href = '/api/films/"+ film._id +"'>" + film.title + "</a></td> <td>" + film.date + "</td> <td>" + film.format + "</td> <td>" + film.stars +"</td>" +
   "<td><a class='editLink' data-id='" + film._id + "'>Изменить</a> | " +
    "<a class='removeLink' data-id='" + film._id + "'>Удалить</a></td></tr>";
   }
// сброс значений формы
$("#reset").click(function (e) {

    e.preventDefault();
    reset();
})

// отправка формы
$("form").submit(function (e) {
    e.preventDefault();
    var id = this.elements["id"].value;
    var title = this.elements["title"].value;
    var date = this.elements["date"].value;
    var format = this.elements["format"].value;
    var stars = this.elements["stars"].value;
    if (id == 0)
        CreateFilm(title, date, format, stars);
    else
        EditFilm(id, title, date, format, stars);
});

// нажимаем на ссылку Изменить
$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    GetFilm(id);
})
// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    DeleteFilm(id);
})
searchByTitle();//загрузка результатов поиска по назканию фильма
searchByStar();//загрузка результатов поиска по имени актёра
GetFilms();// загрузка фильмов
sortByTitle();// загрузка отсортированиых в алфавитном порядке
