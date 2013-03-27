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
  testText = ''; // the text that should be typed in
  numSamples = 0;

  var convert = function(pChar) {
    charDisp = String.fromCharCode(pChar);
    if (pChar == 8)
      charDisp = "backspace";
    else if (pChar == 32)
      charDisp = "space";
    return charDisp;
  }

  $('#data-input').keydown(function(e) {
    // ignore tabs and shift keys
    if (e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 13) {
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

  $('#data-input').keyup(function(e) {
    // reset the input on enter key
    if (e.keyCode == 13) {
      numSamples += 1;
      $('#sample-count-display').html(numSamples + " samples");
      if (testText == '') {
        testText = $(this).val();
      }
      calculate();
      $(this).val('');
      cChar = null;
      pChar = null;
      return;
    }
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

  var calculate = function() {
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
  };

  $('#test-input').keydown(function(e) {
    // ignore tabs and shift and enter keys
    if (e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 13) {
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

  $('#test-input').keyup(function(e) {
    // reset stuff on enter key
    if (e.keyCode == 13) {
      testerData = {};
      testerTimingData = {};
      $('#test-input').val('');
      cChar = null;
      pChar = null;
      return;
    }

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
    $('#correctness-display').html(valid + " / " + tested);
    if ($(this).val() != testText) {
      $('#validity-display').css({"color": "red"});
      $('#validity-display').html("WRONG PASSWORD");
    } else if (valid / tested < 0.7) {
      $('#validity-display').css({"color": "red"});
      $('#validity-display').html("CORRECT PASSWORD, WRONG USER");
    } else {
      $('#validity-display').css({"color": "green"});
      $('#validity-display').html("CORRECT PASSWORD AND USER");
    }
  });
});
