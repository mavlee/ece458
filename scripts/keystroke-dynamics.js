data = {}
calculatedData = {};
timingData = {};
cTime = null;
cChar = null;
pChar = null;
pTime = null;

function convert(pChar) {
  charDisp = String.fromCharCode(pChar);
  if (pChar == 8)
    charDisp = "backspace";
  else if (pChar == 32)
    charDisp = "space";
  return charDisp;
}

$('#displayData').click(function() {
  console.log(data);
});

$('#reset').click(function() {
  data = {};
  timingData = {};
  cTime = null;
  cChar = null;
  pChar = null;
  pTime = null;
  $('#p1').val('');
  $('#p2').val('');
  $('#p3').val('');
  $('#p4').val('');
  $('#p5').val('');
});

$('#p1,#p2,#p3,#p4,#p5').keydown(function(e) {
  // ignore tabs and shift keys
  if (e.keyCode == 9 || e.keyCode == 16) {
    cChar = null;
    pChar = null;
    return;
  }

  q = new Date();
  cTime = q.getTime();
  cChar = e.keyCode;
  timingData[convert(cChar)] = cTime;
  if (pChar != null) {
    seq = convert(pChar) + "-" + convert(cChar);
    if (data[seq] == null) {
      data[seq] = [];
    }
    data[seq].push(cTime - pTime);
  }
  pChar = cChar;
  pTime = cTime;
  //console.log(convert(cChar) + " key down time: " + cTime);
});

$('#p1,#p2,#p3,#p4,#p5').keyup(function(e) {
  // ignore tabs and shift keys
  if (e.keyCode == 9 || e.keyCode == 16) {
    cChar = null;
    pChar = null;
    return;
  }

  q = new Date();
  w = q.getTime();
  ch = convert(e.keyCode);
  if (data[ch] == null) {
    data[ch] = [];
  }
  data[ch].push(w - timingData[ch]);
  //console.log(convert(e.keyCode) + " key up time: " + w);
});

$('#calculate').click(function() {
  for (x in data) {
    var values = data[x];
    timingData[x] = {};
    var total = 0;

    // get average
    for (var i = 0; i < data[x].length; i++) {
      total += data[x][i];
    }
    timingData[x]['average'] = total / data[x].length;
    timingData[x]['datapoints'] = data[x].length;

    // get std dev
    var stdDevTotal = 0;
    for (var i = 0; i < data[x].length; i++) {
      stdDevTotal += (data[x][i] - timingData[x]['average']) * (data[x][i] - timingData[x]['average']);
    }
    timingData[x]['stddev'] = Math.sqrt(stdDevTotal / data[x].length);
  }
  console.log(timingData);
});
