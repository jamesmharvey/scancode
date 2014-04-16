//library functions

String.prototype.insert = function (index, string) {
    if (index > 0)
	return this.substring(0, index) + string + this.substring(index, this.length);
  else
      return string + this;
};


function parseninehex (hexstr) {
    if (hexstr == "000000000") {return [0, 0, 0, 0, 0, 0]}
    var octstr = parseInt(hexstr, 16).toString(8); //convert hex to octal
    if ((octstr.length)%2) {octstr = "0" + octstr}; //pad octal so there are an even number of digits
    var octarray = octstr.match(/../g); //break octal into 2-character arrays
    return octarray.map(function(str) {return parseInt(str,8)}).sort(function(a,b){return a-b}); //parse octal as numbers
}

function parsewholecode (hexstr) {
    var ret = {};
    ret.original = hexstr;
    ret.prefix = hexstr.slice(0,14);
    hexstr = hexstr.slice(14);
    var hexarray = hexstr.match(/.{9}/g);
    if (hexarray.indexOf("000000000") > -1) {
	hexarray = hexarray.slice(0,hexarray.indexOf("000000000"))
    }
    var lastnum = hexarray[hexarray.length-1];
    var postfixindex = hexstr.lastIndexOf(lastnum)+9;
    ret.postfix = hexstr.slice(postfixindex);
    ret.numbers = hexarray.map(parseninehex);
    var humanstr = ret.original.insert(14, " ");
    for (i in ret.numbers) {
	humanstr = humanstr.insert(24+10*i," ")
    }
    ret.humanstr = humanstr;
    return ret
}

function showticket (ticket) {
    $(".ticket .formattedbarcode").text(ticket.humanstr);
    $(".ticket .prefix").text("prefix: " + ticket.prefix);
    $('.numbers').html('');
    for (i in ticket.numbers) {
	$('.numbers').append('<tr><td>' + ticket.numbers[i].join(' ') + '</tr></td>');	
    }
}

if (Meteor.isClient) {
  Template.hello.events({
    'submit' : function () {
	var ticket = parsewholecode($("[name='serial'").val());
	showticket(ticket);
	event.preventDefault();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

