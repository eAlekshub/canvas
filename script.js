let canvas = document.getElementById("canvas");
let ctx = canvas.getContext ("2d");

function random(min,max){
	return Math.random() * (max - min) + min;
}
let particles = [];
function addParticle(){
	particles.push({
		num: particles.length, //номер
		opacit: random(0,0.5), //прозрачность
		step: random(0.002,0.008), //шаг изменения прозрачности
		r: random(3,10), //радиус
		dr: random(0.5,1.5), //шаг изменения радиуса
		a: random(0,280), //угол
		da: random(-3,3), //шаг изменения угла
		x: random(249,351), //Х-координата
		dx: random(-0.2,0.2), //шаг изменения по Х
		y: random(149,351), //У-координата
		dy: random(0.5,1), //шаг изменения по У
		draw: function(timer){
	this.opacit = this.opacit - this.step; //Сначала считаем прозрачность
	if(this.opacit > 0){ //Если прозрачность меньше 0, то смысл в расчетах и отрисовке пропадает, зачем рисовать полностью прозрачную частицу?
		this.r += this.dr; //новый радиус
		this.a -= this.da; //новый угол (в градусах!)
		this.x -= this.dx; //новая Х-координата
		this.y -= this.dy; //новая У-координата
		ctx.globalAlpha = this.opacit; //задание прозрачности холсту
		if(window.performance.now() - time < 28){ //вот та самая проверка "успеваемости", значение взято чуть меньше времени кадра, чтобы наверняка избавиться от тормозов
			ctx.save(); //сохраняем состояние холста
			ctx.translate(this.x,this.y); //задаем начальные координаты
			ctx.rotate(this.a*Math.PI/180); //вращаем контекст
			ctx.drawImage(img,-this.r/2,-this.r/2,this.r,this.r); //рисуем картинку
			ctx.restore(); //восстанавливаем первоначальное состояние холста
		}
	}
}
	});
}

function draw(){				
	time = window.performance.now(); //время начала кадра
	addParticle(); //добавление частицы
	info.innerHTML = particles.length; //запись в div количества частиц
	canvas.width = canvas.width; //очистка холста
	for(var i = 0; i < particles.length; i++){
		//условие ниже удаляет частицу, если её отрисовка стала бессмысленной
		if(particles[i].op <= 0 || particles[i].x < -100 || particles[i].x > 600 || particles[i].y < -100){
			particles[i].op = 0;
			particles[i] = null;
			delete particles[i];
			particles.splice(i,1);
		}
	        particles[i].draw(); //вызов функции просчета и отрисовки. Эту строчку я не пишу в else, чтобы даже при удалении частицы сразу начинала рисоваться следующая, а иначе дым заметно начнет "моргать"
	}
	setTimeout(draw, 30); //...
}
img = new Image();
img.src = 'http://habrahabr.ru/i/nocopypast.png';
img.onload = draw();
