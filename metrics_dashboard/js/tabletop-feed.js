var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function(){

    initializeTabletopObject(spreadsheet_url);

});

// pull data from google spreadsheet
function initializeTabletopObject(dataSpreadsheet){
    var tabletop = Tabletop.init({
        key: dataSpreadsheet,
        simpleSheet: true,
        debug: false,
        callback: writeTableWith
    });
    

    

}

// create table headers
function createTableColumns(){

    /* swap out the properties of mDataProp & sTitle to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [
        {"mDataProp": "Metric", "sTitle": "Type", "sClass": "center"},
		{"mDataProp": "Part", "sTitle": "Metric", "sClass": "center"},
        {"mDataProp": "Current", "sTitle": "Current Value", "sClass": "center"},
        {"mDataProp": "percent", "sTitle": "% to Goal", "sClass": "center"},
		{"mDataProp": "End of March", "sTitle": "End of March Goal", "sClass": "center"},
        {"mDataProp": "End of June", "sTitle": "End of June Goal", "sClass": "center"},
        {"mDataProp": "2015 Goal", "sTitle": "2015 Goal", "sClass": "center"}
        
	];
    return tableColumns;
}

// create the table container and object
function writeTableWith(dataSource){

    jqueryNoConflict("#demo").html("<table cellpadding='0' cellspacing='0' border='0' class='display table table-bordered table-striped' id='data-table-container'></table>");

    var oTable = jqueryNoConflict("#data-table-container").dataTable({
        "columnDefs": [
            { "visible": false, "targets": 0 }
        ],
        "paginate": false,
        "searching": false,
        "sort": false,
        "info": false,
        "iDisplayLength": 25,
        "aaData": dataSource,
        "aoColumns": createTableColumns(),
        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
            console.log(aData);
            return nRow;
        },
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    });

};

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort["string-case-asc"]  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort["string-case-desc"] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};