(function() {
	$(document).ready(function() {
		var initialDataDump = $('script[data-hypernova-key="p2footerbundlejs"]').text();
		var initialData = JSON.parse(initialDataDump.slice(4, initialDataDump.length-3));
		
		getDataForSearchResults(initialData.searchResults, initialData.metadata.geography.lat, initialData.metadata.geography.lng);
	});
	
	$(document).bind("ajaxComplete", function(e, xhr) {
		if (xhr.responseJSON && xhr.responseJSON.results_json && xhr.responseJSON.results_json.search_results) {
			getDataForSearchResults(xhr.responseJSON.results_json.search_results, xhr.responseJSON.center_lat, xhr.responseJSON.center_lng);			
		}
	});
	
	setInterval(function () {
		$(".panel-card-section a.text-normal[target]:has(.listing-location):not(:has(.aircommuter))").each(function() {
			var t = $(this).attr("target");
			$("a.text-normal[target='"+t+"'] .aircommuter")
				.first()
				.clone()
				.prependTo($(".listing-location", $(this)));
		});
	},200);
	
	function getDataForSearchResults(results, lat, lng) {
		for (var i in results) {
			var listing = results[i].listing;
			getData(listing.id, listing.lat, listing.lng, lat, lng);
		}
	}
	
	// Currently unused due to API rate limitations
	function getDataGoogle(listingId, lat, lng, clat, clng) {
		var weekDay = (new Date().getDay() + 6)%7;
		var nextMonday = new Date();
		nextMonday.setDate(nextMonday.getDate() + 7 - weekDay);
		nextMonday.setHours(9,0);
		
		$.ajax({
			url: "https://maps.googleapis.com/maps/api/directions/json", 
			type: "GET",
			dataType: "jsonp",
		
			crossDomain:true,
			data: {
				origin: "" + lat + "," + lng,
				destination: "" + clat + "," + clng,
				mode: "transit",
				region: "GB",
				arrival_time: Math.floor(nextMonday.getTime() / 1000)
				//transit_mode: "rail"
			},
			success: function(d){console.log(d)}
		});		
	}
	
	function getData(listingId, lat, lng, clat, clng) {
		var weekDay = (new Date().getDay() + 6)%7;
		var nextMonday = new Date();
		nextMonday.setDate(nextMonday.getDate() + 7 - weekDay);
		var dateString = "" + nextMonday.getFullYear();
		dateString += nextMonday.getMonth() < 9 ? "0" : "";
		dateString += (nextMonday.getMonth() + 1)
		dateString += nextMonday.getDay() < 9 ? "0" : "";
		dateString += (nextMonday.getDay() + 1)
		
		$.ajax({
			url: "https://api.tfl.gov.uk/Journey/JourneyResults/"+ lat +"," + lng +"/to/" + clat +"," + clng, 
			data: {mode:"tube,overground,dlr", date: dateString, time:"0900", timels:"arriving", walkingSpeed:"fast"}, 
			success: function(data) {				
						var tubeStages = [], walkingTime = 0;
						for(var j in data.journeys[0].legs) {
							var modename = data.journeys[0].legs[j].mode.name
							if (["tube", "drl", "overground"].indexOf(modename) !== -1) {
								tubeStages.push(data.journeys[0].legs[j].instruction.summary)
							} else if (modename === "walking") {
								walkingTime += data.journeys[0].legs[j].duration;
							}
						}
						var journeySummary = tubeStages.join(" -> ") + " (" + walkingTime +" mins walking)";
						injectInfo(listingId, lat, lng, clat, clng, {duration: data.journeys[0].duration, summary: journeySummary});
					
									
			},
			error: function() {
				injectInfo(listingId, lat, lng, clat, clng,{duration: null, summary: null })
			}
		});
	}
	
	function injectInfo(listingId, lat, lng, clat, clng, journey) {
		var selector = "a.text-normal[target='listing_"+listingId+"'] > div";
		$(".aircommuter", selector).remove();
		
		var weekDay = (new Date().getDay() + 6)%7;
		var nextMonday = new Date();
		nextMonday.setDate(nextMonday.getDate() + 7 - weekDay);
		nextMonday.setHours(10,0);
		
		var newSpan = $("<span class='aircommuter'> · </span>")
			.prependTo($(selector))
			.attr("title", journey.summary || "Click for travel time");
		$("<a>" + (journey.duration || "?") + " mins</a>")
			.attr("href", "https://www.google.co.uk/maps/dir/" + lat + "," +lng + "/" + clat +","+ clng+"/data=!4m9!4m8!2m6!5e1!5e2!5e3!6e1!7e2!8j"+ (100 *Math.floor(nextMonday.getTime() / 100000)) +"!3e3")
			.attr("target", "_blank")
			.prependTo(newSpan);	
	}
})();