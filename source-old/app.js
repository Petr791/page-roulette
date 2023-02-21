function price_rub() {
    $('.dlrprice').each(function () {
        var price = $(this);
        price.hide();
	});
    $('.rubprice').each(function () {
        var price = $(this);
        price.show();
	});
};

function price_dlr() {
    $('.rubprice').each(function () {
        var price = $(this);
        price.hide();
	});
    $('.dlrprice').each(function () {
        var price = $(this);
        price.show();
	});
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function showerr(data) {
    $().toastmessage('showToast', {
        text: data,
        sticky: false,
        position: 'top-right',
        type: 'warning'
	});
}

function showmsg(data) {
    $().toastmessage('showToast', {
        text: data,
        sticky: false,
        position: 'top-right',
        type: 'notice'
	});
}

function sendData() {
    var email = $('input[name=email]').val().toLowerCase();
    var countAccs = $('input[name=count]').val() || 0;
    var selectType = $('select[name=item]').val();
	var rules = $('input[name=rules_accept]:checked').val();
	var preOrder = $('input[name=preOrder]:checked').val();
    var minCount = $('option[value="' + selectType + '"]').attr('data-min_order');

  

    // var countType = $('td[data-id=' + selectType + ']').html();
	// var forms 

	if($('[logged_by_tg]').length == 0){

		// console.log($('[logged_by_tg]').length);
		
		    if (!validateEmail(email)) {

		    	 if($("meta[lang_cart]").length == 1){
		        var err = 'Please enter valid email';
		    	}else{
		    		  var err = 'Указан неверный email адрес';
		    	}
		        showerr(err);
		        return false;
			}

	}
	
	  var stateOrder = $('body').data('orderWait');
			if(parseInt(stateOrder) == 1){
				    showerr('Подождите....');
				    return false;
			}

	if(parseInt(selectType) != 4){
		var function_order = '';
		check_form_compos();

	if (parseInt(countAccs) < parseInt(minCount)) {
        var err = 'Мин. кол-во для заказа: ' + minCount;
        showerr(err);
        return false;
	}
   //  	if (parseInt(countType) < parseInt(countAccs)) {
		 //        var err = 'Такого количества товара нет';
		 //        showerr(err);
		 //        return false;
			// } 

	}
	else{
		var function_order = 'createcart';
	}

	 if($("meta[lang_cart]").length == 1){
      
      var path = '/en/order/';
    }
    else{
      
           var path = '/order/';
    }	

    	$('body').data('orderWait',1);
    	
  
    $.post(path+function_order, {
    
        email: email,
        count: countAccs,
		rules: rules,
		en_sub: $('input[name=email_sub]:checked').val(),
        type: selectType,
		forms: collect_value(),
        fund: $('select[name=funds]').val(),
		'copupon': $('#copupon').val(),
		'cartItems':  $('input[name=cartItems]').val(),
		'g-recaptcha-response':$('[name=g-recaptcha-response]').val(),
		preOrder:preOrder
		}, function (data) {

			

        try {


        		if (typeof (grecaptcha) !== "undefined") {

		grecaptcha.reset();

	}
	
            var res = JSON.parse(data);
            if (res.ok == 'TRUE') {
				
				if(res.redirect == 'yes'){
						$('body').data('orderWait',0);
					// location=res.url;
					document.location.href=res.url;
					// location.replace(res.url);
					// window.location.reload(res.url);
					// document.location.replace(res.url);
				}
				else{
						$('body').data('orderWait',0);
					$('.paytable .payitem').text(res.name);
					$('.paytable .paycount').text(res.count);
					$('.paytable .payprice').text(res.price);
					$('.paytable .payfund').html(res.fund);
					$('.paytable .paybill').html(res.bill);
					$('.paytable .discount').html(res.discount);
					$('.paytable .bonuspr').html(res.bonus);
					$('.paytable .link').html(res.linkwm);
					$('.checkpaybtn').attr('onclick', "checkpay('" + res.check_url + "')");
					var newpay = $('.modalpay').attr('newpay');
					if(newpay == '1'){	
						var inst = $('[data-remodal-id=paymodal]').remodal();
						inst.open();
						}else{
						$('#paymodal').modal('toggle');
					}
					if(res.btc == 'yes'){
						$('.hide_btc_pay').hide();
						$('.btc_text').show();
						$('.txt_info').hide();
					}
					else{
						$('.hide_btc_pay').show();
						$('.btc_text').hide();
						$('.txt_info').show();
					}
				}
			}
			if (typeof (res.error) !== "undefined" && res.error !== null) {
				$('body').data('orderWait',0);
                showerr(res.error);
			}
			} catch (err) {
				$('body').data('orderWait',0);
			alert('Что-то пошло не так, попробуйте еще раз');
		}
	});
}

function checkpay(url) {
	$('.checkpaybtn').button('loading');
	$.get(url, function (data) {
		$('.checkpaybtn').button('reset');
		var res = JSON.parse(data);
		if (res.status == "wait_30_sec") {
			showerr(res.message);
			throw "stop";
		}
		if (res.status == "reset_pass") {
			alert('Владельцу магазина необходимо обновить пароль своего QIWI кошелька! ')
			throw "stop";
		}
		if (res.status == "Bad_log_pass" || res.status == "error_log_pass") {
			alert('Владельцу магазина необходимо проверить правильность ввода данных QIWI кошелька! ')
			throw "stop";
		}
		
		if (res.status == "ok") {
			$('.checkpaybtn').attr('onclick', 'window.location ="' + res.chkurl + '"');
			$('.checkpaybtn').text('Скачать');
			} else {
			alert('Платеж не найден :(  Попробуйте еще раз через мгновение :) ')
		}
	});
}




function chkp(url) {
	$('.checkpaybtnr').button('loading');
	$.get(url, function (data) {
		$('.checkpaybtnr').button('reset');
		var res = JSON.parse(data);
		
		if (res.status == "wait_30_sec") {
			showerr(res.message);
			throw "stop";
		}
		if (res.status == "ok") {
			$('.checkpaybtnr').attr('onclick', 'window.location ="' + res.chkurl + '"');
			$('.checkpaybtnr').text('Скачать');
			} else  {
			alert('Увы , но платеж не найден.')
		}
	});
}

function qq(){
	var search =  $('#search').val();
	$.ajax({
		type: 'GET',
		url: '/',
		data: "search="+search,
		success: function(data){
			$('div.layer').html(data);
		}
	});
}


$(document).ready(function(){ 
	
	if( $('.pay_btns').attr('data-status') == '1'){
		$('input[name=rules_accept]').click(function(){
			state = $(this).is(':checked');
			if(state == false){
				$('.pay_btns').css('opacity','0.3');
				$('.pay_btns').css('pointer-events','none');
			}
			else if( state == true) {
				$('.pay_btns').css('opacity','1');
				$('.pay_btns').css('pointer-events','auto');
			}
		});
	}
	
});



function getinputforms(id){
	
	if(parseInt(id) == 4){
		return false;
	}

	$('.composInput').remove();
	var className = 'formcomposer';
	var newpay = $('.modalpay').attr('newpay');	
	$.post("/goods/formjson", {
        id: id,
		}, function(data) {
		var jsondata = JSON.parse(data);		
		for(var F in jsondata) {
		if ( $(".nope_tpl").hasClass("nope_yes") ) {
				$('.'+className).append('<input name="forms['+jsondata[F].id+']" placeholder="'+jsondata[F].name+'" nameinput="'+jsondata[F].name+'" req="'+jsondata[F].required+'" class="composInput form-control input-small input_bld"   style="text-align: center;margin-top: 5px;">');
			}
			else{
			if($('body').attr('paypage') == '1'){
			$('.'+className).append('<label for="input_'+jsondata[F].id+'">'+jsondata[F].name+'</label> <input name="forms['+jsondata[F].id+']" placeholder="'+jsondata[F].name+'" nameinput="'+jsondata[F].name+'" req="'+jsondata[F].required+'" class="composInput input_bld form-control">');
				continue;
			}
			if (newpay == '1') {
				$('.'+className).append('<tr class="composInput"><td>'+jsondata[F].name+':</td><td><input type="text" nameinput="'+jsondata[F].name+'" req="'+jsondata[F].required+'" class="form-leque-control input-leque-sm input_bld"  name="forms['+jsondata[F].id+']"></td></tr>');
			
			}
			else{
				$('.'+className).append('<tr class="composInput"><td>'+jsondata[F].name+':</td><td><input type="text" nameinput="'+jsondata[F].name+'"  req="'+jsondata[F].required+'" class="form-control input-small input_bld"  name="forms['+jsondata[F].id+']"></td></tr>');
			}
			}
		}		
	});
}

function check_form_compos(){
	
	var items_search = $('.formcomposer');
	var items_input = items_search.find(".input_bld");
	items_input.each(function(){

		if($(this).attr('req') == 'yes' && !$(this).val() ){
			$('input[name="'+$(this).attr('name')+'"]').attr('placeholder','Заполните это поле');
			showmsg('Поле "<b>'+$(this).attr('nameinput')+'</b>" необходимо заполнить');
			
			throw 'Required input! ';
			// console.log($(this).attr('id'));
		}
	});
	console.log('well done :)');
	// XUTPULA coder 
}

function collect_value(){
	var form_start = $('.formcomposer').find('.input_bld');
	if(form_start.length == 0){
		var form_start = $('.formCustomPoser').find('.input_bld');
	}

	var unindexed_array = form_start.serializeArray();
	var indexed_array = {};	
	$.map(unindexed_array, function(n, i){
		indexed_array[n['name']] = n['value'];
	});
	return JSON.stringify(indexed_array);	
}



function GetPay(email,count,selectType,minCount,allcount,fund,coupon) {
	
if($('[logged_by_tg]').length == 0){

		// console.log($('[logged_by_tg]').length);
		
		    if (!validateEmail(email)) {

		    	 if($("meta[lang_cart]").length == 1){
		        var err = 'Please enter valid email';
		    	}else{
		    		  var err = 'Указан неверный email адрес';
		    	}
		        showerr(err);
		        return false;
			}

	}


	if (parseInt(count) < parseInt(minCount)) {
	var err = 'Мин. кол-во для заказа: ' + minCount;
	showerr(err);
	return false;
	}
	
	// if (parseInt(allcount) < parseInt(count)) {
		// var err = 'Такого количества товара нет';
		// showerr(err);
		// return false;
	// }
	
	// check_form_compos();
	
	if(parseInt(selectType) != 4){
		var function_order = '';
		check_form_compos();

	if (parseInt(allcount) < parseInt(minCount)) {
        var err = 'Мин. кол-во для заказа: ' + minCount;
        showerr(err);
        return false;
	}
    	if (parseInt(count) > parseInt(allcount)) {
		        var err = 'Такого количества товара нет';
		        showerr(err);
		        return false;
			} 

	}
	else{
		var function_order = 'createcart';
	}

	 if($("meta[lang_cart]").length == 1){
      
      var path = '/en/order/';
    }
    else{
      
           var path = '/order/';
    }

	
  		  var stateOrder = $('body').data('orderWait');
			if(parseInt(stateOrder) == 1){
				    showerr('Подождите....');
				    return false;
			}

			$('body').data('orderWait',1);

   	 $.post(path+function_order, {

		email: email,
		count: count,
		type: selectType,
		rules: $('input[name=rules_accept]:checked').val(),
		en_sub: $('input[name=email_sub]:checked').val(),
		cartItems:  $('input[name=cartItems]').val(),
		forms: collect_value(),
        fund: fund,
		'copupon': coupon
		}, function (data) {
			var res = JSON.parse(data);
			if (res.ok == 'TRUE') {
				
				if(res.redirect == 'yes'){
					window.location.replace(res.url);
				}
				else if(res.redirect == 'no'){
						$('body').data('orderWait',0);
					$('.paytable .payitem').text(res.name);
					$('.paytable .paycount').text(res.count);
					$('.paytable .payprice').text(res.price);
					$('.paytable .payfund').html(res.fund);
					$('.paytable .paybill').html(res.bill);
					$('.paytable .discount').html(res.discount);
					$('.paytable .bonuspr').html(res.bonus);
					$('.paytable .link').html(res.linkwm);
					$('.checkpaybtn').attr('onclick', "checkpay('" + res.check_url + "')");
					var newpay = $('.modalpay').attr('newpay');
					if(newpay == '1'){	
						var inst = $('[data-remodal-id=paymodal]').remodal();
						inst.open();
					}
					else{ 
						$('#paymodal').modal('toggle');
					}
				}
			}
			if (typeof (res.error) !== "undefined" && res.error !== null) {
					$('body').data('orderWait',0);
				showerr(res.error);
			}
			
	});
}
