var D , SD , HD, database;
var food,foodStock;
var fedTime,lastFed;
var feedME,addFood;
var FO;

function preload(){
SD = loadImage("Images/Dog.png");
HD = loadImage("Images/happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  FO = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  D = createSprite(800, 200, 150, 150);
  D.addImage(SD);
  D.scale = 0.35;
  
  feedME = createButton("Feed ME");
  feedME.position(400,95);
  feedME.mousePressed(feedDog);

  addFood=createButton("Add Food NOW");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background("lightBlue");
  FO.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

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
  food=data.val();
  FO.updateFoodStock(food);
}


//function to update food stock and last fed time
function feedDog(){
  D.addImage(HD);
  
  if(FO.getFoodStock()<= 0){
    FO.updateFoodStock(FO.getFoodStock()*0);
  }else{
    FO.updateFoodStock(FO.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:FO.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  food++;
  database.ref('/').update({
    Food:food
  })
}