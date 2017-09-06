$(function() {
	$( "#slider-range-min" ).slider({
		range: "min",
		value: 37,
		min: 0,
		max: 100,
		
		
		slide: function( event, ui ) {
		$( "#amount" ).val( "" + ui.value );
		$( "#amount2" ).val( "" + ui.value );
		}
	});
	$( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
	$( "#amount2" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
});