/*
Save Charts Plugin for flot charts.

Copyright (c) 2014 Subhajit Dey.
Licensed under the MIT license.


* Created by Subhajit Dey

The plugin supports these options:


Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



 */
(function ($) {
    var options = { 
    	saveChart:{
	    show:false,								
	}	
    };

    var btnStyle = '.flotbtn {'
		+'display: inline-block;'
		+'background: rgb(102,133,164);'
		+'border: 1px solid #a1a1a1;'
		+'padding: 0 5px;'
		+'margin: 3px -15px 3px;'
		+'font: Arial, Helvetica;'
		+'text-decoration: none;'
		+'color: #fff;'
		+'border-radius: .2em;'
		+'cursor:pointer;'
		+'}'
		+'.flotbtn:before{'
		+'width: 1em;'
		+'text-align: center;'
		+'font-size: 1.7em;'
		+'margin: 0 0.5em 0 -1em;'
		+'padding: 0 .2em;'
		+'pointer-events: none;'
		+'}';

    $('head').append('<style>'+btnStyle+'</style>');

    function canvasSupported() {
        return !!document.createElement('canvas').getContext;
    }

    function canvasTextSupported() {
        if (!canvasSupported()) {
            return false;
        }
        var dummy_canvas = document.createElement('canvas');
        var context = dummy_canvas.getContext('2d');
        return typeof context.fillText == 'function';
    }

    function getText2Canvas(textholder,placeholder) {
    	$(placeholder).append('<canvas style="display:none;" class="sb-canvas-elemnt" '
		+'width="'+($(placeholder).width() || $(placeholder).find('canvas').width())
		+'" height="'+($(placeholder).height() || $(placeholder).find('canvas').height() )+'" ></canvas>');

    	var ctx = $('.sb-canvas-elemnt')[0].getContext("2d");
    	ctx.font="12px arial";
		
    	if($(placeholder).find('.flot-x-axis').length > 0){
    		var top = 0;
    		var left = 0;
    		$(placeholder).find('.flot-x-axis').find('div').each(function(){    			
    			top = parseInt($(this).css('top'))+12;
    			left = parseInt($(this).css('left'));
    			ctx.fillText($($(this)).text(),left,top);    			
    		});
    	}

    	if($(placeholder).find('.flot-y-axis').length > 0){
    		var top = 0;
    		var left = 0;
    		$(placeholder).find('.flot-y-axis').find('div').each(function(){
    			
    			top = parseInt($(this).css('top'))+12;

    			left = parseInt($(this).css('left'));
    			ctx.fillText($($(this)).text(),left,top);
    			console.log(top+' '+left+' '+$(this).text() );    			
    			
    		});
    	}


    	console.log();	
    	return ctx;
    }

    function dataFile(bs64data) { 
    	var binary = atob(bs64data.split(',')[1]); // atob() decode base64 data.. 
    	var array = []; 
    	for (var i = 0; i < binary.length; i++) { 
    		array.push(binary.charCodeAt(i));	// convert to binary.. 
    	} 
    	var file = new Blob([new Uint8Array(array)], {type: 'image/png'});
    	return file;
    }

    /*
	The function download src is taken from 
	http://stackoverflow.com/questions/15946084/save-javascript-output-as-textfile
	User Handle : TheBrain
    */

    function download(blobData,filename) {
    	var a = document.createElement('a');	     
	a.href = window.URL.createObjectURL(blobData);
	a.download = filename;
	a.click();
    }


    function initClickEvent(placeholder,plot){
	$(placeholder).find('.flotbtn').click(function(){
	    $(placeholder).append('<div class="flot-tmp-div" style="display:none;width:'
	    		+$(placeholder).width()+';height:'+$(placeholder).height()+'"></div>');
	    var myCanvas = plot.getCanvas();
	    var image = myCanvas.toDataURL();
            
	    $(placeholder).find('.flot-tmp-div').append('<canvas class="flot-tmp-canvas" width="'
	    		+($(placeholder).width()+12)+'" height="'+($(placeholder).height()+12)+'" ></canvas>');

	    var ctx = $(placeholder).find('.flot-tmp-div').find('canvas')[0].getContext("2d");

	    var img = new Image($(placeholder).find('.flot-tmp-div'));

	    var textCanvas = getText2Canvas('flot-text',placeholder);
		
	    img.src = image.toString();
	    ctx.drawImage(img,0,0);		
		
	    image = textCanvas.canvas.toDataURL();
		
		
	    img.src = image.toString();
	    ctx.drawImage(img,0,0);
		
	    image = $(placeholder).find('.flot-tmp-div').find('canvas')[0].toDataURL("image/png");
	    $(placeholder).find('.flot-tmp-div').each(function(){
		$(this).remove();
	    });
		
	    $('.sb-canvas-elemnt').remove();
	    
	    download(dataFile(image),'chart.png');		
		
	});
    }

    function insertSaveButton(placeholder){
	$(placeholder).append('<div class="savechart" ><table><tr><td><span class="flotbtn flotsave" title="Save Chart" > Save</span></td></tr></table></div>');
	$(placeholder).children('.savechart').children('table').css('position','absolute');
	$(placeholder).children('.savechart').children('table').css('top',10);
	$(placeholder).children('.savechart').children('table').css('right',50);
    }

    function init(plot){
	plot.hooks.draw.push( function (plot, ctx) {
	    var origOptions = plot.options // Flot 0.7
	                      || plot.getOptions() // Flot 0.6
		              || plot.getOptions(); // Flot 1.1 
	    if(!origOptions.saveChart.show) return;

	    insertSaveButton(plot.getPlaceholder());	
	    initClickEvent(plot.getPlaceholder(),plot);
		
	});

    }

		
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'saveChart',
        version: '1.0'
    });
})(jQuery);
