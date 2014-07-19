// Initialize your app
var myApp = new Framework7({
    modalTitle: 'Toupy'
});

// Export selectors engine
var $$ = Framework7.$;

// Add views
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var toupyData = localStorage.td7Data ? JSON.parse(localStorage.td7Data) : [];
localStorage.td7Data = '';

$$('.popup.game').on('open', function () {
    $$('body').addClass('with-popup');
});
$$('.popup.game').on('opened', function () {
    gameStart();
});
$$('.popup.game').on('close', function () {
	$$('body').removeClass('with-popup');
});


// Build toupy HTML
var toupyItemTemplate = $$('#toupy-item-template').html();
function buildtoupyListHtml() {
    var html = '';
    for (var i = 0; i < toupyData.length; i++) {
        var toupyItem = toupyData[i];
        html += toupyItemTemplate
                    .replace(/{{title}}/g, toupyItem.title)
                    .replace(/{{date}}/g, toupyItem.date)
                    .replace(/{{id}}/g, toupyItem.id);
    }
    $$('.toupy-items-list ul').html(html);
}
// Build HTML on App load
buildtoupyListHtml();

// Delete item
$$('.toupy-items-list').on('delete', '.swipeout', function () {
    var id = $$(this).attr('data-id') * 1;
    var index;
    for (var i = 0; i < toupyData.length; i++) {
        if (toupyData[i].id === id) index = i;
    }
    if (typeof(index) !== 'undefined') {
        toupyData.splice(index, 1);
        localStorage.td7Data = JSON.stringify(toupyData);
    }
});

// Update app when manifest updated 
// http://www.html5rocks.com/en/tutorials/appcache/beginner/
// Check if a new cache is available on page load.
window.addEventListener('load', function (e) {
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            myApp.confirm('A new version of toupy is available. Do you want to load it right now?', function () {
                window.location.reload();
            });
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);
}, false);


	game = 0;
	getPointPostion();
	function decompte() {
    	document.getElementById("compt").innerHTML = compte;
        if(compte == 0 || compte < 0) {
	        compte = 0;
	        myApp.closeModal('.game');
			addscore();
	        clearInterval(timer);
        }
		compte--;
	}
	
	function gameStart() {
		score = 5;
		compte = 2000;
		game = 1;
		
		
		$$('.score').html(score);
		
		$$('.point').on('mouseover touchstart click', function() {
			r = getPointPostion();
			score = getScore(score, r);
		});
		timer = setInterval('decompte()',0);
	}

	function addscore() {
		if(game == 1) {			
		    game = 0;
		     var d = new Date();
		    var curr_date = d.getDate();
		    var curr_month = d.getMonth() + 1; //Months are zero based
		    if(curr_month.length === 1) {
			    curr_month = 0 + curr_month;
		    }
		    var curr_year = d.getFullYear();
			var title = score;
		    if (title.length === 0) {
		        return;
		    }
		    var date = curr_date + "/" + curr_month + "/" + curr_year;
		    toupyData.push({
		        title: title,
		        date: date,
		        id: (new Date()).getTime()
		    });
		    localStorage.td7Data = JSON.stringify(toupyData);
		    buildtoupyListHtml();
	    	showscore();
		}
	}
	function gameRandom(min, max) {
	  return Math.floor(Math.random() * (max - min + 1) + min);
	}
	function getPointPostion(){
		cx = gameRandom(7,93);
		cy = gameRandom(40,60);
		r = gameRandom(9,10);
		
		$$('.point').css('fill', '#' + (function co(lor){   return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length == 6) ?  lor : co(lor); })(''));
	    $$('.point').css('stroke', '#' + (function co(lor){   return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length == 6) ?  lor : co(lor); })(''));
	    
		$$('.point').attr('cx', cx + '%');
		$$('.point').attr('cy', cy + '%');
		$$('.point').attr('r', r + '%');
		return r;
	} 
	function getScore(score, r) {
		point = r;
		$$('.score').html(score);
		return score + point;
	}
	function showscore() {
	     myApp.addNotification({
	        title: 'Levideance',
	        subtitle: 'Game Over!',
	        message: 'Well done! You just make a score of ' + score +'!',
	        media: '<img width="44" height="44" style="border-radius:100%" src="img/icon-57.png">'
	    });
	}
	
	document.getElementById('game-scroll').ontouchmove = function(e){
	    e.preventDefault();
	}