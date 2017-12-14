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


//Win
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
		}
		if(!gameover){
			color = !color;
			computer();
		}
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
		piecesOnChess -=2;
		undoTimes++;
		gameover=false;
		//将累计的赢法从组中删除
		bx=record[record.length-2][0];
		by=record[record.length-2][1];
		wx=record[record.length-1][0];
		wy=record[record.length-1][1];
		if(color == true){
			for(var k =0; k<count; k++){
				if(win[bx][by][k]){
					blackWin[k]--;
					console.log('hi'+bx+','+by);
				}
				if(win[wx][wy][k]){
					whiteWin[k]--;
					console.log('hi'+wx+','+wy);
				}
			}
		}
		wLastRecord = record[piecesOnChess+1];
		bLastRecord = record[piecesOnChess];

		lastStep = recordImg[piecesOnChess];
		var map = new Image();
		map.src = lastStep;
		map.onload = function(){
			ctx.drawImage(map,0,0);
		};
		ifonboard[wLastRecord[0]][wLastRecord[1]]=0;
		ifonboard[bLastRecord[0]][bLastRecord[1]]=0;

		undoImg.push(recordImg[recordImg.length-1]);
		undoRecord.push(record[record.length-1]);
		record.splice(record.length-2,2);
		recordImg.splice(recordImg.length-2,2);
	}
}

//redo
function redo(){
	if(redoTimes<undoTimes){
		piecesOnChess +=2 ;
		redoTimes++;
		piecesColor(bLastRecord[0],bLastRecord[1],1);
		record.push(bLastRecord);
		recordImg.push(undoImg[undoImg.length-1]);
		for(var k =0; k<count; k++){
			if(win[bLastRecord[0]][bLastRecord[1]][k]){
				blackWin[k]++;
				if(blackWin[k] == 5){
					window.alert('- o -  黑子赢 !');
					gameover = true;
				}
			}
		}
		ifonboard[bLastRecord[0]][bLastRecord[1]]=bLastRecord[2];
		color=!color;
		console.log(record,recordImg);
		computer();
	}
}


//AI
function computer(){
	var myScore =[];
	var computerScore=[];
	var max = 0;
	var u = 0, v=0;
	for(var i = 0; i<15 ; i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0; j<15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i = 0;i<15 ; i++){
		for(var j = 0; j<15; j++){
			if(ifonboard[i][j] == 0){
				for(var k=0; k<count; k++){
					if(win[i][j][k]){
						if(blackWin[k] == 1){
							myScore[i][j] +=200;
						}else if(blackWin[k] == 2){
							myScore[i][j] +=400;
						}else if(blackWin[k] == 3){
							myScore[i][j] +=2000;
						}else if(blackWin[k] == 4){
							myScore[i][j] +=10000;
						}
						if(whiteWin[k] == 1){
							computerScore[i][j] +=220;
						}else if(whiteWin[k] == 2){
							computerScore[i][j] +=420;
						}else if(whiteWin[k] == 3){
							computerScore[i][j] +=2200;
						}else if(whiteWin[k] == 4){
							computerScore[i][j] +=20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j]> myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	console.log(myScore);
	piecesColor(u, v ,false);
	ifonboard[u][v] = 2;
	type=2;
	record.push([u,v,type]);
	snap();

	for(var k=0; k<count; k++){
		if(win[u][v][k]){
			whiteWin[k]++;
			if(whiteWin[k]==5){
				window.alert('白子赢了');
				gameover = true;
				return;
			}
		}
	}
	if(!gameover){
		color = !color;
	}
}
