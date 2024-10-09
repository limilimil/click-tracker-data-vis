function ClicksPerSecond() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Clicks Per Second';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'clicks-per-second';

    this.title = 'Clicks Per Second';
    var marginSize = 35;
    var timeTotal = 0;
    var clicksTotal = 0;
    var totalRows;
    var averageClicks;
    var averageTime;
    var numPulses = 3;
    this.diameter = 180;
    this.x = width/numPulses;
    

    this.sessionPulse = new ClickPulse(this.x-this.diameter, height/2, 180, 160, 0.40, color('red')); //this session
    this.todayPulse = new ClickPulse(this.x*2-this.diameter, height/2, 180, 160, 0.40, color('green')); //today
    this.averagePulse = new ClickPulse(this.x*3-this.diameter, height/2, 180, 160, 0.40, color('blue')); //overall average all days
    
    this.setup = function() {
        
        //triggers the setTimer interval function for pulses
        this.sessionPulse.triggerPulse();
        this.todayPulse.triggerPulse();
        this.averagePulse.triggerPulse();
        
        totalRows = mouseTable.getRowCount();
        
        for(var i = 0; i < totalRows; i++)
        {
            clicksTotal += mouseTable.getNum(i, 'clicks'); //adds all clicks from all dates in table
            timeTotal += mouseTable.getNum(i, 'time'); //adds all time from all dates in table
        }
        averageClicks = floor(clicksTotal / totalRows); //averages clicks
        averageTime = floor(timeTotal / totalRows); //averages time
       
    }
    

    this.destroy = function() {
    };

    this.draw = function() {
        
        this.drawTitle()
        
        this.sessionPulse.draw(sessionClicks, millis());
        this.todayPulse.draw(todayRow.getNum('clicks'), todayRow.getNum('time'));
        this.averagePulse.draw(averageClicks, averageTime);
            
        fill(0)
        textSize(20);
        textAlign('center', 'center');
        text('This Session\n' + this.sessionPulse.clicksPerSecond.toFixed(2), this.x-this.diameter, height/4);
        text('Today\n' + this.todayPulse.clicksPerSecond.toFixed(2), this.x*2-this.diameter, height/4);
        text('Average Overall\n' + this.averagePulse.clicksPerSecond.toFixed(2), this.x*3-this.diameter, height/4);
        
    };
    
    this.drawTitle = function() {
        textSize(24)
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title, width/2, height/20);
    };
    
}