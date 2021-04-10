var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gamestate;
var bedroom_Img,bathroom_Img,garden_Img;
var currentTime;

function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage("dogImg1.png");
bedroom_Img=loadImage("Bed_Room.png");
garden_Img=loadImage("Garden.png");
bathroom_Img=loadImage('Wash_Room.png');
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  gamestate=database.ref('gameState')
  gamestate.on("value",getState)
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {

 currentTime=hour();
 if(currentTime===(lastFed+1)){
   update(1);
   foodObj.garden();
 }else if(currentTime===(lastFed+2)){
   update(2);
   foodObj.bedroom();
 }else if(currentTime>(lastFed+2) && currentTime<=(lastfed+4)){
  update(3); 
  foodObj.bathroom();
 }else{
  update(0);
  foodObj.display();
 }
  
 if(gamestate!==0){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog)
 }
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

   
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gamestate:0
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

 function getState(){
  var gameStateRef  = database.ref('gameState');
  gameStateRef.on("value",function(data){
     gameState = data.val();
  })

}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}