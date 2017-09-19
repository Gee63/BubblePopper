(function ($, window, document, undefined) {

  'use strict';



  $.fn.nodoubletapzoom = function() {
    $(this).bind('touchstart', function preventZoom(e) {
      var t2 = e.timeStamp,
        t1 = $(this).data('lastTouch') || t2,
        dt = t2 - t1,
        fingers = e.originalEvent.touches.length;
      $(this).data('lastTouch', t2);
      if (!dt || dt > 500 || fingers > 1){return;} // not double-tap
      e.preventDefault(); // double tap - prevent the zoom
      // also synthesize click events we just swallowed up
      $(this).trigger('click').trigger('click');
    });
  };



  var mq = window.matchMedia( '(min-height: 600px)' );

  var time = 20,
    timer = $('#timer span'),
    score = 0,
    scoreLimit = 9,
    scorecard = $('#score span'),
    closeBtn = $('.popup-container .popup-inner .close'),
    mainContainer = $('.main-container'),
    playArea = $('#play-area'),
    start = $('#start.ready'),
    howToPlay = $('.how-to-play'),
    popupContainer = $('.popup-container'),
    popupContent = $('.popup-container .popup-inner .content'),
    moreInfoCopy = '<h1>Festeggia Ferragosto con noi partecipando a <span>Rompi le Bolle: sorprese ogni giorno!</span></h1>' +
      '<ul>Tra l&rsquo;<b>11</b> e il <b>15 agosto:</b>' +
      '<li><b>Vieni al casin&ograve; ogni giorno</b> e clicca su <b>Inizia a rompere le bolle</b> per aderire alla promozione</li>' +
      '<li>Dalla finestra che si aprir&agrave;, clicca su Inizia a giocare: avrai <b>20 secondi</b> per <b>rompere quante pi&ugrave; bolle possibile</b></li>' +
      '<li>Una volta che avrai rotto tutte le bolle necessarie, <b>scoprirai qual &egrave; la promozione del giorno</b></li>' +
      '<li>Se non ne romperai abbastanza per aggiudicarti il 	premio, <b>avrai la possibilit&agrave; di ritentare</b></li>' +
      '</ul>',
    oops = '<h1><span>Ops!</span></h1>' +
      '<p>Non hai rotto abbastanza bolle<br>per ricevere I&rsquo;offerta del giorno. Rompine almeno 10!</p>',
    congrats;

  /*moment - set congrats content to appropriate week content*/
//todays date
  var currentDay = moment().format('YYYY-DD-MM');

  //set dates for each week
  var day1 = ('2016-11-08'),
    day2 = ('2016-12-08'),
    day3 = ('2016-13-08'),
    day4 = ('2016-14-08'),
    day5 = ('2016-15-08');


  if (currentDay === day1) {
    console.log('day1');

    congrats = '<h1><span>Congratulazioni!</span></h1>' +
      '<p>Hai rotto tutte le bolle necessarie.</p>' +
      '<p>Hai ricevuto &euro;30 in giocate gratuite*:<br>fai una ricarica di almeno &euro;10 per sbloccarli.</p>' +
      '<p>*Accreditate immediatamente sul casin&ograve; installato o online.</p>';
  }

  if (currentDay === day2) {
    console.log('day2');

    congrats = '<h1><span>Congratulazioni!</span></h1>' +
      '<p>Hai rotto tutte le bolle necessarie.</p>' +
      '<p>Con una ricarica di &euro;15 sbloccherai 1 biglietto per il sorteggio da &euro;500 tra crediti bonus e giocate gratuite*.</p>' +
      '<p>I vincitori riceveranno il premio luned&igrave; 15 agosto.</p>' +
      '<p class="nb">*Le giocate gratuite saranno accreditate sul casin&ograve; installato o online.</p>';
  }

  if (currentDay === day3) {
    console.log('day3');

    congrats = '<h1><span>Congratulazioni!</span></h1>' +
      '<p>Hai rotto tutte le bolle necessarie.</p>' +
      '<p>Hai ricevuto Punti Fedelt&agrave; x5, per tutto il giorno,<br>su Summer Holiday e Mermaids Millions.</p>';
  }

  if (currentDay === day4) {
    console.log('day4');

    congrats = '<h1><span>Congratulazioni!</span></h1>' +
      '<p>Hai rotto tutte le bolle necessarie.</p>' +
      '<p>Hai ricevuto un bonus del 25%, fino a &euro;200 gratis,<br>sulla tua prossima ricarica di oggi.</p>' +
      '<p>La ricarica minima richiesta &egrave; di &euro;10,<br>e il bonus sar&agrave; accreditato immediatamente.</p>';
  }

  if (currentDay === day5) {
    console.log('day5');

    congrats = '<h1><span>Congratulazioni!</span></h1>' +
      '<p>Hai rotto tutte le bolle necessarie.</p>' +
      '<p>Hai ricevuto &euro;20 in giocate gratuite* senza ricarica. Per sbloccarle, esci dal casin&ograve; e accedi nuovamente. </p>' +
      '<p class="nb">*Accreditate immediatamente sul casin&ograve; installato o online.</p>';
  }

  function Congrats() {
    if (score > scoreLimit) {
      mainContainer.addClass('blur');
      popupContainer.css('display', 'block');
      popupContent.append(congrats);
    }
    else if (score <= scoreLimit) {
      mainContainer.addClass('blur');
      popupContainer.css('display', 'block');
      popupContent.append(oops);
      time = 20;
      score = 0;

      setTimeout(function(){
        start.addClass('ready');
      }, 1000);

    }

    /*remove all bubbles from game*/
    playArea.html('');
  }

  /*creating bubbles function*/
  function Bubbles() {

    /*make bubblesssss*/
    for (var i = 0; i < 3; i++) {
      var minLeft = 0,
        maxLeft = 95,
        left = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);

      var timeMax,
          timeMin;


        if (mq.matches) {
        // window width is at least 500px
            timeMax = 18;
            timeMin = 11;
      } else {
        // window width is less than 500px
          timeMax = 10;
            timeMin = 6;
      }





        var animationTime = Math.floor(Math.random() * (timeMax - timeMin + 1) + timeMin),
        bubble = '<div class="bubble" style="left:' + left + '%;' +
          '-webkit-animation:bubbleRise ' + animationTime + 's linear forwards;' +
          '-o-animation: bubbleRise ' + animationTime + 's linear forwards;' +
          'animation: bubbleRise ' + animationTime + 's linear forwards;">';

      playArea.append(bubble);

    }

  }

  /*playing the game function*/
  function Play() {

    new Bubbles();

    /*generate bubbles every ?? seconds*/
    var generateBubbles = setInterval(function () {
      new Bubbles();
    }, 2000);

    var countdown = setInterval(function () {

      console.log(time);
      timer.html(time);
      time = time - 1;

      if (time < 0) {
        console.log('times up!');
        new Congrats();
        playArea.removeClass('active');
        start.removeClass('ready');
        clearInterval(countdown);
        clearInterval(generateBubbles);
      }

    }, 1000);

  }

  /*popup scripts*/

  /*closeBtn.click(function () {
    $(this).parent().parent().css('display', 'none');
    mainContainer.removeClass('blur');
    popupContent.html('');
  });*/

  closeBtn.on('touchend', closeBtn, function (){
    $(this).parent().parent().css('display', 'none');
    mainContainer.removeClass('blur');
    popupContent.html('');
  });

  howToPlay.click(function () {
    mainContainer.addClass('blur');
    popupContainer.css('display', 'block');
    popupContent.append(moreInfoCopy);
  });


  $(function () {
    // FireShell

    console.log('ready');

  /*initial score of 0*/
    scorecard.html(score);



    start.click(function () {
      if (start.hasClass('ready')) {
        playArea.addClass('active');
        new Play();
      }
      else {
        console.log('game not ready');
      }

    });

    playArea.on('touchend', '.bubble', function () {
      $(this).nodoubletapzoom();

      $(this).addClass('popped');

     /* increment score with every pop*/
      score = score + 1;
      scorecard.html(score);

      /*once transition is complete display none to bubble to its not in the wayt of other visible bubbles*/
      $(this).on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        $(this).css('display', 'none');
      });
    });

  });

})(jQuery, window, document);


