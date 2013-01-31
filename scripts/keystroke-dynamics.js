data = {}
calculatedData = {};
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
  $('#p1').val('');
  $('#p2').val('');
  $('#p3').val('');
  $('#p4').val('');
  $('#p5').val('');
});

$('#p1,#p2,#p3,#p4,#p5').keydown(function(e) {
  // ignore tabs
  if (e.keyCode == 9) {
    cChar = null;
    pChar = null;
    return;
  }

  q = new Date();
  cTime = q.getTime();
  cChar = e.keyCode;
  if (pChar != null) {
    seq = convert(pChar) + "-" + convert(cChar);
    if (data[seq] == null) {
      data[seq] = [];
    }
    data[seq].push(cTime - pTime);
  }
});

$('#p1,#p2,#p3,#p4,#p5').keyup(function(e) {
  // ignore tabs
  if (e.keyCode == 9) {
    cChar = null;
    pChar = null;
    return;
  }

  q = new Date();
  w = q.getTime();
  ch = convert(cChar);
  if (data[ch] == null) {
    data[ch] = [];
  }
  data[ch].push(w - cTime);
  pChar = cChar;
  pTime = w;
});

$('#calculate').click(function() {

});
