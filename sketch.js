const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var fruit, ground;
var fruit_con, fruit_con2;
var rope, rope2;

//variáveis de imagens
var bg_img;
var food;
var rabbit;

//botoes
var button, button2, button3;
var mute_btn;

//sprites
var bunny;
var blink, eat, sad;

var fr;

//variaveis sons
var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

//variaveis estrelas
//sprites
var star1, star2, starScore
//Imagens
var star_img, empty_star, one_star, two_star

function preload() {
  bg_img = loadImage("img/background.png");
  food = loadImage("img/melon.png");
  rabbit = loadImage("img/Rabbit-01.png");

  //animações
  blink = loadAnimation("img/blink_1.png", "img/blink_2.png", "img/blink_3.png");
  eat = loadAnimation("img/eat_0.png","img/eat_1.png","img/eat_2.png","img/eat_3.png","img/eat_4.png");
  sad = loadAnimation("img/sad_1.png", "img/sad_2.png", "img/sad_3.png");

  //estrelas
  star_img = loadImage('img/star.png');
  empty_star = loadImage("img/empty.png");
  one_star = loadImage("img/one_star.png");
  two_star = loadImage("img/stars.png");

  //reprodução das animações
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  
  //retirada loop
  sad.looping = false;
  eat.looping = false;

  //sons
  bk_song = loadSound("sons/sound1.mp3");
  sad_sound = loadSound("sons/sad.wav");
  cut_sound = loadSound("sons/rope_cut.mp3");
  eating_sound = loadSound("sons/eating_sound.mp3");
  air = loadSound("sons/air.wav");
}

function setup() {
  createCanvas(600, 700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  bk_song.play();
  bk_song.setVolume(0.5);
  
  //criação corpo fruta
  var optF={
    density:.001,
  }
  fruit = Bodies.circle(300, 300, 20, optF);
  
  ground = new Ground(width/2, height, width, 5);
  

  //criação cordas
  //ambas com mesmo numero de elos
  rope = new Rope(7, { x: 200, y: 90 });
  rope2 = new Rope(7, { x: 420, y: 90 });

  Matter.Composite.add(rope.body, fruit);

  //criação ligação
  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);

  //atraso na velocidade de reprodução
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  //criação sprite coelho
  bunny = createSprite(width/2-100, height-80, 100, 100);
  bunny.scale = 0.2;
  //animações do coelho
  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);
  //bunny.changeAnimation("blinking");

  //criação Botões
  button = createImg("img/cut_btn.png");
  button.position(180, 90);
  button.size(50, 50);
  button.mouseClicked(drop);
  button2 = createImg("img/cut_btn.png");
  button2.position(390, 90);
  button2.size(50, 50);
  button2.mouseClicked(drop2);
  
  mute_btn = createImg("img/mute.png");
  mute_btn.position(width - 80, 20);
  mute_btn.size(50, 50);
  mute_btn.mouseClicked(mute);

  baloon = createImg("img/baloon2.png");
  baloon.position(width/2-35, 300);
  baloon.size(100, 120);
  baloon.mouseClicked(airblow);

  //criação estrelas
  star1 = createSprite(320,50,20,20);
  star1.addImage(star_img);
  star1.scale=0.013;
  star2 = createSprite(50,330,20,20);
  star2.addImage(star_img);
  star2.scale=0.013;
  //animações estrelas
  starScore = createSprite(50, 20, 30, 30);
  starScore.scale = 0.2;
  starScore.addImage("empty", empty_star);
  starScore.addImage("one", one_star);
  starScore.addImage("two", two_star);
 // starScore.changeAnimation("empty");

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);
}

function draw() {
  background(51);
  image(bg_img, width/2, height/2, width, height);

  //imagem fruta
  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  //exibição elementos
  rope.display();
  rope2.display();
  ground.display();
  drawSprites();

  //usando o retorno da função para decidir qual animação usar
  if (collide(fruit, bunny) == true) {
    World.remove(world, fruit);
    fruit = null;
    bunny.changeAnimation("eating");
    eating_sound.play();
  }

  if (fruit != null && fruit.position.y >= 650) {
    bunny.changeAnimation("crying");
    bk_song.stop();
    sad_sound.play();
    fruit = null;
  }

  //colisão com estrelas
  if (collide(fruit, star1, 20) == true) {
    star1.visible = false;
    starScore.changeAnimation("one");
  }

  if (collide(fruit, star2, 40) == true) {
    star2.visible = false;
    starScore.changeAnimation("two");
  }

  //atualização
  Engine.update(engine);
}
//função quebra das cordas
function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}

function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null;
}

//função de colisão
function collide(body, sprite) {
  if (body != null) {
    var d = dist(
      body.position.x, body.position.y,
      sprite.position.x, sprite.position.y
    );
    if (d <= 80) {
      return true;
    } else {
      return false;
    }
  }
}

function mute() {
  if (bk_song.isPlaying()) {
    bk_song.stop();
  } else {
    bk_song.play();
    setVolume(0.5)
  }
}


function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    airblow();
  }
}

//aplicar força ao soprador ar
function airblow() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0, y: -0.03 });
  air.play();
}