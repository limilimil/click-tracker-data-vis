
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

//table and date variables
var mouseTable;
var today;
var todayRow;
var todayArray;
var totalTime
var previousTime = 0;
var sessionClicks = 0;




function setup() {
    // Create a canvas to fill the content div from index.html.
    canvasContainer = select('#app');
    var c = createCanvas(1024, 576);
    c.parent('app');
    
    //initialising a date object set to today
    mouseTable = loadLocalTable('mouseStats', ['date', 'clicks', 'time']);
    
    today = split(new Date().toISOString(), 'T')[0]; //convert the date to ISO date format string
    
    todayArray = split(today, '-'); //strip date of hyphons and adds year, month, day to array
    
    //if there is nothing in local storage to retrive it will create a new table
    if(mouseTable.matchRow(today, 'date') == null)
    {
        console.log("IT IS NULL");
        let newRow = mouseTable.addRow();
        newRow.setString('date', today);
        newRow.setNum('clicks', 0);
        newRow.setNum('time', 0);
    }
    todayRow = mouseTable.matchRow(today, 'date');
    totalTime = millis() + todayRow.getNum('time');
    previousTime = millis();
    setInterval(autoSave, 30000);
    
    //Create a new gallery object.
    gallery = new Gallery();

    //Add the visualisation objects here.
    gallery.addVisual(new MouseStatistics());
    gallery.addVisual(new ClicksPerSecond());
    
}

function draw() {
    background(255);
    if (gallery.selectedVisual != null) 
    {
        gallery.selectedVisual.draw();
    }
    
    //time variables for storing time
    let currentTime = millis();
    let elapsedTime = currentTime - previousTime;
    totalTime += elapsedTime;
    todayRow.setNum('time', totalTime);
    previousTime = currentTime;   
}

function mousePressed()
{
    
    sessionClicks++; //increments number of clicks during this session
    todayRow.setNum('clicks', todayRow.getNum('clicks')+1); //increments todays clicks in table
    storeItem('mouseStats', mouseTable.getArray()); //saves table state to local storage
    
}