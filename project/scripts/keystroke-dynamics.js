$(document).ready(function() {
  data = {}
  calculatedData = {};
  timingData = {};
  cTime = null;
  cChar = null;
  pChar = null;
  pTime = null;
  testerData = {};
  testerTimingData = {};

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

  $('#testerreset').click(function() {
    testerData = {};
    testerTimingData = {};
    $('#tester').val('');
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
      calculatedData[x] = {};
      var total = 0;

      // get average
      for (var i = 0; i < data[x].length; i++) {
        total += data[x][i];
      }
      calculatedData[x]['average'] = total / data[x].length;
      calculatedData[x]['datapoints'] = data[x].length;

      // get std dev
      var stdDevTotal = 0;
      for (var i = 0; i < data[x].length; i++) {
        stdDevTotal += (data[x][i] - calculatedData[x]['average']) * (data[x][i] - calculatedData[x]['average']);
      }
      calculatedData[x]['stddev'] = Math.sqrt(stdDevTotal / data[x].length);
    }
    console.log(calculatedData);
  });

  $('#tester').keydown(function(e) {
    // ignore tabs and shift keys
    if (e.keyCode == 9 || e.keyCode == 16) {
      cChar = null;
      pChar = null;
      return;
    }

    q = new Date();
    cTime = q.getTime();
    cChar = e.keyCode;
    testerTimingData[convert(cChar)] = cTime;
    if (pChar != null) {
      seq = convert(pChar) + "-" + convert(cChar);
      if (testerData[seq] == null) {
        testerData[seq] = [];
      }
      testerData[seq].push(cTime - pTime);
    }
    pChar = cChar;
    pTime = cTime;
    //console.log(convert(cChar) + " key down time: " + cTime);
  });

  $('#tester').keyup(function(e) {
    // ignore tabs and shift keys
    if (e.keyCode == 9 || e.keyCode == 16) {
      cChar = null;
      pChar = null;
      return;
    }

    q = new Date();
    w = q.getTime();
    ch = convert(e.keyCode);
    if (testerData[ch] == null) {
      testerData[ch] = [];
    }
    testerData[ch].push(w - testerTimingData[ch]);
    //console.log(convert(e.keyCode) + " key up time: " + w);

    // check how close you are
    var tested = 0;
    var valid = 0;
    for (x in testerData) {
      if (calculatedData[x] != null) {
        for (var i = 0; i < testerData[x].length; i++) {
          tested += 1;
          if (calculatedData[x]['average'] - calculatedData[x]['stddev']*1.5 <= testerData[x][i] &&testerData[x][i] <= calculatedData[x]['average'] + calculatedData[x]['stddev']*1.5) {
            valid += 1;
          }
        }
      }
    }
    $('#validity').html(valid + " / " + tested);
  });
});
