var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//chess board
var width= 500;
var height= 500;
var gap=480/14;
var img = new Image();
var color = true ;
img.src = './chessboard.jpg';
img.onload = function(){
	ctx.drawImage(img, 0, 0 , width ,height);
	drawChessBoard();
	init();
};
function drawChessBoard(){
	for(i=0;i<=15;i++){
		ctx.moveTo(10,10+480/14*i);
		ctx.lineTo(490,10+480/14*i);
		ctx.stroke();
		ctx.moveTo(10+480/14*i,10);
		ctx.lineTo(10+480/14*i,490);
		ctx.stroke();
	}
}
	//check if pieces is on board
var ifonboard=[];
for (var x = 0; x<15; x++){
	ifonboard[x] = [];
	for(var y = 0; y <15; y++){
		ifonboard[x][y]= 0;
	}
}
	//record step snap pieces
var piecesOnChess = 0;
var record =[];
var recordImg=[];
var undoTimes=0;
var redoTimes=0;
var undoImg=[];
var undoRecord=[];

// Win array
var gameover = false;
var win = [];
var blackWin = [];
var whiteWin = [];

for(var i = 0; i < 15; i++){
	win[i] = [];
	for(var j = 0; j < 15; j++){
		win[i][j] = [];
	}
}

var count = 0;

for(var i = 0; i< 15; i++){
	for(var j = 0; j<11; j++){
		for(var k =0; k<5; k++){
			win[i][j+k][count] = true;
		}
		count++;
	}
}
for(var i = 0; i< 15; i++){
	for(var j = 0; j<11; j++){
		for(var k =0; k<5; k++){
			win[j+k][i][count] = true;
		}
		count++;
	}
}
for(var i = 0; i< 11; i++){
	for(var j = 0; j<11; j++){
		for(var k =0; k<5; k++){
			win[i+k][j+k][count] = true;
		}
		count++;
	}
}
for(var i = 0 ; i< 11; i++){
	for(var j = 4; j<15 ; j++){
		for(var k = 0; k<5 ; k++){
			win[i+k][j-k][count] = true;
		}
		count++;
	}
}

for(var i = 0; i<count; i++){
	blackWin[i] = 0;
	whiteWin[i] = 0;
}
//luozi
canvas.onclick = function(e){
	if(gameover){
		return;
	}
	var h = e.offsetX;
	var s = e.offsetY;
	var x = Math.floor(h/gap);
	var y = Math.floor(s/gap);
	if(ifonboard[x][y] == 0){
		piecesColor(x,y,color);
		if(color){
			ifonboard[x][y] = 1;
			type =1;
			record.push([x,y,type]);
			for(var k =0; k<count; k++){
				if(win[x][y][k]){
					blackWin[k]++;
					console.log(blackWin[k]);
					if(blackWin[k] == 5){
						window.alert('- o -  黑子赢 !');
						gameover = true;
					}
				}
			}
		}else{
			ifonboard[x][y] = 2;
			type =2;
			record.push([x,y,type]);
			for(var k =0; k<count; k++){
				if(win[x][y][k]){
					whiteWin[k]++;
					if(whiteWin[k] == 5){
						window.alert('- o - 白子赢 !');
						gameover = true;
					}
				}
			}
		}
		color = !color;
		snap();
	}
}
//chess pieces
function piecesColor(x,y,color){
	if(color == true){
		color ='#000';
	}else{
		color ='#fff';
	}
	ctx.beginPath();
	ctx.arc(gap*x+10,gap*y+10,10,0,2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}
function init(){
	recordImg.push(canvas.toDataURL());
}
function snap(){
	piecesOnChess++;
	recordImg.push(canvas.toDataURL());
}

//undo
function undo(){
	if(piecesOnChess>0){
		piecesOnChess--;
		undoTimes++;
		gameover=false;
		x=record[record.length-1][0];
		y=record[record.length-1][1];
		if(color == false){
			for(var k =0; k<count; k++){
				if(win[x][y][k]){
					blackWin[k]--;
					console.log(blackWin[k]);
				}
			}
		}else{
			for(var k =0; k<count; k++){
				if(win[x][y][k]){
					whiteWin[k]--;
					console.log(whiteWin[k]);
				}
			}
		}
		lastRecord = record[piecesOnChess];
		lastStep = recordImg[piecesOnChess];
		var map = new Image();
		map.src = lastStep;
		map.onload = function(){
			ctx.drawImage(map,0,0);
		};
		color=!color;
		ifonboard[lastRecord[0]][lastRecord[1]]=0;
		undoImg.push(recordImg[recordImg.length-1]);
		undoRecord.push(record[record.length-1]);
		record.pop();
		recordImg.pop();
		console.log(record,recordImg);

	}
}

//redo
function redo(){
	if(redoTimes<undoTimes){
		piecesOnChess++;
		redoTimes++;
		record.push(undoRecord[undoRecord.length-1]);
		recordImg.push(undoImg[undoImg.length-1]);
		var map = new Image();
		undoStep = undoImg[undoImg.length-1];
		map.src = undoStep;
		map.onload = function(){
			ctx.drawImage(map,0,0);
		};
		undoImg.pop();
		color=!color;
		lastRecord = record[piecesOnChess-1];
		ifonboard[lastRecord[0]][lastRecord[1]]=lastRecord[2];
		console.log(record,recordImg);
	}
}
