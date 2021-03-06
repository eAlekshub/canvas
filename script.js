let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d"),
  width = (canvas.width = window.innerWidth),
  height = (canvas.height = window.innerHeight);

function random(min, max) {
  return Math.random() * (max - min) + min;
}

let particles = [];
function addParticle() {
  particles.push({
    number: particles.length, //номер
    opacity: random(0.1, 1), //прозрачность
    opacity_step: random(0.002, 0.008), //шаг изменения прозрачности
    radius: random(4, 10), //радиус
    radius_step: random(4, 7), //шаг изменения радиуса
    angle: random(-10, 90), //угол
    angle_step: random(-0.1, 1), //шаг изменения угла
    x: random(650, 700), //Х-координата
    x_step: random(-5, 10), //шаг изменения по Х
    y: random(640, 650), //У-координата
    y_step: random(-0.1, 7), //шаг изменения по У
    draw: function () {
      this.opacity = this.opacity - this.opacity_step; //Сначала считаем прозрачность
      if (this.opacity > 0) {
        //Если прозрачность меньше 0, то смысл в расчетах и отрисовке пропадает, зачем рисовать полностью прозрачную частицу?

        this.radius = this.radius + this.radius_step; //новый радиус
        this.angle = this.angle + this.angle_step; //новый угол (в градусах!)
        this.x = this.x - this.x_step; //новая Х-координата
        this.y = this.y - this.y_step; //новая У-координата
        ctx.globalAlpha = this.opacity; //задание прозрачности холсту
        if (window.performance.now() - time < 18) {
          //вот та самая проверка "успеваемости", значение взято чуть меньше времени кадра, чтобы наверняка избавиться от тормозов
          ctx.save(); //сохраняем состояние холста
          ctx.translate(this.x, this.y); //задаем начальные координаты
          ctx.rotate((this.angle * Math.PI) / 180); //вращаем контекст
          ctx.drawImage(img, -this.radius / 2, -this.radius / 2, this.radius, this.radius); //рисуем картинку
          ctx.restore(); //восстанавливаем первоначальное состояние холста
        }
      }
    },
  });
}

function draw() {
  time = window.performance.now(); //время начала кадра
  addParticle(); //добавление частицы
  info.innerHTML = particles.length; //запись в div количества частиц
  canvas.width = canvas.width; //очистка холста
  for (var i = 0; i < particles.length; i++) {
    //условие ниже удаляет частицу, если её отрисовка стала бессмысленной
    if (particles[i].opacity <= 0.1 || particles[i].x < 100 || particles[i].x > 1000 || particles[i].y < -100 || particles.length > 50) {
      particles[i].opacity = 0;
      particles[i] = null;
      delete particles[i];
      particles.splice(i, 1);
    }
    particles[i].draw(); //вызов функции просчета и отрисовки. Эту строчку я не пишу в else, чтобы даже при удалении частицы сразу начинала рисоваться следующая, а иначе дым заметно начнет "моргать"
  }
  setTimeout(draw, 5); //...
}
let img = new Image();
img.src = "https://pngimg.com/uploads/smoke/smoke_PNG55138.png";
img.onload = draw();
