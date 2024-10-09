function ClickPulse(x, y, diameter, minDiameter, speed, colour){
    
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.minDiameter = minDiameter;
    this.speed = speed;
    this.colour = colour;
    
    this.offsetDiameter = this.diameter - this.minDiameter; //offset so ellipse diameter does not increase beyond base diameter 
    this.angle = 0;
    this.isShrinking = true; //Bool tracks the shrinking phase
    this.isGrowing = false;  //Bool tracks the growth phase
    this.startPulse = false; //Initiates pulse
    
    this.clicksPerSecond = 0;
    this.pulseInterval;
    
    
    
    
    this.draw = function(clicks, milliseconds)
    {
        
        let pulseDiameter = this.minDiameter + (sin(this.angle + PI / 2) * this.offsetDiameter) / 2 + this.offsetDiameter / 2;
        if (this.startPulse == true) 
        {
            this.angle += this.speed;
            //Checks if pulse is shrinking growing
            if (floor(pulseDiameter) <= this.minDiameter) 
            {
                this.isShrinking = false;
                this.isGrowing = true;
            } 
            else if (ceil(pulseDiameter) >= this.diameter && this.isGrowing) 
            {
                //Stop the animation when one full cycle is completed and resets conditionals
                this.startPulse = false;
                this.angle = 0; //Resets angle
                this.isShrinking = true;
                this.isGrowing = false;
            }
        }

        strokeWeight(3)
        fill(colour); 

        ellipse(this.x, this.y, pulseDiameter, pulseDiameter); //Draws the pulse circle
        
        this.pulseInterval = this.checkClicksPerSecond(clicks, milliseconds); //sets pulse's next interval
    }
    
    //Recursively triggers a pulse when the timeout interval ends
    this.triggerPulse = function()
    {
        this.startPulse = true;
        setTimeout(this.triggerPulse.bind(this), this.pulseInterval);
    }
    
    //calculates click per second and returns the next pulse interval
    this.checkClicksPerSecond = function(clicks, milliseconds)
    {
        this.clicksPerSecond = clicks / (milliseconds/1000);
        return 1000 / this.clicksPerSecond;
    }
}