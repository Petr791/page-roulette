let windowCards = document.querySelector('.window-cards');
let windowRoulette = document.querySelector('.window');

let itemsRoulette = document.querySelectorAll('.window-card');
let itemRoulette = document.querySelector('.window-card');
let itemRouletteWidth1 = document.querySelector('.window-card').getBoundingClientRect().width;

// округление ширины элемента
let itemRouletteWidth = Math.ceil(itemRouletteWidth1);


// Ширина элемента
console.log(`Ширина элемента рулетки: ${itemRouletteWidth}px`);

const btnOpen = document.getElementById('btn-open');


// Сообщение Приз
let messagePrize = {};

// индекс
let indexRoulette = 0;
// призовой элемент 
let elemActive;


// Перезагрузка страницы при изменении ширины экрана.
//Нужно для нормальной работы рулетки при повороте экрана устройства.
window.onresize = function(event) {
    location.reload();
};

window.addEventListener("load", function() {

    // повторное добавление элементов для увеличения их количества
    $(document).ready(function() {
        $(function() {

            for (i = 0; i < 4; i++) {
                $('.window-card').clone().appendTo('.window-cards');
            }
        });
    });


    // функция обнуления рулетки
    function itemRouletteZero() {


        $(document).ready(function() {

            // Сообщение Приз
            messagePrize.prizeImage = '';
            messagePrize.prizeName = '';
            messagePrize.prizeCategory = '';
            messagePrize.prizeLink = '';
            //console.log(messagePrize);

        });

        document.querySelectorAll('.window-card')[indexRoulette].classList.remove('roulette-prize');

        windowCards.classList.add('window-cards-left');
        document.getElementsByClassName('window-cards-left')[0].style = "left: 0px";

    }


    // функция запуска рулетки
    function rouletteStart() {

        // рандомный выбор
        const getRandomNum = (min, max) => {
                return Math.floor(Math.random() * (max - min) + min);
            }
            //диапозон рандома
        const rangeRandomItemsRoulette = getRandomNum(20, 70);
        //минус ширина элемента
        var itemRouletteWidthMinus = -itemRouletteWidth;
        //перемещение элементов на ширину(ширина элемента умноженная на индекс элемента в массиве)
        const move = itemRouletteWidthMinus * rangeRandomItemsRoulette;




        // перемещение элементов
        windowCards.style.left = move + 'px';

        //отключение повторного нажатия кнопки
        document.getElementById('btn-open').disabled = true;



        // индекс призового элемента
        /*  indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 0; */

        // Поправки индекса призового элемента от ширины экрана
        if (window.innerWidth <= 450) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 0;

        } else if (window.innerWidth <= 800) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 1;


        } else if (window.innerWidth <= 840) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 1;


        } else if (window.innerWidth <= 940) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 1;



        } else if (window.innerWidth <= 1400) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 2;


        } else if (window.innerWidth <= 1788) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 2;


        } else if (window.innerWidth > 1700) {
            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 3;

        } else {

            indexRoulette = -Math.floor((move + (windowRoulette.offsetWidth / 2) / itemRouletteWidthMinus) / itemRouletteWidth) + 0;
        }



        // призовой элемент
        elemActive = document.querySelectorAll('.window-card')[indexRoulette];


        // добавление класса призовому элементу после остановки рулетки
        windowCards.addEventListener('transitionend', () => {
            elemActive.classList.add('roulette-prize');



            // сообщение о выпавшем призе и отправление данных
            $(document).ready(function() {

                let itemPrize = $('.roulette-prize');
                //console.log(itemPrize);
                messagePrize.prizeImage = itemPrize.find('.window-card__img').attr('src');
                messagePrize.prizeName = itemPrize.find('.window-card__name').text();
                messagePrize.prizeCategory = itemPrize.find('.window-card__category').text();
                messagePrize.prizeLink = itemPrize.find('.window-card__link').attr('href');

                //console.log(messagePrize);

                // отправки данных приза
                sendJSON();

                //кнопка снова становится активной
                document.getElementById('btn-open').disabled = false;
            });

        }, { once: true })

        console.log('Индекс элемента: ' + indexRoulette);

    }






    // функция по клику
    btnOpen.addEventListener('click', function() {

        //отключение повторного нажатия кнопки
        document.getElementById('btn-open').disabled = true;

        // обнуление рулетки
        itemRouletteZero();

        // запуск рулетки
        setTimeout(rouletteStart, 1000);

    });

});



/* $(document).ready(function() {

}); */



/*Для отправки

 $.getJSON("путь до скрипта php", {option: messagePrize},
  function(data){
    //data - полученный результат от скрипта
  }
); */

/* В самом скрипте php, получаем результат от js
$option = $_GET['option'] */


// эта функция отправки данных сработает при нажатии на кнопку
function sendJSON() {

    // создаём новый экземпляр запроса XHR
    let xhr = new XMLHttpRequest();
    // адрес, куда мы отправим нашу JSON-строку
    let url = "/roulette.php";
    // открываем соединение
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        // если запрос принят и сервер ответил, что всё в порядке
        if (xhr.readyState === 4 && xhr.status === 200) {

            //alert(xhr.responseText);
            console.log(xhr.responseText);
        } else {
            //alert('no!');

        }
    };
    // преобразуем данные JSON в строку
    let data = JSON.stringify(messagePrize);

    // отправляем JSON на сервер
    xhr.send(data);
    //console.log(data);
}