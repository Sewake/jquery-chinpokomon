$( function() {
	var buttons = $(".section button");
	var status = $("#status");

	var calm = new Audio('audio/calm.mp3');
	calm.volume = 0.2;
	var battle = new Audio('audio/battle.mp3');
	battle.volume = 0.4;
	var sad = new Audio('audio/sad.mp3');
	var chimpokomon = new Audio('audio/chimpokomon.mp3');

	var items = 2;
	var life;
	var pokeball = true;
	var bonbon = true;
	var katana = false;
	var yellowgun = false;

	startGame();
	$(".inventory").hide();

	// Cet évènement permet aux boutons crées dynamiquement avec jQuery (quand vous récupérez le katana), de pouvoir être utilisé
	$(".section").on('click', '.new', function(){
		$(this).closest("div").fadeOut(100);
    	var key = $(this).attr("go");
		gotoSection(key);

		var use = $(this).attr("use");
		if(use){
			useItemAndUpdate(use);	
		}
	});

	buttons.click( function() {
		$(this).closest("div").hide();
		$(".screen").hide();
		var key = $(this).attr("go");
		gotoSection(key);

		var item = $(this).attr("item");
		if(item){
			addItem(item);	
		}

		var use = $(this).attr("use");
		if(use){
			useItemAndUpdate(use);	
		}

		if($(this).hasClass("lifelost")){
			loseOneLife();
		}
		if($(this).hasClass("lifegain")){
			winOneLife();
		}
	} );

	$(".bag").click( function() {
		$(this).toggleClass("open");
		$(".inventory").slideToggle(250);
    });
	
	function gotoSection(key) {
		$("[id='" + key + "']").fadeIn(259);
		$(".screen").fadeIn(250);
		var pic = $("[id='" + key + "']").attr("pic");
		$(".screen").css("background", "url(img/" + pic + ".jpg)");

		if(key=="intro"){
			restartGame();
		}
		if(key=="begin"){
			calm.play();
		}
		if(key=="tournage" || key=="battle" || key=="dead"){
			calm.pause();
		}
		if(key=="jail" || key=="raquette" || key=="dead" || key=="pokeball"){
			battle.pause();
		}

		if(key=="jail" || key=="dead" || key=="tournage" || key=="concede" || key=="pokeball"){
			sad.play();
		}

		if(key=="victory" || key=="raquette"){
			chimpokomon.play();
		}

		if(key=="battle"){
			battle.play();
			flashLoop(5,"black");
		}
	}
	
	function setLife(v) {
		life = v;
	}
	
	function loseOneLife() {
		$("img.life").eq(life-1).hide();
		$("body").effect( "highlight", {color:"red"}, 300);
		life--;
		
		if(life<=0)
			endGame();
	}

	function winOneLife() {
		if(life<3){	
			$("img.life").eq(life).show();
			life++;
		}
		$("body").effect( "highlight", {color:"green"}, 300);
	}
	

	function addItem(item){
		$(".case").eq(items).css("background", "url(img/" + item + ".jpg)");
		items++;
		if(item=="yellowgun")
			yellowgun=true;
		if(item=="katana"){
			katana=true;
			var bouton = "<button go='jail' class='new' use='katana'>Vous dégainez votre Katana gentiment offert par le réalisateur et découpez le Chimpokomon.</button>";
			var bouton2 = "<button go='victory' class='new' use='katana'>Vous dégainez votre Katana, il est temps de donner une leçon à la team Raquette !</button>";
			$("#battle").append(bouton);
			$("#bbattle").append(bouton);
			$("#cbattle").append(bouton);
			$("#raquette").append(bouton2);
		}
	}

	// Je pense qu'il doit y avoir bien plus optimisé que de tester chaque condition une par une, mais je n'ai pas trouvé de meilleure idée pour dynamiser l'inventaire
	function useItemAndUpdate(use){
		$(".case").css("background", "url(img/empty.jpg)");
		items = 0;
		if(use=="pokeball"){
			pokeball = false;
		}
		if(use=="bonbon"){
			bonbon = false;
		}
		if(use=="katana"){
			katana = false;
		}
		if(use=="yellowgun"){
			yellowgun = false;
		}
		if(pokeball){
			$(".case").eq(items).css("background", "url(img/pokeball.jpg)");
			items++;
		}
		if(bonbon){
			$(".case").eq(items).css("background", "url(img/bonbon.jpg)");
			items++;
		}
		if(katana){
			$(".case").eq(items).css("background", "url(img/katana.jpg)");
			items++;
		}
		if(yellowgun){
			$(".case").eq(items).css("background", "url(img/yellowgun.jpg)");
			items++;
		}
	}

	function flashLoop(loop, couleur){
		for(i = 0; i<loop;i++){
			$("body").effect( "highlight", {color: couleur}, 300);
		}
	}
	
	function startGame() {
		$("div.section").hide();
		$("div.section").eq(0).show();
		$("div.screen").show();
		setLife(3);
		$(".life").show();
		$(".inventory div").eq(0).css("background", "url(img/pokeball.jpg)");
		$(".inventory div").eq(1).css("background", "url(img/bonbon.jpg)");
	}

	function endGame() {
		calm.pause();
		battle.pause();
		sad.play();
		$("div.section").hide();
		$("#dead").show();
		$(".screen").css("background", "url(img/dead.jpg)");
	}

	function restartGame(){
		$(".new").remove();
		$(".case").css("background", "url(img/empty.jpg)");
		items=2;
		pokeball = true;
		bonbon = true;
		katana = false;
		yellowgun = false;
		sad.pause();
		calm.currentTime = 0;
		battle.currentTime = 0;
		sad.currentTime = 0;
		startGame();
	}
} );