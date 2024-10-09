// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers (row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers (array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
       (layout.plotWidth() / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
            layout.bottomMargin / 2);
  rotate(- PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
                             decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign('right', 'center');

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces),
         layout.leftMargin - layout.pad,
         y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');
  // Add tick label.
  text(value,
       x,
       layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
         layout.topMargin,
         x,
         layout.bottomMargin);
  }
}

//Convert a date object to a string in the UK date format or convert a UK format date string back to a date object
function formatDate(date, newFormat)
{
    let newDate;
    
    if(newFormat == 'en-GB')
    {
        //sets to day,month,year format seperated by '/'
        newDate = new Intl.DateTimeFormat(newFormat, {dateStyle: 'short',}).format(date);
    }
    else if(newFormat == 'ISO')
    {
        let splitDate = split(date, '/'); //strips '/'
        newDate = new Date(Date.UTC(splitDate[02], splitDate[01]-1, splitDate[00])); //sets date using year/month/day format
    }
    return newDate; //returns the newly formated date or string
}

//converts array from local storage to a table object
function loadLocalTable(tableName, headers)
{
    newTable = new p5.Table();
    storedData = getItem(tableName);
    for(var i = 0; i < headers.length; i++)
    {
        newTable.addColumn(headers[i]); //adds headers to new table
    }
    if(storedData != null)
    {
        for(var i = 0; i < storedData.length; i++)
        {
            newRow = newTable.addRow(); //adds rows based on items in local storage array
            for(j = 0; j < headers.length; j++)
            {
                newRow.set(headers[j], storedData[i][j]);
            }
        }
    }

    return newTable;
    
}

//stores mouse tracking table to local storage
function autoSave()
{
    storeItem('mouseStats', mouseTable.getArray());
    console.log('saved');
}

