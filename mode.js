function ai(){
	var aiButton = document.getElementById('ai');
	aiButton.className +=' active';
	var pvpButton = document.getElementById('pvp');
	pvpButton.className = 'btn-empty';
	window.location.href='./ai.html';
}
function pvp(){
	var aiButton = document.getElementById('ai');
	aiButton.className ='btn-empty';
	var pvpButton = document.getElementById('pvp');
	pvpButton.className += ' active';
	window.location.href='./';
}
