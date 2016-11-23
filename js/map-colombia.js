// Helper functions
var utils = {
    translation: function (x,y) {
	return 'translate(' + x + ',' + y + ')';
    },
    parentWidth:function (elem){
	return elem.parentElement.clientWidth;
    },
    widthCalc: function (id){
	return this.parentWidth(document.getElementById(id));
    }
}

var mapColombia = {
    generate: function(dir,map_file,map_id,code){
	var instance = {
	    asset_dir: dir,
	    map_file: map_file,
	    mapID: map_id,
	    codPrefix: code,
	    margin: {top: 20, right: 40, bottom: 10, left: 100},
	    map: undefined,
	    mapClick: function(elem){
		this.loadMap(elem.id+'.svg');
	    },
	    initVars:function(id){
		// Calculate variables to render
		this.width = utils.widthCalc(id) - this.margin.left - this.margin.right;
		// ToDo: find ratio, for now will be 1
		this.height = (this.width*1) - this.margin.top - this.margin.bottom;
	    },
	    loadMap: function(file){
		var that = this;
		that.map_file = file;
		that.initVars(map_id);
		d3.xml(that.asset_dir+'/'+that.map_file, "image/svg+xml", function(error, xml) {
		    if (error){
			console.log('Load map error:',error);
			return;
		    };
		    if(document.getElementById(that.mapID).innerHTML != ''){
			d3.select('#'+that.mapID)
			    .transition().delay(500)
			    .style('opacity',0)
			    .each('end',load);
		    }else{
			load(that.asset_dir+'/'+that.map_file);
		    }
		    function load(url){
			document.getElementById(that.mapID).innerHTML = '';
			document.getElementById(that.mapID).appendChild(xml.documentElement);
			that.map = d3.select('#'+that.mapID).selectAll('svg');
			that.map.attr('width',that.width).attr('height',that.height);
			that.map.selectAll('path').on('click',function (){that.mapClick(this)});
			d3.select('#'+that.mapID).transition().delay(500).style('opacity',1);
		    }
		});
	    }
	};
	instance.loadMap(instance.map_file);
	return instance;
    }
}

$(document).ready(function(){
    var map = back();
});
function back(){
    return  mapColombia.generate('assets','ColombiaMap.svg','svg-map','divi-');
}
