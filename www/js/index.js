var order = [];

$('#book').on('pageinit', function(event){
	addPageFor('restaurant', restaurants, 'show_restaurant', '选餐厅');
	addPageFor('user', users, 'show_user', '选人');
	addPageStructure('food_suit', '选择套餐');
	
	$('a#choose_suit').click(generateFoodSuit());
	$('a#confirm').click(confirm());
});
$('#front_page').init('pageinit', function(event){
	$('a#order').click(generateOrders());
});

function generateOrders(){
	return function(){
		var totalPrice = 0;
		var bookedPeopleNumber = order.length;
		var unbookedPeopleNumber = users.length - bookedPeopleNumber;
		$('#order_list li').remove();
		$('<li data-role="list-divider">'+order.length+'人已定</li>').appendTo('#order_list');
		var bookedUsers = [];
		for (var i in order){
			//collect the ordered user names
			bookedUsers.push(order[i].user);
			var bookedItem = '<span class="ui-li-heading">' + order[i].user + '</span>';
			
			//calculate price and total price
			var foodPrice = getFoodPrice(order[i].restaurant, order[i].suit);
			totalPrice += foodPrice;
			foodPrice = foodPrice.toFixed(2);
			
			//if price is larger that 15, it will be in red color
			if (foodPrice > 15){
				bookedItem += '<span class="ui-li-desc ui-li-aside" style="color:red;">￥&nbsp' + foodPrice + '</span>';	
			}else{
				bookedItem += '<span class="ui-li-desc ui-li-aside">￥&nbsp' + foodPrice + '</span>';
			}
			//add restaurant info and food suit info
			bookedItem += '<p><span>' + order[i].restaurant +'</span>&nbsp&nbsp'+'<span>'+order[i].suit+ '</span></p>'
			//add li
			$('<li style="line-height:30px;">'+bookedItem+'</li>').appendTo('#order_list');
		}
		printUnbookedUsers(bookedUsers);
		$('#order_footer h3').remove();
		$('#order_footer').append('<h3>'+bookedPeopleNumber + '人已定, ' + unbookedPeopleNumber + '人未定, '+'总计' + totalPrice + '元'+'</h3>');
		$('#order_list').listview('refresh');
	};
}

function getFoodPrice(restaurant, suit){
	var restaurant_foods = foods[restaurant];
	for(var s in restaurant_foods){
		if(restaurant_foods[s].name === suit){
			return restaurant_foods[s].price;
		}
	}
}

function printUnbookedUsers(bookedUsers){
	$('<li data-role="list-divider">'+ (users.length-order.length) +'人未定</li>').appendTo('#order_list');
	for (var u in users){
		if ($.inArray(users[u].name, bookedUsers) === -1){
			$('<li style="line-height:30px;">' +users[u].name+'</li>').appendTo('#order_list');
		}
	}
}

function storeOrder(){
	var restaurant = $('#show_restaurant').val();
	var user = $('#show_user').val();
	var suit = $('#show_suits').val();
	order.push({'user' : user, 'restaurant' : restaurant, 'suit' : suit});
}

function confirm(){
	return function(e){
		if ($('#show_restaurant').val() === '' || $('#show_user').val() === '' || $('#show_suits').val() === ''){
			alert("请确保所有选项都已选择！");
			cancelClickEvent(e);
		}else{
			storeOrder();
			alert('恭喜，您成功为' + $('#show_user').val() + '订饭！');
			clearInfo();
		}
	}
}

function clearInfo(){
	$('#show_restaurant').val('');
	$('#show_user').val('');
	$('#show_suits').val('');
}

function emptyFields(){
	$('#show_restaurant').val('');
	$('#show_user').val('');
	$('#show_suits').val('');
}

function cancelClickEvent(e){
	e.stopPropagation();
	e.preventDefault();
}

function addFoodList(){
	$('#food_suit_list li').remove();
	var restaurant = $('#show_restaurant').val();
	addFood('food_suit_list', foods[restaurant], 'show_suits');
	$('#food_suit_list').listview('refresh');

}

function generateFoodSuit(){
	return function(e){
		if (($('#show_restaurant').val()) === ''){
			alert("请先选择餐厅.");
			cancelClickEvent(e);
		}else{
			addFoodList();
		}
	};
}

function addPageFor(page, data, placeToShow, headerText){
	addPageStructure(page, headerText);
	addPageList(page+'_list', data, placeToShow);
}

function addPageStructure(page, headerText){
	var elements = [
	        	    {
	        	    	comments:'add page for' + page,
	        	    	element:'<div data-role="page" id=' + page + '></div>',
	        	    	fatherTag:'body'
	        	    },
	        	    {
	        	    	comments:'add header',
	        	    	element:'<div data-role="header"></div>',
	        	    	fatherTag:'#'+page
	        	    },
	        	    {
	        	    	comments:'add back button',
	        	    	element:'<a data-rel="back">Back</a>',
	        	    	fatherTag:'#' + page + '>div'
	        	    },
	        	    {
	        	    	comments:'add header text',
	        	    	element:'<h1>'+headerText+'</h1>',
	        	    	fatherTag:'#' + page+'>div'
	        	    },
	        	    {
	        	    	comments:'add the content',
	        	    	element:'<div data-role="content" id=' + page + "_content" + '></div>',
	        	    	fatherTag:'#'+page
	        	    },
	        	    {
	        	    	comments:'ul list',
	        	    	element:'<ul data-role="listview" id='+page+"_list" + '></ul>',
	        	    	fatherTag:'#'+ page +'_content'
	        	    }
	        	];
	for(var i in elements){
		$(elements[i].element).appendTo(elements[i].fatherTag);
	}
}

function clickToFillContent(content, placeToShow){
	return function(){
		$('#'+placeToShow).val(content);
	}
}

function addPageList(fatherTag, data, placeToShow){
	for (var j in data){
		var name = data[j].name;
		$('<li><a href="#book">'+name+'</a></li>').click(clickToFillContent(name, placeToShow)).appendTo('#'+fatherTag);
	}
}

function addFood(fatherTag, data, placeToShow){
	for (var j in data){
		var name = data[j].name;
		var price = data[j].price.toFixed(2);
		//$('<li><a href="#book"><span class="ui-li-heading">' + name + '</span><span class="ui-li-desc ui-li-aside">￥ '+ price +'</span></a></li>').click(clickToFillContent(name, placeToShow)).appendTo('#' + fatherTag);
		$('<li><a href="#book">' + name + '<span class="ui-li-count">￥ '+ price +'</span></a></li>').click(clickToFillContent(name, placeToShow)).appendTo('#' + fatherTag);
	}
}

