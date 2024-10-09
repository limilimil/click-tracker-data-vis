function MouseStatistics() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Mouse Statistics';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'mouse-statistics';

    // Names for x axis. (no y axis label)
    this.xAxisLabel = 'date';

    var marginSize = 35;
    var boxText;
    var boxOffset = 0;

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        marginSize: marginSize,

        // Margin positions around the plot. Left and bottom have double
        // margin size to make space for axis and tick labels on the canvas.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function() {
            return this.rightMargin - this.leftMargin;
        },

        plotHeight: function() {
            return this.bottomMargin - this.topMargin;
        },

        // Boolean to enable/disable background grid.
        grid: false,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 7,
        numYTickLabels: 8,
        innerMargin: function() {
            return this.plotWidth()/this.numXTickLabels/2;
        },

    };
    
    // Property to represent whether data has been loaded.
    this.loaded = false;

    //Preload the data. This function is called automatically by the
    //gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = mouseTable;
        self.loaded = true;

    };
    
    this.setup = function() {
        if (!this.loaded) 
        {
            console.log('Data not yet loaded');
            return;
        }
        
        //Font defaults.
        textSize(16);

        //Set min and max dates
        this.numDays = 6; //7 days (1 week). Beginning at 0
        this.enddate = new Date(today); //last day is always today
        this.startdate = new Date(Date.UTC(todayArray[0], todayArray[1]-1, todayArray[2]-this.numDays));

        //Find min and max clicks for mapping to canvas height.
        this.minClicks = 0;
        this.maxClicks = ceil(max(this.data.getColumn('clicks'))/1000)*1000;
        this.minTime = 0;
        this.maxTime = 14400000; // 4 hours

    }
    
    this.destroy = function() {
    };

    this.draw = function() {
        if (!this.loaded) 
        {
            console.log('Data not yet loaded');
            return;
        }

        
        //Draw x and y axis.
        drawAxis(this.layout);

        //Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
                       this.yAxisLabel,
                       this.layout);

        var barWidth = this.layout.plotWidth() / 7;
        var barPad = barWidth / 7;
        var previous;


        //Loop over all rows and draw a line from the previous value to
        //the current.
        for (var i = this.numDays; i >= 0; i--) 
        {

          // Create an object to store data for the current date.
            let tempDate = new Date(Date.UTC(todayArray[0], todayArray[1]-1, todayArray[2]-i));
            let matchingRow = this.data.matchRow(split(tempDate.toISOString(), 'T')[0], 'date')
            var current = {
                'date': tempDate,
                'clicks': 0,
                'time': 0,
            };
            //assigns them variables from the row matching the date
            if( matchingRow != null)
            {
                current.clicks = matchingRow.getNum('clicks');
                current.time = matchingRow.getNum('time');
            }

            fill(120, 180, 120, 200)
            
            //draws bars
            if(current.clicks != 0)
            {
               
                rect(this.mapDateToWidth(current.date, false)-this.layout.innerMargin()+barPad, this.layout.bottomMargin, barWidth-barPad*2, -this.mapClicksToHeight(current.clicks, false)); 
            }
            if (previous != null) 
            {
                strokeWeight(2);
                stroke(0);
                noFill();
                //maps bezier start and end x and y to canvas
                let bezStartX = this.mapDateToWidth(previous.date, false);
                let bezStartY = this.mapTimeToHeight(previous.time, false);
                let bezEndX = this.mapDateToWidth(current.date, false);
                let bezEndY = this.mapTimeToHeight(current.time, false);

                //Sets the control point
                let controlPointX = (bezStartX + bezEndX) / 2;
                
                //draws the bezier
                bezier(bezStartX, bezStartY, controlPointX, bezStartY, controlPointX, bezEndY, bezEndX, bezEndY);
                strokeWeight(1);

            }
    
            //Draw the tick label
            drawXAxisTickLabel(formatDate(current.date, 'en-GB'), this.layout, this.mapDateToWidth.bind(this));

            
            //Assign current date to previous date so that it is available
            //during the next iteration of this loop to give us the start
            //position of the next line segment.
            
            if(mouseX > this.mapDateToWidth(current.date, false)-this.layout.innerMargin()+barPad && mouseX < this.mapDateToWidth(current.date, false) + barWidth + barPad*2 && mouseY > this.layout.topMargin && mouseY < this.layout.bottomMargin)
            {
                if(mouseX < this.layout.plotWidth()/2)
                {
                    boxOffset = 0;
                }
                else if(mouseX > this.layout.plotWidth()/2)
                {
                    boxOffset = -125;
                }
                //assigns the text shown in the textbox
                boxText = ("\n Clicks: " + current.clicks +  "\n Minutes Spent: " + floor(floor(current.time/1000)/60));
            }
            
            previous = current;
            
        }
        
        //draws box last so its on top of other drawings
        if(boxText)
        {
            stroke(1);
            fill(255);
            rect(mouseX + boxOffset, mouseY - 60, 125, 50);
            fill(1);
            noStroke();
            textSize(11);
            textAlign(LEFT, TOP);
            text(boxText, mouseX + boxOffset, mouseY - 60, 125, 50);
            textSize(14);
        }
        
    };
    
    //map clicks to height
    this.mapClicksToHeight = function(value) {
        return map(value,
               this.maxClicks,
               this.minClicks,
               this.layout.bottomMargin,   // Draw left-to-right from margin.
               this.layout.topMargin);
    };
    
    //map time spent to height
    this.mapTimeToHeight = function(value) {
        return map(value,
               this.minTime,
               this.maxTime,
               this.layout.bottomMargin,   // Draw left-to-right from margin.
               this.layout.topMargin);
    };  
    
    //map dates to width
    this.mapDateToWidth = function(value, convertFormat = true) {
        if(convertFormat == true)
        {
            value = formatDate(value, 'ISO');
        }
        return map(value.getTime(),
                   this.startdate.getTime(),
                   this.enddate.getTime(),
                   this.layout.leftMargin + this.layout.innerMargin(),   // Draw left-to-right from margin.
                   this.layout.rightMargin - this.layout.innerMargin());
    };

    
}



